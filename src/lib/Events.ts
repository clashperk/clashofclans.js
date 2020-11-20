import { EventEmitter } from 'events';
import { Store } from './Store';
// import { ClanEvent } from './ClanEvent';

export class Events extends EventEmitter {

	public clans: Store = new Store();
	public players: Store = new Store();
	public wars: Store = new Store();
	public rateLimit: number;
	public refreshRate: number;

	private tokens: string[];
	private events: string[];

	private baseUrl: string;
	private timeout: number;

	public constructor(options: EventsOption) {
		super();

		this.baseUrl = options.baseUrl || 'https://api.clashofclans.com/v1';
		this.timeout = options.timeout || 0;
		this.tokens = options.tokens;
		this.events = options.events;
		this.rateLimit = options.rateLimit || 10;
		this.refreshRate = options.refreshRate || 2 * 60 * 1000;
	}

	public addPlayers(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(tag => {
			if (!this.players.has(tag)) this.players.set(tag, true);
		});
	}

	public removePlayers(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [];
		list.forEach(tag => {
			if (this.players.has(tag)) this.players.delete(tag);
		});
	}

	public clearPlayers() {
		this.players.clear();
	}

	public addClans(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(tag => {
			if (!this.clans.has(tag)) this.clans.set(tag, true);
		});
	}

	public removeClans(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [];
		list.forEach(tag => {
			if (this.clans.has(tag)) this.clans.delete(tag);
		});
	}

	public clearClans() {
		this.clans.clear();
	}

	public addWars(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(tag => {
			if (!this.wars.has(tag)) this.wars.delete(tag);
		});
	}

	public removeWars(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [];
		list.forEach(tag => {
			if (this.wars.has(tag)) this.wars.delete(tag);
		});
	}

	public clearWars() {
		this.wars.clear();
	}

	public init() {
		const events = ['clanUpdate', 'clanMemberUpdate', 'clanMemberAdd', 'clanMemberRemove']
			.reduce((prev, curr) => this.listenerCount(curr) + prev, 0);
		if (events > 0 && this.clans.size > 0) { }
	}

}

interface EventsOption {
	tokens: string[];
	events: string[];
	baseUrl?: string;
	timeout?: number;
	rateLimit?: number;
	refreshRate?: number;
}
