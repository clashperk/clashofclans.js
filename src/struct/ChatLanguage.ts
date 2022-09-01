import type { APIChatLanguage } from '../types';

/**
 * Represents a Clan's Chat Language.
 */
export class ChatLanguage {
	/**
	 * The language's unique Id.
	 */
	public id: number;

	/**
	 * The language's full name.
	 */
	public name: string;

	/**
	 * The language's code.
	 */
	public code: string;

	public constructor(data: APIChatLanguage) {
		this.id = data.id;
		this.name = data.name;
		this.code = data.languageCode;
	}
}
