import { APIPlayerItem } from '../types';
import { SUPER_TROOPS } from '../util/Constants';

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

	public get isHomeBase() {
		return this.village === 'home';
	}

	public get isBuilderBase() {
		return this.village === 'builderBase';
	}

	public get isMax() {
		return this.level === this.maxLevel;
	}
}

export class Troop extends Unit {
	public superTroopIsActive: boolean;

	public constructor(data: APIPlayerItem) {
		super(data);
		this.superTroopIsActive = data.superTroopIsActive ?? false;
	}

	public get isSuperTroop() {
		return this.superTroopIsActive || (this.isHomeBase && SUPER_TROOPS.includes(this.name));
	}
}

export class Spell extends Unit {}

export class Hero extends Unit {}
