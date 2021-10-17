import { APIChatLanguage } from '../types';

/**
 * Represents a Clan's Chat Language
 */
export class ChatLanguage {
	public id: number;
	public name: string;
	public code: string;

	public constructor(data: APIChatLanguage) {
		/**
		 * The language's unique ID
		 * @type {number}
		 */
		this.id = data.id;

		/**
		 * The language's full name
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * The language's code
		 * @type {string}
		 */
		this.code = data.languageCode;
	}
}
