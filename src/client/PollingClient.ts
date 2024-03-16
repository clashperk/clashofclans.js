import { HTTPError } from '../rest/HTTPError';
import { Clan, ClanWar, Player } from '../struct';
import { PollingClientOptions } from '../types';
import { PollingEvents } from '../util/Constants';
import { Client } from './Client';

/**
 * Represents a Polling Event Client.
 * ```js
 * const { PollingClient } = require('clashofclans.js');
 * const pollingClient = new PollingClient({ keys: ['***'] });
 * ```
 * @deprecated The API lacks socket-based real-time events. It is recommended to implement your own custom polling system.
 * Pull data at specified intervals, compare with previous values, and emit events on change.
 * Consider using Node.js clusters for efficient parallel processing.
 */
export class PollingClient extends Client {
	private readonly _clanTags = new Set<string>();
	private readonly _playerTags = new Set<string>();
	private readonly _warTags = new Set<string>();
	private readonly _pollingInterval: number;

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

	public inMaintenance: boolean;
	private _maintenanceStartTime: Date | null;

	public constructor(options?: PollingClientOptions) {
		super(options);

		this.inMaintenance = Boolean(false);
		this._maintenanceStartTime = null;

		if (options?.pollingInterval && !isNaN(options.pollingInterval)) {
			throw new Error('The property "pollingInterval" must be a type of number.');
		}

		this._pollingInterval = Math.max(options?.pollingInterval ?? 1000, 1000);
	}

	/** Initialize the PollingEvent Manager to start pulling the data by polling api. */
	public async init(): Promise<string[]> {
		this.seasonEndHandler();
		this.maintenanceHandler();

		this.clanUpdateHandler();
		this.playerUpdateHandler();
		this.warUpdateHandler();

		return Promise.resolve(this.eventNames() as string[]);
	}

