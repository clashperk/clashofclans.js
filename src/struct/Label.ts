import { APILabel } from '../types';
import { Icon } from './Icon';

/**
 * Represents a Clan or Player Label.
 */
export class Label {
	public id: number;
	public name: string;
	public icon: Icon;

	public constructor(data: APILabel) {
		/**
		 * The label's unique ID
		 * @type {number}
		 */
		this.id = data.id;

		/**
		 * The label's name
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * The label's icon
		 * @type {Icon}
		 */
		this.icon = new Icon(data.iconUrls);
	}
}
