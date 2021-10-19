import { APIPlayerAchievement } from '../types';

/** Represents a Clash of Clans Achievement. */
export class Achievement {
	/** The name of the achievement. */
	public name: string;

	/** The current stars achieved for the achievement. */
	public stars: number;

	/** The number of X things attained for this achievement. */
	public value: number;

	/** The number of X things required to complete this achievement. */
	public target: number;

	/** Information regarding the achievement. */
	public info: string;

	/** The illage this achievement belongs to.  */
	public village: 'home' | 'builderBase';

	/** Information regarding completion of the achievement. */
	public completionInfo: string | null;

	public constructor(data: APIPlayerAchievement) {
		this.name = data.name;
		this.stars = data.stars;
		this.value = data.value;
		this.target = data.target;
		this.info = data.info;
		this.village = data.village;
		this.completionInfo = data.completionInfo ?? null;
	}

	/** Whether achievement belongs to the home base. */
	public get isHomeBase() {
		return this.village === 'home';
	}

	/** Whether the achievement belongs to the builder base. */
	public get isBuilderBase() {
		return this.village === 'builderBase';
	}

	/** Whether the achievement is completed. */
	public get isCompleted() {
		return this.stars === 3;
	}
}