	/** Add clan tags to clan polling events. */
	public addClans(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			this._clanTags.add(this.util.formatTag(tag));
		}
		return this;
	}

	/** Delete clan tags from clan polling events. */
	public deleteClans(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			const key = this.util.formatTag(tag);
			this._clans.delete(key);
			this._clanTags.delete(key);
		}
		return this;
	}

	/** Add player tags for player polling events. */
	public addPlayers(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			this._playerTags.add(this.util.formatTag(tag));
		}
		return this;
	}

	/** Delete player tags from player polling events. */
	public deletePlayers(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			const key = this.util.formatTag(tag);
			this._players.delete(key);
			this._playerTags.delete(key);
		}
		return this;
	}

	/** Add clan tags for war polling events. */
	public addWars(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			this._warTags.add(this.util.formatTag(tag));
		}
		return this;
	}

	/** Delete clan tags from war polling events. */
	public deleteWars(tags: string[] | string) {
		for (const tag of Array.isArray(tags) ? tags : [tags]) {
			const key = this.util.formatTag(tag);
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
	 * client.addClans(['#2PP', '#8QU8J9LP']);
	 *
	 * client.setClanEvent({
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
	 *   await client.init();
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
		setTimeout(this.maintenanceHandler.bind(this), this._pollingInterval).unref();
		if (!(this.listenerCount(PollingEvents.MaintenanceStart) && this.listenerCount(PollingEvents.MaintenanceEnd))) return;
		try {
			const { res } = await this.rest.getClans({ maxMembers: Math.floor(Math.random() * 40) + 10, limit: 1 });
			if (res.status === 200 && this.inMaintenance) {
				this.inMaintenance = Boolean(false);
				const duration = Date.now() - this._maintenanceStartTime!.getTime();
				this._maintenanceStartTime = null;

				this.emit(PollingEvents.MaintenanceEnd, duration);
			}
		} catch (error) {
			if (error instanceof HTTPError && error.status === 503 && !this.inMaintenance) {
				this.inMaintenance = Boolean(true);
				this._maintenanceStartTime = new Date();

				this.emit(PollingEvents.MaintenanceStart);
			}
		}
	}

	private seasonEndHandler() {
		const end = this.util.getSeason().endTime.getTime() - Date.now();
		// Why this? setTimeout can be up to 24.8 days or 2147483647ms [(2^31 - 1) Max 32bit Integer]
		if (end > 24 * 60 * 60 * 1000) {
			setTimeout(this.seasonEndHandler.bind(this), 60 * 60 * 1000);
		} else if (end > 0) {
			setTimeout(() => {
				this.emit(PollingEvents.NewSeasonStart, this.util.getSeasonId());
			}, end + 100).unref();
		}
	}

	private async clanUpdateHandler() {
		this.emit(PollingEvents.ClanLoopStart);
		for (const tag of this._clanTags) await this.runClanUpdate(tag);
		this.emit(PollingEvents.ClanLoopEnd);

		setTimeout(this.clanUpdateHandler.bind(this), this._pollingInterval);
	}

	private async playerUpdateHandler() {
		this.emit(PollingEvents.PlayerLoopStart);
		for (const tag of this._playerTags) await this.runPlayerUpdate(tag);
		this.emit(PollingEvents.PlayerLoopEnd);

		setTimeout(this.playerUpdateHandler.bind(this), this._pollingInterval);
	}

	private async warUpdateHandler() {
		this.emit(PollingEvents.WarLoopStart);
		for (const tag of this._warTags) await this.runWarUpdate(tag);
		this.emit(PollingEvents.WarLoopEnd);

		setTimeout(this.warUpdateHandler.bind(this), this._pollingInterval);
	}

	private async runClanUpdate(tag: string) {
		if (this.inMaintenance) return null;

		const clan = await this.getClan(tag).catch(() => null);
		if (!clan) return null;

		const cached = this._clans.get(clan.tag);
		if (!cached) return this._clans.set(clan.tag, clan);

		for (const { name, filter } of this._pollingEvents.clans) {
			try {
				if (!(await filter(cached, clan))) continue;
				this.emit(name, cached, clan);
			} catch (error) {
				this.emit(PollingEvents.Error, error);
			}
		}

		return this._clans.set(clan.tag, clan);
	}

	private async runPlayerUpdate(tag: string) {
		if (this.inMaintenance) return null;

		const player = await this.getPlayer(tag).catch(() => null);
		if (!player) return null;

		const cached = this._players.get(player.tag);
		if (!cached) return this._players.set(player.tag, player);

		for (const { name, filter } of this._pollingEvents.players) {
			try {
				if (!(await filter(cached, player))) continue;
				this.emit(name, cached, player);
			} catch (error) {
				this.emit(PollingEvents.Error, error);
			}
		}

		return this._players.set(player.tag, player);
	}

	private async runWarUpdate(tag: string) {
		if (this.inMaintenance) return null;

		const clanWars = await this.getWars(tag).catch(() => null);
		if (!clanWars?.length) return null;

		clanWars.forEach(async (war, index) => {
			const key = `${tag}:${index}`;
			const cached = this._wars.get(key);
			if (!cached) return this._wars.set(key, war);

			for (const { name, filter } of this._pollingEvents.wars) {
				try {
					if (!(await filter(cached, war))) continue;
					this.emit(name, cached, war);
				} catch (error) {
					this.emit(PollingEvents.Error, error);
				}
			}

			// check for war end
			if (index === 1 && cached.warTag !== war.warTag) {
				const data = await this.getLeagueWar({ clanTag: tag, round: 'PreviousRound' }).catch(() => null);
				if (data && data.warTag === cached.warTag) {
					for (const { name, filter } of this._pollingEvents.wars) {
						try {
							if (!(await filter(cached, data))) continue;
							this.emit(name, cached, data);
						} catch (error) {
							this.emit(PollingEvents.Error, error);
						}
					}
				}
			}

			return this._wars.set(key, war);
		});
	}
}

export interface PollingClient {
	emit: (<K extends keyof IPollingEvents>(event: K, ...args: IPollingEvents[K]) => boolean) &
		(<S extends string | symbol>(event: Exclude<S, keyof IPollingEvents>, ...args: any[]) => boolean);

	off: (<K extends keyof IPollingEvents>(event: K, listener: (...args: IPollingEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IPollingEvents>, listener: (...args: any[]) => void) => this);

	on: (<K extends keyof IPollingEvents>(event: K, listener: (...args: IPollingEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IPollingEvents>, listener: (...args: any[]) => void) => this);

	once: (<K extends keyof IPollingEvents>(event: K, listener: (...args: IPollingEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IPollingEvents>, listener: (...args: any[]) => void) => this);

	removeAllListeners: (<K extends keyof IPollingEvents>(event?: K) => this) &
		(<S extends string | symbol>(event?: Exclude<S, keyof IPollingEvents>) => this);

	/**
	 * Emits when a new season starts.
	 *
	 * **Parameters**
	 *
	 * | Name |   Type   | Description           |
	 * | :--: | :------: | :-------------------: |
	 * | `id` | `string` | Id of the new season. |
	 * @public
	 * @event
	 */
	newSeasonStart: string;

	/**
	 * Emits when maintenance break starts in the API.
	 * @public
	 * @event
	 */
	maintenanceStart: string;

	/**
	 * Emits when maintenance break ends in the API.
	 *
	 * **Parameters**
	 *
	 * |    Name    |   Type   |                    Description                     |
	 * | :--------: | :------: | :------------------------------------------------: |
	 * | `duration` | `number` | Duration of the maintenance break in milliseconds. |
	 * @public
	 * @event
	 */
	maintenanceEnd: string;

	/**
	 * Emitted for general debugging information.
	 * @public
	 * @event
	 */
	debug: string;

	/**
	 * Emitted when the client encounters an error.
	 * @public
	 * @event
	 */
	error: string;
}

interface IPollingEvents {
	[PollingEvents.ClanLoopStart]: [];
	[PollingEvents.ClanLoopEnd]: [];
	[PollingEvents.PlayerLoopStart]: [];
	[PollingEvents.PlayerLoopEnd]: [];
	[PollingEvents.WarLoopStart]: [];
	[PollingEvents.WarLoopEnd]: [];

	[PollingEvents.NewSeasonStart]: [id: string];
	[PollingEvents.MaintenanceStart]: [];
	[PollingEvents.MaintenanceEnd]: [duration: number];

	[PollingEvents.Error]: [error: unknown];
	[PollingEvents.Debug]: [path: string, status: string, message: string];
}
