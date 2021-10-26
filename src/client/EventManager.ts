import { Clan, ClanWar, Player } from '../struct';
import { EventTypes, Client } from './Client';
import { HTTPError } from '../rest/HTTPError';
import { EVENTS } from '../util/Constants';
import { Util } from '../util/Util';

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
			fn: (...args: EventTypes['CLAN']) => boolean;
		}[],
		wars: [] as {
			name: string;
			fn: (...args: EventTypes['CLAN_WAR']) => boolean;
		}[],
		players: [] as {
			name: string;
			fn: (...args: EventTypes['PLAYER']) => boolean;
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

	public addClans(...tags: string[]) {
		for (const tag of tags) this._clanTags.add(tag);
		return this;
	}

	public deleteClans(...tags: string[]) {
		for (const tag of tags) this._warTags.delete(tag);
		return this;
	}

	public addPlayers(...tags: string[]) {
		for (const tag of tags) this._playerTags.add(tag);
		return this;
	}

	public deletePlayers(...tags: string[]) {
		for (const tag of tags) this._warTags.delete(tag);
		return this;
	}

	public addWars(...tags: string[]) {
		for (const tag of tags) this._warTags.add(tag);
		return this;
	}

	public deleteWars(...tags: string[]) {
		for (const tag of tags) this._warTags.delete(tag);
		return this;
	}

	/**
	 * Set your own custom event.
	 *
	 * @example
	 * ```js
	 * client.events.addClans(['#2PP', '']);
	 *
	 * client.events.setEvent({
	 *   type: 'CLAN',
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
	public setEvent<K extends keyof EventTypes>(event: { type: K; name: string; filter: (...args: EventTypes[K]) => boolean }) {
		switch (event.type) {
			case 'CLAN':
				// @ts-expect-error
				this._events.clans.push(event);
				break;
			case 'PLAYER':
				// @ts-expect-error
				this._events.players.push(event);
				break;
			case 'CLAN_WAR':
				// @ts-expect-error
				this._events.wars.push(event);
				break;
			default:
				break;
		}

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

		await this.client.util.delay(10_000);
		await this.clanUpdateHandler();
	}

	private async warUpdateHandler() {
		this.client.emit(EVENTS.WAR_LOOP_START);
		for (const tag of this._warTags) await this.runWarUpdate(tag);
		this.client.emit(EVENTS.WAR_LOOP_END);

		await this.client.util.delay(10_000);
		await this.warUpdateHandler();
	}

	private async playerUpdateHandler() {
		this.client.emit(EVENTS.PLAYER_LOOP_START);
		for (const tag of this._playerTags) await this.runPlayerUpdate(tag);
		this.client.emit(EVENTS.PLAYER_LOOP_END);

		await this.client.util.delay(10_000);
		await this.playerUpdateHandler();
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
			} catch {}
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
			} catch {}
		}

		return this._players.set(player.tag, player);
	}

	private async runWarUpdate(tag: string) {
		if (this._inMaintenance) return null;

		// @ts-expect-error
		const clanWars = await this.client._getClanWars(tag).catch(() => null);
		clanWars?.forEach((war, i) => {
			const key = `WAR:${i}:${tag}`;
			const cached = this._wars.get(key);
			if (!cached) return this._wars.set(key, war);

			for (const { name, fn } of this._events.wars) {
				try {
					if (!fn(cached, war)) continue;
					this.client.emit(name, cached, war);
				} catch {}
			}

			return this._wars.set(key, war);
		});
	}
}
