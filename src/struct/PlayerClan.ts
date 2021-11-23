import { OverrideOptions } from '../rest/RequestHandler';
import { Client } from '../client/Client';
import { APIPlayerClan } from '../types';
import { Badge } from './Badge';

/** Represents a player's clan. */
export class PlayerClan {
	/** Name of the clan. */
	public name: string;

	/** Tag of the clan. */
	public tag: string;

	/** Level of this clan. */
	public level: number;

	/** Badge of this clan. */
	public badge: Badge;

	public constructor(private readonly _client: Client, data: APIPlayerClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.level = data.clanLevel;
		this.badge = new Badge(data.badgeUrls);
	}

	/** Fetch detailed clan info for the player's clan. */
	public fetch(options?: OverrideOptions) {
		return this._client.getClan(this.tag, options);
	}
}
