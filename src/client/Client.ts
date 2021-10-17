import { ClientOptions } from '../rest/RequestHandler';
import { RESTManager } from '../rest/RESTManager';
import { Clan, Player } from '../struct';
import Util from '../util/Util';

export class Client {
	private readonly rest: RESTManager;
	public readonly util = Util;

	public constructor(options?: ClientOptions) {
		this.rest = new RESTManager(options);
	}

	public setkeys(keys: string[]) {
		this.rest.handler.setKeys(keys);
		return this;
	}

	public async getClan(clanTag: string) {
		const { data } = await this.rest.getClan(clanTag);
		return new Clan(this, data);
	}

	public async getPlayer(playerTag: string) {
		const { data } = await this.rest.getPlayer(playerTag);
		return new Player(this, data);
	}
}
