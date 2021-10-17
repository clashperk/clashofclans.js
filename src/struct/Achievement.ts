import { APIPlayerAchievement } from '../types';

export class Achievement {
	public name: string;
	public stars: number;
	public value: number;
	public target: number;
	public info: string;
	public village: 'home' | 'builderBase';
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
}
