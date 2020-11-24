import { EventEmitter } from 'events';
import { Store } from './Store';
import { Throttler } from '../utils/Throttler';
import { handleClanUpdate, handlePlayerUpdate } from '../utils/updateHandler';
import { validateTag, fetchURL } from '../utils/utils';

export class Events extends EventEmitter {

	public clans: Store = new Store();
	public players: Store = new Store();
	public wars: Store = new Store();

	public rateLimit: number;
	public refreshRate: number;

	private tokens: string[];

	private baseUrl: string;
	private timeout: number;

	private throttler: Throttler;
	private activeToken = 0;

	private isInMaintenance = false;

	public constructor(options: EventsOption) {
		super();

		this.baseUrl = options.baseUrl || 'https://api.clashofclans.com/v1';
		this.timeout = options.timeout || 0;
		this.tokens = options.tokens;
		this.rateLimit = options.rateLimit || 10;
		this.refreshRate = options.refreshRate || 2 * 60 * 1000;
		this.throttler = new Throttler(this.rateLimit * this.tokens.length);
	}

	public addPlayers(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && !this.players.has(tag)) this.players.set(tag, {});
		});
	}

	public removePlayers(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && this.players.has(tag)) this.players.delete(tag);
		});
	}

	public clearPlayers() {
		this.players.clear();
	}

	public addClans(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && !this.clans.has(tag)) this.clans.set(tag, {});
		});
	}

	public removeClans(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && this.clans.has(tag)) this.clans.delete(tag);
		});
	}

	public clearClans() {
		this.clans.clear();
	}

	public addWars(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && !this.wars.has(tag)) this.wars.set(tag, {});
		});
	}

	public removeWars(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && this.wars.has(tag)) this.wars.delete(tag);
		});
	}

	public clearWars() {
		this.wars.clear();
	}

	public async init() {
		await this.checkMaintenace();
		await this.initClanEvents();
		await this.initPlayerEvents();
	}

	/* ----------------------------------------------------------------------------- */
	/* ------------------------------ PRIVATE METHODS ------------------------------ */
	/* ----------------------------------------------------------------------------- */

	private async initClanEvents() {
		if (this.isInMaintenance) return;
		const startTime = Date.now();
		for (const tag of this.clans.keys()) {
			const data = await this.fetch(`/clans/${encodeURIComponent(tag)}`);
			await this.throttler.throttle();
			handleClanUpdate(this, data);
		}
		const timeTaken = Date.now() - startTime;
		const waitFor = (timeTaken >= this.refreshRate ? 0 : this.refreshRate - timeTaken);
		setTimeout(this.initClanEvents.bind(this), waitFor);
	}

	private async initPlayerEvents() {
		if (this.isInMaintenance) return;
		const startTime = Date.now();
		for (const tag of this.players.keys()) {
			const data = await this.fetch(`/players/${encodeURIComponent(tag)}`);
			await this.throttler.throttle();
			handlePlayerUpdate(this, data);
		}
		const timeTaken = Date.now() - startTime;
		const waitFor = (timeTaken >= this.refreshRate ? 0 : this.refreshRate - timeTaken);
		setTimeout(this.initPlayerEvents.bind(this), waitFor);
	}

	private async checkMaintenace() {
		const data = await this.fetch(`/clans?limit=1&minMembers=${Math.floor(Math.random() * 40) + 10}`);
		await this.throttler.throttle();
		if (data.status === 503 && !this.isInMaintenance) {
			this.isInMaintenance = true;
			this.emit('maintenanceStart');
		} else if (data.status === 200 && this.isInMaintenance) {
			this.isInMaintenance = false;
			this.emit('maintenanceEnd');
		}
		setTimeout(this.checkMaintenace.bind(this), 0.5 * 60 * 1000);
	}

	private get token() {
		const token = this.tokens[this.activeToken];
		this.activeToken = (this.activeToken + 1) >= this.tokens.length ? 0 : (this.activeToken + 1);
		return token;
	}

	private fetch(url: string) {
		return fetchURL(`${this.baseUrl}${url}`, this.token, this.timeout);
	}

}

interface EventsOption {
	tokens: string[];
	baseUrl?: string;
	timeout?: number;
	rateLimit?: number;
	refreshRate?: number;
}
