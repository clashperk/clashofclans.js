import { Season } from '.';
import { APILegendStatistics } from '../types';

export class LegendStatistics {
	public legendTrophies: number;
	public previousSeason: Season | null;
	public previousVersusSeason: Season | null;
	public bestVersusSeason: Season | null;
	public currentSeason: Season | null;
	public bestSeason: Season | null;

	public constructor(data: APILegendStatistics) {
		this.legendTrophies = data.legendTrophies;
		this.previousSeason = data.previousSeason ? new Season(data.previousSeason) : null;
		this.previousVersusSeason = data.previousVersusSeason ? new Season(data.previousVersusSeason) : null;
		this.bestVersusSeason = data.bestVersusSeason ? new Season(data.bestVersusSeason) : null;
		this.currentSeason = data.currentSeason ? new Season(data.currentSeason) : null;
		this.bestSeason = data.bestSeason ? new Season(data.bestSeason) : null;
	}
}
