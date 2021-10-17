/**
 * Represents a Clan's War League
 */
export class WarLeague {
	public id: string;
	public name: string;

	public constructor(data: any) {
		/**
		 * The league's unique ID
		 * @type {number}
		 */
		this.id = data.id;

		/**
		 * The league's name
		 * @type {string}
		 */
		this.name = data.name;
	}
}
