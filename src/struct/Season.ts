import { APIGoldPassSeason, APISeason } from '../types';
import { Util } from '../util/Util';

/** Represents a player's trophy season. */
export class Season {
	public id: string;
	public rank: number;
	public trophies: number;

	public constructor(data: APISeason) {
		this.id = data.id || Util.getSeasonId();
		this.rank = data.rank;
		this.trophies = data.trophies;
	}
}

/** Represents a gold pass season. */
export class GoldPassSeason {
	public startTime: Date;
	public endTime: Date;

	public constructor(data: APIGoldPassSeason) {
		this.startTime = Util.parseDate(data.startTime);
		this.endTime = Util.parseDate(data.endTime);
	}
}
