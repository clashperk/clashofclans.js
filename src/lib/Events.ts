import { EventEmitter } from 'events';

export class Events extends EventEmitter {

	private clans: string[] = [];
	private players: string[] = [];

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
	}

	public addPlayers(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(tag => {
			if (!this.players.includes(tag)) this.players.push(tag);
		});
	}

	public removePlayers(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [];
		list.forEach(tag => {
			const index = this.clans.indexOf(tag);
			if (index > -1) this.clans.splice(index, 1);
		});
	}

	public addClans(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(tag => {
			if (!this.clans.includes(tag)) this.clans.push(tag);
		});
	}

	public removeClans(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [];
		list.forEach(tag => {
			const index = this.clans.indexOf(tag);
			if (index > -1) this.clans.splice(index, 1);
		});
	}

}

interface EventsOption {
	tokens: string[];
	events: string[];
	baseUrl?: string;
	timeout?: number;
}
