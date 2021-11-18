import { Clan, ClanWar, Player } from '../struct';
import { HTTPError } from '../rest/HTTPError';
import { EVENTS } from '../util/Constants';
import { Util } from '../util/Util';
import { Client } from './Client';

/** Represents Event Manager of the {@link Client} class. */
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
			fn: (oldClan: Clan, newClan: Clan) => boolean;
		}[],
		wars: [] as {
			name: string;
			fn: (oldWar: ClanWar, newWar: ClanWar) => boolean;
		}[],
		players: [] as {
			name: string;
			fn: (oldPlayer: Player, newPlayer: Player) => boolean;
		}[]
	};

	private _inMaintenance: boolean;
	private _maintenanceStartTime: Date | null;

	public constructor(private readonly client: Client) {
		this._inMaintenance = Boolean(false);
		this._maintenanceStartTime = null;
	}

	/** Initialize the Event Manager to start pulling. */
	public async init() {
		this.seasonEndHandler();
		this.maintenanceHandler();

		this.clanUpdateHandler();
		this.playerUpdateHandler();
		this.warUpdateHandler();

		return Promise.resolve(this.client.eventNames());
	}

	/** Add a clan tag to clan events. */
	public addClans(...tags: string[]) {
		for (const tag of tags) {
			this._clanTags.add(this.client.util.parseTag(tag));
		}
		return this;
	}

	/** Delete a clan tag from clan events. */
	public deleteClans(...tags: string[]) {
		for (const tag of tags) {
			this._warTags.delete(this.client.util.parseTag(tag));
		}
		return this;
	}

	/** Add a player tag for player events. */
	public addPlayers(...tags: string[]) {
		for (const tag of tags) {
			this._playerTags.add(this.client.util.parseTag(tag));
		}
		return this;
	}

	/** Delete a player tag from player events. */
	public deletePlayers(...tags: string[]) {
		for (const tag of tags) {
			this._warTags.delete(this.client.util.parseTag(tag));
		}
		return this;
	}

	/** Add a clan tag for war events. */
	public addWars(...tags: string[]) {
		for (const tag of tags) {
			this._warTags.add(this.client.util.parseTag(tag));
		}
		return this;
	}

	/** Delete a clan tag from war events. */
	public deleteWars(...tags: string[]) {
		for (const tag of tags) {
			this._warTags.delete(this.client.util.parseTag(tag));
		}
		return this;
	}

	/**
	 * Set your own custom clan event.
	 * @param event.name - Name of the event.
	 * @param event.filter - Filter of this event. Must return a boolean value.
	 *
	 * @example
	 * ```js
	 * client.events.addClans(['#2PP', '#8QUCPQ']);
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
	 * })
	 * ```
	 * @returns
	 */
	public setClanEvent(event: { name: string; filter: (oldClan: Clan, newClan: Clan) => boolean }) {
		this._events.clans.push({ name: event.name, fn: event.filter });
		return this;
	}

	/**
	 * Set your own custom war event.
	 * @param event.name - Name of the event.
	 * @param event.filter - Filter of this event. Must return a boolean value.
	 */
	public setWarEvent(event: { name: string; filter: (oldWar: ClanWar, newWar: ClanWar) => boolean }) {
		this._events.wars.push({ name: event.name, fn: event.filter });
		return this;
	}

	/**
	 * Set your own custom player event.
	 * @param event.name - Name of the event.
	 * @param event.filter - Filter of this event. Must return a boolean value.
	 */
	public setPlayerEvent(event: { name: string; filter: (oldPlayer: Player, newPlayer: Player) => boolean }) {
		this._events.players.push({ name: event.name, fn: event.filter });
		return this;
	}

	private async maintenanceHandler() {
		setTimeout(this.maintenanceHandler.bind(this), 10_000).unref();
		try {
			const res = await this.client.rest.getClans({ maxMembers: Math.floor(Math.random() * 40) + 10, limit: 1 });
			if (res.status === 200 && this._inMaintenance) {
				this._inMaintenance = Boolean(false);
				const duration = this._maintenanceStartTime!.getTime() - Date.now();
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
			setTimeout(this.seasonEndHandler.bind(this), 60 * 60 * 1000).unref();
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

		setTimeout(this.playerUpdateHandler.bind(this), 10_0000);
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

		for (const { name, fn } of this._events.clans) {
			try {
				if (!fn(cached, clan)) continue;
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

		for (const { name, fn } of this._events.players) {
			try {
				if (!fn(cached, player)) continue;
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

		clanWars.forEach((war, i) => {
			const key = `WAR:${i}:${tag}`;
			const cached = this._wars.get(key);
			if (!cached) return this._wars.set(key, war);

			for (const { name, fn } of this._events.wars) {
				try {
					if (!fn(cached, war)) continue;
					this.client.emit(name, cached, war);
				} catch (error) {
					this.client.emit(EVENTS.ERROR, error);
				}
			}

			return this._wars.set(key, war);
		});
	}
}

export interface EventTypes {
	CLAN: [oldClan: Clan, newClan: Clan];
	PLAYER: [oldPlayer: Player, newPlayer: Player];
	CLAN_WAR: [oldWar: ClanWar, newWar: ClanWar];
}
