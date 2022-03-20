import { OverrideOptions, APIPlayerClan } from '../types';
import { Client } from '../client/Client';
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

	/** Formatted link of this clan to open clan in-game. */

	public constructor(private readonly _client: Client, data: APIPlayerClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.level = data.clanLevel ?? null; // eslint-disable-line
		this.badge = new Badge(data.badgeUrls);
	}

	/** Fetch detailed clan info for the player's clan. */
	public fetch(options?: OverrideOptions) {
		return this._client.getClan(this.tag, options);
	}

	/** Get clan's formatted link to open clan in-game. */
	public get shareLink() {
		return `https://link.clashofclans.com/en?action=OpenClanProfile&tag=${this.tag.replace(/#/g, '')}`;
	}
}
