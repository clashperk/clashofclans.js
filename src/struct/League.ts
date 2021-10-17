import { Icon } from './Icon';

/**
 * Represents a Player's League
 */
export class League {
	public id: string;
	public name: string;
	public icon: Icon;

	public constructor(data: any) {
		/**
		 * The league ID
		 * @type {number}
		 */
		this.id = data.id;

		/**
		 * The league name
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * The league icon URL
		 * @type {Icon}
		 */
		this.icon = new Icon(data.iconUrls);
	}
}
