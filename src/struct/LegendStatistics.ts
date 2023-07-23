import { APILegendStatistics } from '../types';
import { Season } from './Season';

/** Represents the Legend Statistics. */
export class LegendStatistics {
	/** The player's legend trophies. */
	public legendTrophies: number;

	/** Legend statistics for previous season. */
	public previousSeason: Season | null;

	/** Legend statistics for this season. */
	public currentSeason: Season | null;

	/** Legend statistics for this player's best season. */
	public bestSeason: Season | null;

	/** Builder base Legend statistics for previous season. */
	public previousBuilderBaseSeason: Season | null;

	/** Builder base Legend statistics for this player's best season. */
	public bestBuilderBaseSeason: Season | null;

	public constructor(data: APILegendStatistics) {
		this.legendTrophies = data.legendTrophies;

		this.previousSeason = data.previousSeason ? new Season(data.previousSeason) : null;
		// #blame-supercell
		this.currentSeason = data.currentSeason?.rank ? new Season(data.currentSeason) : null;
		this.bestSeason = data.bestSeason ? new Season(data.bestSeason) : null;

		this.previousBuilderBaseSeason = data.previousBuilderBaseSeason ? new Season(data.previousBuilderBaseSeason) : null;
		this.bestBuilderBaseSeason = data.bestBuilderBaseSeason ? new Season(data.bestBuilderBaseSeason) : null;
	}
}
