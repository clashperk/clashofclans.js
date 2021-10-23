import { Clan, ClanWar, Client, Player } from '..';

export enum Events {
	CLAN_LOOP_START = 'CLAN_LOOP_START',
	CLAN_LOOP_END = 'CLAN_LOOP_END'
}

export class Event {
	#wars = new Set<string>(); // eslint-disable-line
	#clans = new Set<string>(); // eslint-disable-line
	#players = new Set<string>(); // eslint-disable-line

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

	private readonly _clans = new Map<string, Clan>();

	public constructor(public readonly client: Client) {
		this.clanUpdater();
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

	public async delay(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}

	private async clanUpdater() {
		this.client.emit(Events.CLAN_LOOP_START);

		for (const tag of this.#clans) await this.runClanUpdate(tag);

		this.client.emit(Events.CLAN_LOOP_END);

		await this.delay(10_000);
		await this.clanUpdater();
	}

	private async runClanUpdate(tag: string) {
		const clan = await this.client.getClan(tag);
		const cached = this._clans.get(clan.tag);
		if (!cached) return this._clans.set(clan.tag, clan);

		for (const { name, fn } of this._events.clans) {
			if (!fn(cached, clan)) continue;
			this.client.emit(name, cached, clan);
		}

		this._clans.set(clan.tag, clan);
	}

	public setClanEvent(name: string, fn: (o: Clan, n: Clan) => boolean) {
		if (typeof fn !== 'function') return;
		this._events.clans.push({ name, fn });
		return this;
	}

	public setPlayerEvent(name: string, fn: (o: Player, n: Player) => boolean) {
		if (typeof fn !== 'function') return;
		this._events.players.push({ name, fn });
		return this;
	}

	public setClanWarEvent(name: string, fn: (o: ClanWar, n: ClanWar) => boolean) {
		if (typeof fn !== 'function') return;
		this._events.wars.push({ name, fn });
		return this;
	}

	public setEvent<K extends keyof EventTypes>(event: { type: K; name: string; filter: (...args: EventTypes[K]) => boolean }) {
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
}

export interface EventTypes {
	WARS: [o: ClanWar, n: ClanWar];
	CLANS: [o: Clan, n: Clan];
	PLAYERS: [o: Player, n: Player];
}
