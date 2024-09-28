import { Client } from '../client/Client';
import { APIPlayerClan, OverrideOptions } from '../types';
import { Enumerable } from '../util/Decorators';
import { Badge } from './Badge';

/** Represents a Player's clan. */
export class PlayerClan {
	/** Name of the clan. */
	public name: string;

	/** Tag of the clan. */
	public tag: string;

	/**
	 * Level of this clan.
	 *
	 * This property is not available for ranked player's clan.
	 */
	public level: number | null;

	/** Badge of this clan. */
	public badge: Badge;

	@Enumerable(false)
	private readonly client: Client;

	public constructor(client: Client, data: APIPlayerClan) {
		this.client = client;
		this.name = data.name;
		this.tag = data.tag;
		this.level = data.clanLevel ?? null; // eslint-disable-line
		this.badge = new Badge(data.badgeUrls);
	}

	/** Fetch detailed clan info for the player's clan. */
	public fetch(options?: OverrideOptions) {
		return this.client.getClan(this.tag, options);
	}

	/** Get clan's formatted link to open clan in-game. */
	public get shareLink() {
		return `https://link.clashofclans.com/en?action=OpenClanProfile&tag=${this.tag.replace(/#/g, '')}`;
	}
}
