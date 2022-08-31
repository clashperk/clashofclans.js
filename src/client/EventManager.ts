import { Clan, ClanWar, Player } from '../struct';
import { HTTPError } from '../rest/HTTPError';
import { PollingEvents } from '../util/Constants';
import { Util } from '../util/Util';
import { PollingClient } from './PollingClient';

/** Represents PollingEvent Manager of the {@link Client}. */
export class PollingEventManager {
	private readonly _clanTags = new Set<string>();
	private readonly _playerTags = new Set<string>();
	private readonly _warTags = new Set<string>();

	private readonly _clans = new Map<string, Clan>();
	private readonly _players = new Map<string, Player>();
	private readonly _wars = new Map<string, ClanWar>();

	private readonly _pollingEvents = {
		clans: [] as {
			name: string;
			filter: (oldClan: Clan, newClan: Clan) => Promise<boolean> | boolean;
		}[],
		wars: [] as {
			name: string;
			filter: (oldWar: ClanWar, newWar: ClanWar) => Promise<boolean> | boolean;
		}[],
		players: [] as {
			name: string;
			filter: (oldPlayer: Player, newPlayer: Player) => Promise<boolean> | boolean;
		}[]
	};

	private _inMaintenance: boolean;
	private _maintenanceStartTime: Date | null;

	public constructor(private readonly client: PollingClient) {
		this._inMaintenance = Boolean(false);
		this._maintenanceStartTime = null;
	}

	/** Initialize the PollingEvent Manager to start pulling the data by polling api. */
	public async init(): Promise<string[]> {
		this.seasonEndHandler();
		this.maintenanceHandler();

		this.clanUpdateHandler();
		this.playerUpdateHandler();
		this.warUpdateHandler();

		return Promise.resolve(this.client.eventNames() as string[]);
	}

