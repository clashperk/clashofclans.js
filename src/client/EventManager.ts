import { Clan, ClanWar, Player } from '../struct';
import { HTTPError } from '../rest/HTTPError';
import { EVENTS } from '../util/Constants';
import { Util } from '../util/Util';
import { Client } from './Client';

/** Represents Event Manager of the {@link Client}. */
export class EventManager {
	private readonly _clanTags = new Set<string>();
	private readonly _playerTags = new Set<string>();
	private readonly _warTags = new Set<string>();

	private readonly _clans = new Map<string, Clan>();
	private readonly _players = new Map<string, Player>();
	private readonly _wars = new Map<string, ClanWar>();

	private readonly _events = {
		clans: [] as {
			name: string;
			filter: (oldClan: Clan, newClan: Clan) => boolean;
		}[],
		wars: [] as {
			name: string;
			filter: (oldWar: ClanWar, newWar: ClanWar) => boolean;
		}[],
		players: [] as {
			name: string;
			filter: (oldPlayer: Player, newPlayer: Player) => boolean;
		}[]
	};

	private _inMaintenance: boolean;
	private _maintenanceStartTime: Date | null;

	public constructor(private readonly client: Client) {
		this._inMaintenance = Boolean(false);
		this._maintenanceStartTime = null;
	}

	/** Initialize the Event Manager to start pulling. */
	public async init(): Promise<string[]> {
		this.seasonEndHandler();
		this.maintenanceHandler();

		this.clanUpdateHandler();
		this.playerUpdateHandler();
		this.warUpdateHandler();

		return Promise.resolve(this.client.eventNames() as string[]);
	}

	/** Add clan tags to clan events. */
	public addClans(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			this._clanTags.add(this.client.util.formatTag(tag));
		}
		return this;
	}

	/** Delete clan tags from clan events. */
	public deleteClans(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			const key = this.client.util.formatTag(tag);
			this._clans.delete(key);
			this._clanTags.delete(key);
		}
		return this;
	}

	/** Add player tags for player events. */
	public addPlayers(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			this._playerTags.add(this.client.util.formatTag(tag));
		}
		return this;
	}

	/** Delete player tags from player events. */
	public deletePlayers(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			const key = this.client.util.formatTag(tag);
			this._players.delete(key);
			this._playerTags.delete(key);
		}
		return this;
	}

	/** Add clan tags for war events. */
	public addWars(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			this._warTags.add(this.client.util.formatTag(tag));
		}
		return this;
	}

	/** Delete clan tags from war events. */
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
	 * Set your own custom clan event.
	 *
	 * In order to emit the custom event, you must have this filter function that returns a boolean.
	 *
	 * @example
	 * ```js
	 * client.events.addClans(['#2PP', '#8QU8J9LP']);
	 *
	 * client.events.setClanEvent({
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
	 *   await client.events.init();
	 * })();
	 * ```
	 * @returns
	 */
	public setClanEvent(event: { name: string; filter: (oldClan: Clan, newClan: Clan) => boolean }) {
		if (!event.name) throw new Error('Event name is required.');
		if (typeof event.filter !== 'function') throw new Error('Filter function is required.');

		this._events.clans.push(event);
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

		this._events.wars.push(event);
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

		this._events.players.push(event);
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

				this.client.emit(EVENTS.MAINTENANCE_END, duration);
			}
		} catch (error) {
			if (error instanceof HTTPError && error.status === 503 && !this._inMaintenance) {
				this._inMaintenance = Boolean(true);
				this._maintenanceStartTime = new Date();

				this.client.emit(EVENTS.MAINTENANCE_START);
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
				this.client.emit(EVENTS.NEW_SEASON_START, Util.getSeasonId());
			}, end + 100).unref();
		}
	}

	private async clanUpdateHandler() {
		this.client.emit(EVENTS.CLAN_LOOP_START);
		for (const tag of this._clanTags) await this.runClanUpdate(tag);
		this.client.emit(EVENTS.CLAN_LOOP_END);

		setTimeout(this.clanUpdateHandler.bind(this), 10_000);
	}

	private async playerUpdateHandler() {
		this.client.emit(EVENTS.PLAYER_LOOP_START);
		for (const tag of this._playerTags) await this.runPlayerUpdate(tag);
		this.client.emit(EVENTS.PLAYER_LOOP_END);

		setTimeout(this.playerUpdateHandler.bind(this), 10_000);
	}

	private async warUpdateHandler() {
		this.client.emit(EVENTS.WAR_LOOP_START);
		for (const tag of this._warTags) await this.runWarUpdate(tag);
		this.client.emit(EVENTS.WAR_LOOP_END);

		setTimeout(this.warUpdateHandler.bind(this), 10_000);
	}

	private async runClanUpdate(tag: string) {
		if (this._inMaintenance) return null;

		const clan = await this.client.getClan(tag).catch(() => null);
		if (!clan) return null;

		const cached = this._clans.get(clan.tag);
		if (!cached) return this._clans.set(clan.tag, clan);

		for (const { name, filter } of this._events.clans) {
			try {
				if (!filter(cached, clan)) continue;
				this.client.emit(name, cached, clan);
			} catch (error) {
				this.client.emit(EVENTS.ERROR, error);
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

		for (const { name, filter } of this._events.players) {
			try {
				if (!filter(cached, player)) continue;
				this.client.emit(name, cached, player);
			} catch (error) {
				this.client.emit(EVENTS.ERROR, error);
			}
		}

		return this._players.set(player.tag, player);
	}

	private async runWarUpdate(tag: string) {
		if (this._inMaintenance) return null;

		// @ts-expect-error
		const clanWars = await this.client._getClanWars(tag).catch(() => null);
		if (!clanWars?.length) return null;

		clanWars.forEach(async (war, index) => {
			const key = `${tag}:${index}`;
			const cached = this._wars.get(key);
			if (!cached) return this._wars.set(key, war);

			for (const { name, filter } of this._events.wars) {
				try {
					if (!filter(cached, war)) continue;
					this.client.emit(name, cached, war);
				} catch (error) {
					this.client.emit(EVENTS.ERROR, error);
				}
			}

			// check for war end
			if (index === 1 && cached.warTag !== war.warTag) {
				const data = await this.client.getLeagueWar({ clanTag: tag, round: 'PREVIOUS_ROUND' }).catch(() => null);
				if (data && data.warTag === cached.warTag) {
					for (const { name, filter } of this._events.wars) {
						try {
							if (!filter(cached, data)) continue;
							this.client.emit(name, cached, data);
						} catch (error) {
							this.client.emit(EVENTS.ERROR, error);
						}
					}
				}
			}

			return this._wars.set(key, war);
		});
	}
}
