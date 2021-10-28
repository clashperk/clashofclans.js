import { SUPER_TROOPS } from '../util/Constants';
import { APIPlayerItem } from '../types';

/** Represents a player's unit. */
export class Unit {
	/** The name of this unit. */
	public name: string;

	/** The level of this unit. */
	public level: number;

	/** The max level of this unit. */
	public maxLevel: number;

	/** The village type of this unit. */
	public village: 'home' | 'builderBase';

	public constructor(data: APIPlayerItem) {
		this.name = data.name;
		this.level = data.level;
		this.maxLevel = data.maxLevel;
		this.village = data.village;
	}

	/** Whether the unit belongs to the home base. */
	public get isHomeBase() {
		return this.village === 'home';
	}

	/** Whether the unit belongs to the builder base. */
	public get isBuilderBase() {
		return this.village === 'builderBase';
	}

	/** Whether the unit is at max level. */
	public get isMax() {
		return this.level === this.maxLevel;
	}
}

/** Represents a player's troop. */
export class Troop extends Unit {
	public name!: string;

	public superTroopIsActive: boolean;

	public constructor(data: APIPlayerItem) {
		super(data);
		this.superTroopIsActive = data.superTroopIsActive ?? false;
	}

	/** Whether this troop is a Super Troop. */
	public get isSuperTroop() {
		return this.superTroopIsActive || (this.isHomeBase && SUPER_TROOPS.includes(this.name));
	}
}

/** Represents a player's spell. */
export class Spell extends Unit {}

/** Represents a player's hero. */
export class Hero extends Unit {}