	/** Add clan tags to clan polling events. */
	public addClans(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			this._clanTags.add(this.client.util.formatTag(tag));
		}
		return this;
	}

	/** Delete clan tags from clan polling events. */
	public deleteClans(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			const key = this.client.util.formatTag(tag);
			this._clans.delete(key);
			this._clanTags.delete(key);
		}
		return this;
	}

	/** Add player tags for player polling events. */
	public addPlayers(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			this._playerTags.add(this.client.util.formatTag(tag));
		}
		return this;
	}

	/** Delete player tags from player polling events. */
	public deletePlayers(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			const key = this.client.util.formatTag(tag);
			this._players.delete(key);
			this._playerTags.delete(key);
		}
		return this;
	}

	/** Add clan tags for war polling events. */
	public addWars(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			this._warTags.add(this.client.util.formatTag(tag));
		}
		return this;
	}

	/** Delete clan tags from war polling events. */
	public deleteWars(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			const key = this.client.util.formatTag(tag);
			this._wars.delete(`${key}:${1}`);
			this._wars.delete(`${key}:${2}`);
			this._warTags.delete(key);
		}
		return this;
	}

	/**
	 * Set your own custom clan polling event.
	 *
	 * In order to emit the custom polling event, you must have this filter function that returns a boolean.
	 *
	 * @example
	 * ```js
	 * client.pollingEvents.addClans(['#2PP', '#8QU8J9LP']);
	 *
	 * client.pollingEvents.setClanEvent({
	 *   name: 'clanMemberUpdate',
	 *   filter: (oldClan, newClan) => {
	 *     return oldClan.memberCount !== newClan.memberCount;
	 *   }
	 * });
	 *
	 * client.on('clanMemberUpdate', (oldClan, newClan) => {
	 *   console.log(oldClan.memberCount, newClan.memberCount);
	 * });
	 *
	 * (async function () {
	 *   await client.pollingEvents.init();
	 * })();
	 * ```
	 * @returns
	 */
	public setClanEvent(event: { name: string; filter: (oldClan: Clan, newClan: Clan) => boolean }) {
		if (!event.name) throw new Error('Event name is required.');
		if (typeof event.filter !== 'function') throw new Error('Filter function is required.');

		this._pollingEvents.clans.push(event);
		return this;
	}

	/**
	 * Set your own custom war event.
	 *
	 * In order to emit the custom event, you must have this filter function that returns a boolean.
	 */
	public setWarEvent(event: { name: string; filter: (oldWar: ClanWar, newWar: ClanWar) => boolean }) {
		if (!event.name) throw new Error('Event name is required.');
		if (typeof event.filter !== 'function') throw new Error('Filter function is required.');

		this._pollingEvents.wars.push(event);
		return this;
	}

	/**
	 * Set your own custom player event.
	 *
	 * In order to emit the custom event, you must have this filter function that returns a boolean.
	 */
	public setPlayerEvent(event: { name: string; filter: (oldPlayer: Player, newPlayer: Player) => boolean }) {
		if (!event.name) throw new Error('Event name is required.');
		if (typeof event.filter !== 'function') throw new Error('Filter function is required.');

		this._pollingEvents.players.push(event);
		return this;
	}

	private async maintenanceHandler() {
		setTimeout(this.maintenanceHandler.bind(this), 10_000).unref();
		try {
			const res = await this.client.rest.getClans({ maxMembers: Math.floor(Math.random() * 40) + 10, limit: 1 });
			if (res.status === 200 && this._inMaintenance) {
				this._inMaintenance = Boolean(false);
				const duration = Date.now() - this._maintenanceStartTime!.getTime();
				this._maintenanceStartTime = null;

				this.client.emit(PollingEvents.MaintenanceEnd, duration);
			}
		} catch (error) {
			if (error instanceof HTTPError && error.status === 503 && !this._inMaintenance) {
				this._inMaintenance = Boolean(true);
				this._maintenanceStartTime = new Date();

				this.client.emit(PollingEvents.MaintenanceStart);
			}
		}
	}

	private seasonEndHandler() {
		const end = Util.getSeasonEndTime().getTime() - Date.now();
		// Why this? setTimeout can be up to 24.8 days or 2147483647ms [(2^31 - 1) Max 32bit Integer]
		if (end > 24 * 60 * 60 * 1000) {
			setTimeout(this.seasonEndHandler.bind(this), 60 * 60 * 1000);
		} else if (end > 0) {
			setTimeout(() => {
				this.client.emit(PollingEvents.NewSeasonStart, Util.getSeasonId());
			}, end + 100).unref();
		}
	}

	private async clanUpdateHandler() {
		this.client.emit(PollingEvents.ClanLoopStart);
		for (const tag of this._clanTags) await this.runClanUpdate(tag);
		this.client.emit(PollingEvents.ClanLoopEnd);

		setTimeout(this.clanUpdateHandler.bind(this), 10_000);
	}

	private async playerUpdateHandler() {
		this.client.emit(PollingEvents.PlayerLoopStart);
		for (const tag of this._playerTags) await this.runPlayerUpdate(tag);
		this.client.emit(PollingEvents.PlayerLoopEnd);

		setTimeout(this.playerUpdateHandler.bind(this), 10_000);
	}

	private async warUpdateHandler() {
		this.client.emit(PollingEvents.WarLoopStart);
		for (const tag of this._warTags) await this.runWarUpdate(tag);
		this.client.emit(PollingEvents.WarLoopEnd);

		setTimeout(this.warUpdateHandler.bind(this), 10_000);
	}

	private async runClanUpdate(tag: string) {
		if (this._inMaintenance) return null;

		const clan = await this.client.getClan(tag).catch(() => null);
		if (!clan) return null;

		const cached = this._clans.get(clan.tag);
		if (!cached) return this._clans.set(clan.tag, clan);

		for (const { name, filter } of this._pollingEvents.clans) {
			try {
				if (!(await filter(cached, clan))) continue;
				this.client.emit(name, cached, clan);
			} catch (error) {
				this.client.emit(PollingEvents.Error, error);
			}
		}

		return this._clans.set(clan.tag, clan);
	}

	private async runPlayerUpdate(tag: string) {
		if (this._inMaintenance) return null;

		const player = await this.client.getPlayer(tag).catch(() => null);
		if (!player) return null;

		const cached = this._players.get(player.tag);
		if (!cached) return this._players.set(player.tag, player);

		for (const { name, filter } of this._pollingEvents.players) {
			try {
				if (!(await filter(cached, player))) continue;
				this.client.emit(name, cached, player);
			} catch (error) {
				this.client.emit(PollingEvents.Error, error);
			}
		}

		return this._players.set(player.tag, player);
	}

	private async runWarUpdate(tag: string) {
		if (this._inMaintenance) return null;

		const clanWars = await this.client.getWars(tag).catch(() => null);
		if (!clanWars?.length) return null;

		clanWars.forEach(async (war, index) => {
			const key = `${tag}:${index}`;
			const cached = this._wars.get(key);
			if (!cached) return this._wars.set(key, war);

			for (const { name, filter } of this._pollingEvents.wars) {
				try {
					if (!(await filter(cached, war))) continue;
					this.client.emit(name, cached, war);
				} catch (error) {
					this.client.emit(PollingEvents.Error, error);
				}
			}

			// check for war end
			if (index === 1 && cached.warTag !== war.warTag) {
				const data = await this.client.getLeagueWar({ clanTag: tag, round: 'PreviousRound' }).catch(() => null);
				if (data && data.warTag === cached.warTag) {
					for (const { name, filter } of this._pollingEvents.wars) {
						try {
							if (!(await filter(cached, data))) continue;
							this.client.emit(name, cached, data);
						} catch (error) {
							this.client.emit(PollingEvents.Error, error);
						}
					}
				}
			}

			return this._wars.set(key, war);
		});
	}
}
