import { Badge } from './Badge';

export class PlayerClan {
	public name: string;
	public tag: string;
	public level: number;
	public badge: Badge;

	public constructor(data: any) {
		this.name = data.name;
		this.tag = data.tag;
		this.level = data.level;
		this.badge = new Badge(data.badge);
	}
}
