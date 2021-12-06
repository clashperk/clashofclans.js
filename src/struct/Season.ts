import { APIGoldPassSeason, APISeason } from '../types';
import { Util } from '../util/Util';

/** Represents a player's trophy season. */
export class Season {
	/** The season's Id. */
	public id: string;

	/** The player's rank. */
	public rank: number;

	/** The player's trophy count. */
	public trophies: number;

	public constructor(data: APISeason) {
		this.id = data.id || Util.getSeasonId();
		this.rank = data.rank;
		this.trophies = data.trophies;
	}
}

/** Represents a gold pass season. */
export class GoldPassSeason {
	/** The start time of the gold pass season. */
	public startTime: Date;

	/** The end time of this gold pass season. */
	public endTime: Date;

	public constructor(data: APIGoldPassSeason) {
		this.startTime = Util.formatDate(data.startTime);
		this.endTime = Util.formatDate(data.endTime);
	}
}
