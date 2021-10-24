import { Clan, ClanWar, Client, Events, EventTypes, HTTPError, Player, Util } from '..';

export class Event {
	#clans = new Set<string>(); // eslint-disable-line
	#players = new Set<string>(); // eslint-disable-line
	#wars = new Set<string>(); // eslint-disable-line

	private readonly _events = {
		clans: [] as {
			name: string;
			fn: (...args: EventTypes['CLANS']) => boolean;
		}[],
		wars: [] as {
			name: string;
			fn: (...args: EventTypes['WARS']) => boolean;
		}[],
		players: [] as {
			name: string;
			fn: (...args: EventTypes['PLAYERS']) => boolean;
		}[]
	};

	private _inMaintenance: boolean;
	private _maintenanceStartTime: Date | null;
	private readonly _clans = new Map<string, Clan>();
	private readonly _players = new Map<string, Player>();
	private readonly _wars = new Map<string, ClanWar>();

	public constructor(public readonly client: Client) {
		this._inMaintenance = Boolean(false);
		this._maintenanceStartTime = null;
		this.clanUpdateHandler();
	}

	public async delay(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}

	public addClanUpdates(...tags: string[]) {
		for (const tag of tags) this.#clans.add(tag);
		return this;
	}

	public addPlayerUpdates(...tags: string[]) {
		for (const tag of tags) this.#players.add(tag);
		return this;
	}

	public addWarUpdates(...tags: string[]) {
		for (const tag of tags) this.#wars.add(tag);
		return this;
	}

	public removeClanUpdates(...tags: string[]) {
		for (const tag of tags) this.#wars.delete(tag);
		return this;
	}

	public removePlayerUpdates(...tags: string[]) {
		for (const tag of tags) this.#wars.delete(tag);
		return this;
	}

	public removeWarUpdates(...tags: string[]) {
		for (const tag of tags) this.#wars.delete(tag);
		return this;
	}

	public setEvent<K extends keyof EventTypes>(event: { type: K; name: string; filter: (...args: EventTypes[K]) => boolean }): Event {
		switch (event.type) {
			case 'CLANS':
				// @ts-expect-error
				this._events.clans.push({ name: event.name, fn: event.filter });
				break;
			case 'PLAYERS':
				// @ts-expect-error
				this._events.players.push({ name: event.name, fn: event.filter });
				break;
			case 'WARS':
				// @ts-expect-error
				this._events.wars.push({ name: event.name, fn: event.filter });
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

				this.client.emit(Events.MAINTENANCE_END, duration);
			}
		} catch (error) {
			if (error instanceof HTTPError && error.status === 503 && !this._inMaintenance) {
				this._inMaintenance = Boolean(true);
				this._maintenanceStartTime = new Date();

				this.client.emit(Events.MAINTENANCE_START);
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
				this.client.emit(Events.NEW_SEASON_START, Util.getSeasonId());
			}, end + 100).unref();
		}
	}

	private async clanUpdateHandler() {
		this.client.emit(Events.CLAN_LOOP_START);
		for (const tag of this.#clans) await this.runClanUpdate(tag);
		this.client.emit(Events.CLAN_LOOP_END);

		await this.delay(10_000);
		await this.clanUpdateHandler();
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
}
