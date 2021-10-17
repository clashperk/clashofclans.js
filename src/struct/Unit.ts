import { APIPlayerItem } from '../types';

export class Unit {
	public name: string;
	public level: number;
	public maxLevel: number;
	public village: 'home' | 'builderBase';

	public constructor(data: APIPlayerItem) {
		this.name = data.name;
		this.level = data.level;
		this.maxLevel = data.maxLevel;
		this.village = data.village;
	}
}

export class Troop extends Unit {
	public superTroopIsActive: boolean;

	public constructor(data: APIPlayerItem) {
		super(data);
		this.superTroopIsActive = data.superTroopIsActive ?? false;
	}
}

export class Spell extends Unit {}

export class Hero extends Unit {}
