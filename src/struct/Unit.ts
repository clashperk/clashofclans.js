import { RAW_SUPER_UNITS, RAW_UNITS } from '../util/raw.json';
import { SUPER_TROOPS } from '../util/Constants';
import { APIPlayerItem, APIPlayer } from '../types';

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

	// #region static

	/** Id of this unit. */
	public id!: number;

	/** Housing space of this unit. */
	public housingSpace!: number;

	/** Town/Builder hall's max level of this unit. */
	public hallMaxLevel!: number;

	/** Unlock Town/Builder Hall level of this unit. */
	public unlockHallLevel!: number;

	/** Unlock cost of this unit. */
	public unlockCost!: number;

	/** Unlock time of this unit. */
	public unlockTime!: number;

	/** Unlock resource of this unit. */
	public unlockResource!: string;

	/** Unlock building of this unit. */
	public unlockBuilding!: string;

	/** Unlock building level of this unit. */
	public unlockBuildingLevel!: number;

	/** Upgrade cost of this unit. */
	public upgradeCost!: number;

	/** Upgrade resource of this unit. */
	public upgradeResource!: string;

	/** Upgrade time of this unit. */
	public upgradeTime!: number;

	/** @internal */
	public minOriginalLevel!: number | null;
	/** @internal */
	public originalName!: string | null;

	// #endregion static

	public constructor(data: APIPlayer, unit: APIPlayerItem) {
		this.name = unit.name;
		this.level = unit.level;
		this.maxLevel = unit.maxLevel;
		this.village = unit.village;

		const rawSuperUnit = RAW_SUPER_UNITS.find((unit) => unit.name === this.name && this.isHomeBase);
		const rawUnit = RAW_UNITS.find((unit) => unit.name === this.name && unit.village === this.village);

		if (rawSuperUnit) {
			this.id = rawSuperUnit.id;
			this.housingSpace = rawSuperUnit.housingSpace;

			this.originalName = rawSuperUnit.original;
			this.minOriginalLevel = rawSuperUnit.minOriginalLevel;

			const original = RAW_UNITS.find((unit) => unit.village === 'home' && unit.name === rawSuperUnit.original)!;
			this.unlockHallLevel = original.levels.findIndex((level) => level >= rawSuperUnit.minOriginalLevel) + 1;
			this.unlockCost = original.unlock.cost;
			this.unlockTime = original.unlock.time;
			this.unlockResource = original.unlock.resource;
			this.unlockBuilding = original.unlock.building;
			this.unlockBuildingLevel = original.unlock.buildingLevel;

			const origin = data.troops.find((troop) => troop.village === 'home' && troop.name === original.name)!;
			this.level = origin.level;
			this.maxLevel = origin.maxLevel;

			this.upgradeCost = original.upgrade.cost[origin.level - 1] ?? 0;
			this.upgradeResource = original.upgrade.resource;
			this.upgradeTime = original.upgrade.time[origin.level - 1] ?? 0;
			this.hallMaxLevel = original.levels[data.townHallLevel - 1];
		}

		if (rawUnit) {
			this.id = rawUnit.id;
			this.housingSpace = rawUnit.housingSpace;
			this.unlockCost = rawUnit.unlock.cost;
			this.unlockTime = rawUnit.unlock.time;
			this.unlockResource = rawUnit.unlock.resource;
			this.unlockBuilding = rawUnit.unlock.building;
			this.unlockHallLevel = rawUnit.unlock.hall;
			this.unlockBuildingLevel = rawUnit.unlock.buildingLevel;
			this.upgradeResource = rawUnit.upgrade.resource;
			this.upgradeCost = rawUnit.upgrade.cost[this.level - 1] ?? 0;
			this.upgradeTime = rawUnit.upgrade.time[this.level - 1] ?? 0;
			this.hallMaxLevel = rawUnit.levels[(this.village === 'home' ? data.townHallLevel : data.builderHallLevel!) - 1];
		}
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

	/** Icon of this unit. */
	public get iconURL() {
		return `https://supercell.vercel.app/assets/troops/icons/${this.name.replace(/ /gi, '_')}.png`;
	}
}

/** Represents a player's troop. */
export class Troop extends Unit {
	public name!: string;

	/** Whether this troop is currently active of boosted. */
	public isActive: boolean;

	/** Origin troop's minimum level of this super troop. */
	public minOriginalLevel!: number | null;

	/** Origin troop's name of this super troop. */
	public originalName!: string | null;

	public constructor(data: APIPlayer, unit: APIPlayerItem) {
		super(data, unit);

		this.originalName = this.originalName ?? null;
		this.isActive = unit.superTroopIsActive ?? false;
		this.minOriginalLevel = this.minOriginalLevel ?? null;
	}

	/** Whether this troop is a Super Troop. */
	public get isSuperTroop() {
		return this.isActive || (this.isHomeBase && SUPER_TROOPS.includes(this.name));
	}
}

/** Represents a player's spell. */
export class Spell extends Unit {}

/** Represents a player's hero. */
export class Hero extends Unit {}
