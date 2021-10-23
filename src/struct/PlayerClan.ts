import { Client } from '../client/Client';
import { APIPlayerClan } from '../types';
import { Badge } from './Badge';

export class PlayerClan {
	/** Name of the clan. */
	public name: string;

	/** Tag of the clan. */
	public tag: string;

	/** Level of this clan. */
	public level: number;

	/** Badge of this clan. */
	public badge: Badge;

	public constructor(private readonly client: Client, data: APIPlayerClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.level = data.clanLevel;
		this.badge = new Badge(data.badgeUrls);
	}

	/** Fetch detailed clan info for the player's clan. */
	public fetch() {
		return this.client.getClan(this.tag);
	}
}
