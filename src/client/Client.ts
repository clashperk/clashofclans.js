import RESTManager from '../rest/RESTManager';
import { Clan } from '../struct/Clan';
import Util from '../util/Util';

export class Client {
	public keys: string[];
	public baseURL: string;
	public restRequestTimeout: number;

	public util = Util;
	public rest = new RESTManager(this);

	public constructor(options: ClientOptions = {}) {
		this.keys = options.keys ?? [];
		this.restRequestTimeout = options.restRequestTimeout ?? 0;
		this.baseURL = options.baseURL ?? 'https://api.clashofclans.com/v1';
	}

	public setkeys(keys: string[]) {
		this.keys = keys;
		return this;
	}

	public async getClan(clanTag: string) {
		const { data } = await this.rest.getClan(clanTag);
		return new Clan(this, data);
	}
}

export interface ClientOptions {
	keys?: string[];
	baseURL?: string;
	restRequestTimeout?: number;
}
