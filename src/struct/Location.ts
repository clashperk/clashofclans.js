import { APILocation } from '../types';

/**
 * Represents a Location
 */
export class Location {
	public id: number;
	public name: string;
	public localizedName: string | null;
	public isCountry: boolean;
	public countryCode: string | null;

	public constructor(data: APILocation) {
		/**
		 * The location ID
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * The location name
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * A localized name of the location
		 * @type {string}
		 */
		this.localizedName = data.localizedName ?? null;

		/**
		 * Indicates whether the location is a country
		 * @type {boolean}
		 */
		this.isCountry = data.isCountry;

		/**
		 * The country code of the location
		 * @type {?string|null}
		 */
		this.countryCode = data.countryCode ?? null;
	}
}
