import { APIPlayer, APIPlayerItem } from '../types';
import { SUPER_TROOPS } from '../util/Constants';
import { getRawUnit, SUPER_TROOP_MIN_TOWN_HALL_LEVEL } from '../util/StaticData';

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

	/** @deprecated Training times are no longer part of the game data; always `0`. */
	public trainingTime = 0;

	/** @internal */
	public regenerationTime!: number | null;
	/** @internal */
	public boostable!: boolean | null;
	/** @internal */
	public minOriginalLevel!: number | null;
	/** @internal */
	public originalName!: string | null;
	/** @internal */
	public equipment!: Equipment[];

	// #endregion static

	public constructor(data: APIPlayer, unit: APIPlayerItem) {
		this.name = unit.name;
		this.level = unit.level;
		this.maxLevel = unit.maxLevel;
		this.village = unit.village;

		const rawUnit = getRawUnit(this.name, this.village);

		if (rawUnit?.superTroop && data.townHallLevel >= SUPER_TROOP_MIN_TOWN_HALL_LEVEL) {
			const { originalName, minOriginalLevel } = rawUnit.superTroop;
			const original = getRawUnit(originalName, 'home')!;

			this.id = rawUnit.id;
			this.housingSpace = rawUnit.housingSpace;

			this.originalName = originalName;
			this.minOriginalLevel = minOriginalLevel;

			this.unlockHallLevel = rawUnit.unlock.hall;
			this.unlockCost = rawUnit.unlock.cost;
			this.unlockTime = rawUnit.unlock.time;
			this.unlockResource = rawUnit.unlock.resource;
			this.unlockBuilding = rawUnit.unlock.building;
			this.unlockBuildingLevel = rawUnit.unlock.buildingLevel;

			this.dps = rawUnit.dps[this.level - rawUnit.minLevel] ?? 0;

			const origin = data.troops.find((troop) => troop.village === 'home' && troop.name === originalName);
			if (origin) {
				this.level = origin.level;
				this.maxLevel = origin.maxLevel;
				this.boostable = origin.level >= minOriginalLevel;
				this.upgradeCost = original.upgrade.cost[origin.level - original.minLevel] || 0;
				this.upgradeTime = original.upgrade.time[origin.level - original.minLevel] || 0;
			}
			this.upgradeResource = original.upgrade.resource;
			this.hallMaxLevel = original.levels[data.townHallLevel - 1] ?? this.maxLevel;
		} else if (rawUnit) {
			// special case for the builder base
			this.level = this.level === 0 ? 0 : Math.max(this.level, rawUnit.minLevel);
			this.maxLevel = Math.max(rawUnit.maxLevel, this.maxLevel);

			this.id = rawUnit.id;
			this.housingSpace = rawUnit.housingSpace;
			this.unlockCost = rawUnit.unlock.cost;
			this.unlockTime = rawUnit.unlock.time;
			this.unlockResource = rawUnit.unlock.resource;
			this.unlockBuilding = rawUnit.unlock.building;
			this.unlockHallLevel = rawUnit.unlock.hall;
			this.unlockBuildingLevel = rawUnit.unlock.buildingLevel;
			this.upgradeResource = rawUnit.upgrade.resource;
			this.upgradeCost = rawUnit.upgrade.cost[this.level - rawUnit.minLevel] || 0;
			this.upgradeTime = rawUnit.upgrade.time[this.level - rawUnit.minLevel] || 0;
			this.dps = rawUnit.dps[this.level - rawUnit.minLevel] ?? 0;
			if (rawUnit.category === 'hero') this.regenerationTime = 0;
			this.hallMaxLevel =
				rawUnit.levels[(this.village === 'home' ? data.townHallLevel : data.builderHallLevel!) - 1] ?? this.maxLevel;
			this.equipment = (unit.equipment ?? []).map((unit) => new Equipment(data, unit));
		}

		this.seasonal = Boolean(rawUnit?.seasonal);
		this.isLoaded = Boolean(rawUnit);
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
		return this.isActive || (this.isHomeBase && SUPER_TROOPS.includes(this.name));
	}
}

/** Represents a Player's Spell. */
export class Spell extends Unit {}

/** Represents a Player's Hero. */
export class Hero extends Unit {
	/** @deprecated Heroes no longer regenerate; always `0`. */
	public regenerationTime!: number;

	/** Hero Equipment */
	public equipment!: Equipment[];
}

/** Represents a Player's Hero Equipment. */
export class Equipment extends Unit {}
