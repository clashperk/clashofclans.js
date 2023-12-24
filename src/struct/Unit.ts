import { APIPlayer, APIPlayerItem } from '../types';
import { RawData, SuperTroops } from '../util/Constants';

/** Represents a Player's Unit. */
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

	/** Whether the Game data has been loaded for this unit. */
	public isLoaded: boolean;

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

	/** Whether the unit is seasonal. */
	public seasonal: boolean;

	/** Damage per second of this unit. */
	public dps!: number;

	/** Training time of this unit. */
	public trainingTime!: number;

	/** @internal */
	public regenerationTime!: number | null;
	/** @internal */
	public boostable!: boolean | null;
	/** @internal */
	public minOriginalLevel!: number | null;
	/** @internal */
	public originalName!: string | null;
	/** @internal */
	public equipment!: HeroEquipment[];

	// #endregion static

	public constructor(data: APIPlayer, unit: APIPlayerItem) {
		this.name = unit.name;
		this.level = unit.level;
		this.maxLevel = unit.maxLevel;
		this.village = unit.village;

		const rawSuperUnit = RawData.RawSuperUnits.find((unit) => unit.name === this.name && this.isHomeBase);
		const rawUnit = RawData.RawUnits.find((unit) => unit.name === this.name && unit.village === this.village);

		if (rawSuperUnit) {
			this.id = rawSuperUnit.id;
			this.housingSpace = rawSuperUnit.housingSpace;

			this.originalName = rawSuperUnit.original;
			this.minOriginalLevel = rawSuperUnit.minOriginalLevel;

			const original = RawData.RawUnits.find((unit) => unit.village === 'home' && unit.name === rawSuperUnit.original)!;
			this.unlockHallLevel = original.levels.findIndex((level) => level >= rawSuperUnit.minOriginalLevel) + 1;
			this.unlockCost = original.unlock.cost;
			this.unlockTime = original.unlock.time;
			this.unlockResource = original.unlock.resource;
			this.unlockBuilding = original.unlock.building;
			this.unlockBuildingLevel = original.unlock.buildingLevel;

			this.dps = rawUnit!.dps[this.level - 1];
			this.trainingTime = Number(rawUnit!.trainingTime);

			const origin = data.troops.find((troop) => troop.village === 'home' && troop.name === original.name)!;
			this.level = origin.level;
			this.maxLevel = origin.maxLevel;
			this.boostable = data.townHallLevel >= 11 && origin.level >= rawSuperUnit.minOriginalLevel;

			this.upgradeCost = original.upgrade.cost[origin.level - 1] || 0;
			this.upgradeResource = original.upgrade.resource;
			this.upgradeTime = original.upgrade.time[origin.level - 1] || 0;
			this.hallMaxLevel = original.levels[data.townHallLevel - 1];
			this.equipment = (unit.equipment ?? []).map((unit) => new HeroEquipment(data, unit));
		} else if (rawUnit) {
			// special case for the builder base
			this.level = this.level === 0 ? 0 : Math.max(this.level, rawUnit.minLevel ?? this.level);
			this.maxLevel = Math.max(rawUnit.levels[rawUnit.levels.length - 1], this.maxLevel);

			this.id = rawUnit.id;
			this.housingSpace = rawUnit.housingSpace;
			this.unlockCost = rawUnit.unlock.cost;
			this.unlockTime = rawUnit.unlock.time;
			this.unlockResource = rawUnit.unlock.resource;
			this.unlockBuilding = rawUnit.unlock.building;
			this.unlockHallLevel = rawUnit.unlock.hall;
			this.unlockBuildingLevel = rawUnit.unlock.buildingLevel;
			this.upgradeResource = rawUnit.upgrade.resource;
			this.upgradeCost = rawUnit.upgrade.cost[this.level - 1] || 0;
			this.upgradeTime = rawUnit.upgrade.time[this.level - 1] || 0;
			this.dps = rawUnit.dps[this.level - 1];
			this.trainingTime = Number(rawUnit.trainingTime);
			if (rawUnit.category === 'hero') this.regenerationTime = rawUnit.regenerationTimes[this.level - 1];
			this.hallMaxLevel = rawUnit.levels[(this.village === 'home' ? data.townHallLevel : data.builderHallLevel!) - 1];
		}

		this.seasonal = Boolean(rawUnit?.seasonal);
		this.isLoaded = Boolean(rawUnit ?? rawSuperUnit);
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

/** Represents a Player's Troop. */
export class Troop extends Unit {
	public name!: string;

	/** Whether this troop is currently active of boosted. */
	public isActive: boolean;

	/** Origin troop's minimum level of this super troop. */
	public minOriginalLevel!: number | null;

	/** Origin troop's name of this super troop. */
	public originalName!: string | null;

	/** Whether the player can boost this super troop. */
	public boostable!: boolean | null;

	public constructor(data: APIPlayer, unit: APIPlayerItem) {
		super(data, unit);

		this.originalName = this.originalName ?? null;
		this.isActive = unit.superTroopIsActive ?? false;
		this.minOriginalLevel = this.minOriginalLevel ?? null;
		this.boostable = this.boostable ?? null;
	}

	/** Whether this troop is a Super Troop. */
	public get isSuperTroop() {
		return this.isActive || (this.isHomeBase && SuperTroops.includes(this.name));
	}
}

/** Represents a Player's Spell. */
export class Spell extends Unit {}

/** Represents a Player's Hero. */
export class Hero extends Unit {
	/** Regeneration time of this hero. */
	public regenerationTime!: number;

	/** Hero Equipment */
	public equipment!: HeroEquipment[];
}

/** Represents a Player's Hero Equipment. */
export class HeroEquipment extends Unit {}
