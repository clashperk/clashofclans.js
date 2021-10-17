import { APIPlayerClan } from '../types';
import { Badge } from './Badge';

export class PlayerClan {
	public name: string;
	public tag: string;
	public level: number;
	public badge: Badge;

	public constructor(data: APIPlayerClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.level = data.clanLevel;
		this.badge = new Badge(data.badgeUrls);
	}
}
