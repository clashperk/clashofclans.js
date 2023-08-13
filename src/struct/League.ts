import { APILeague } from '../types';
import { Leagues } from '../util/Constants';
import { Icon } from './Icon';

/** Represents a Player's League. */
export class League {
	/** The league Id. */
	public id: number;

	/** The league name. */
	public name: string;

	/** The League Icon. */
	public icon: Icon;

	public constructor(data: APILeague) {
		this.id = data.id;
		this.name = data.name;
		this.icon = new Icon(data.iconUrls);
	}

	/** Position of this League. Starting from 0 (Un-ranked) */
	public get position() {
		return Leagues.indexOf(this.id);
	}
}
