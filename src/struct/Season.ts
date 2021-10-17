import moment from 'moment';
import { APIGoldPassSeason, APISeason } from '../types';

export class Season {
	public id: string;
	public rank: number;
	public trophies: number;

	public constructor(data: APISeason) {
		this.id = data.id;
		this.rank = data.rank;
		this.trophies = data.trophies;
	}
}

export class GoldPassSeason {
	public startTime: Date;
	public endTime: Date;

	public constructor(data: APIGoldPassSeason) {
		this.startTime = moment(data.startTime).toDate();
		this.endTime = moment(data.endTime).toDate();
	}
}
