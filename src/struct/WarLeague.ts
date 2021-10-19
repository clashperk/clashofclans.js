import { APIWarLeague } from '../types';
import { WAR_LEAGUES } from '../util/Constants';

/**
 * Represents a Clan's War League.
 */
export class WarLeague {
	/** The league's unique Id. */
	public id: number;

	/** The league's name. */
	public name: string;

	public constructor(data: APIWarLeague) {
		this.id = data.id;
		this.name = data.name;
	}

	/** Position of this War League. Starting from 0 (Unranked) */
	public get position() {
		return WAR_LEAGUES.indexOf(this.id);
	}
}
