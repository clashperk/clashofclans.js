import BUILDINGS_JSON from './buildings.json';
import UNITS_JSON from './units.json';

// #region clash-asset-library schema
// Mirrors https://github.com/clashperk/clash-asset-library/blob/main/docs/schema.md (snake_case, as published).

export type StaticVillageType = 'home' | 'builder_base';

export interface StaticBuildingLevel {
	level: number;
	/** `null` for the Builder Hall itself. */
	required_townhall: number | null;
	build_cost: number;
	build_time: number;
}

export interface StaticBuilding {
	id: number;
	name: string;
	tid: string;
	village_type: StaticVillageType;
	upgrade_resource: string;
	levels: StaticBuildingLevel[];
}

interface StaticUnitBase {
	/** Supercell's `GlobalID` (troops `4000000+`, spells `26000000+`) or a per-category series (heroes `28000000+`, pets `73000000+`, equipment `90000000+`). */
	id: number;
	name: string;
	info: string;
	tid: string;
	info_tid: string;
	production_building: string | null;
	production_building_level: number | null;
	/** Icon path under `https://assets.clashperk.com/`, e.g. `troops/barbarian/icon.webp`. */
	slug: string | null;
}

interface StaticCombatUnit extends StaticUnitBase {
	upgrade_resource: string;
	is_flying: boolean;
	is_air_targeting: boolean;
	is_ground_targeting: boolean;
	speed: number;
	attack_speed: number;
	attack_range: number;
}

interface StaticLevelBase {
	level: number;
	/** Town Hall (or Builder Hall) level required. For the first level this is derived from the lab level and can differ from the production building's; see `RawUnit.unlock.hall`. */
	required_townhall: number;
	strength_weight: number;
}

export interface StaticTroopLevel extends StaticLevelBase {
	hitpoints: number;
	dps: number;
	upgrade_time: number;
	upgrade_cost: number;
	required_lab_level: number | null;
}

export interface StaticTroop extends StaticCombatUnit {
	housing_space: number;
	village_type: StaticVillageType;
	is_seasonal?: boolean | null;
	super_troop?: { original_id: number; min_original_level: number } | null;
	levels: StaticTroopLevel[];
}

export interface StaticSpellLevel extends StaticLevelBase {
	duration: number;
	radius: number;
	damage: number;
	upgrade_time: number;
	upgrade_cost: number;
	required_lab_level: number | null;
}

export interface StaticSpell extends StaticUnitBase {
	upgrade_resource: string;
	housing_space: number;
	is_seasonal?: boolean | null;
	levels: StaticSpellLevel[];
}

export interface StaticHeroLevel extends StaticLevelBase {
	hitpoints: number;
	dps: number;
	upgrade_time: number;
	upgrade_cost: number;
	required_hero_tavern_level: number | null;
}

export interface StaticHero extends StaticCombatUnit {
	village_type: StaticVillageType;
	levels: StaticHeroLevel[];
}

export interface StaticPetLevel extends StaticLevelBase {
	hitpoints: number;
	dps: number;
	upgrade_time: number;
	upgrade_cost: number;
	required_pet_house_level: number;
}

export interface StaticPet extends StaticCombatUnit {
	levels: StaticPetLevel[];
}

export interface StaticEquipmentLevel extends StaticLevelBase {
	hitpoints: number;
	dps: number;
	heal_on_activation?: number;
	required_blacksmith_level: number;
	upgrade_cost: { shiny_ore: number; glowy_ore: number; starry_ore: number };
	abilities?: Record<string, unknown>[];
}

export interface StaticEquipment extends StaticUnitBase {
	production_building_tid: string;
	rarity: 'Common' | 'Epic';
	hero: string;
	levels: StaticEquipmentLevel[];
}

export interface StaticUnitsData {
	/** Supercell asset-build SHA the data was generated from. */
	fingerprint: string;
	troops: StaticTroop[];
	spells: StaticSpell[];
	heroes: StaticHero[];
	pets: StaticPet[];
	equipment: StaticEquipment[];
}

/** `units.json` from clash-asset-library, as published. Update with `npm run update:static`. */
export const UNITS_DATA = UNITS_JSON as unknown as StaticUnitsData;

/** The production buildings (and both halls) from `raw.json`, used to derive unlock requirements. */
export const BUILDINGS_DATA = BUILDINGS_JSON as unknown as { fingerprint: string; buildings: StaticBuilding[] };

// #endregion

// #region normalized units

export type UnitVillage = 'home' | 'builderBase';
export type UnitCategory = 'troop' | 'spell' | 'hero' | 'equipment';
export type UnitSubCategory = 'troop' | 'siege' | 'pet' | 'spell' | 'hero' | 'equipment';

/** Town Hall level required to boost super troops. */
export const SUPER_TROOP_MIN_TOWN_HALL_LEVEL = 11;

/** A unit from {@link UNITS_DATA}, normalized to the vocabulary of the Clash of Clans API. */
export interface RawUnit {
	/** Same as {@link StaticTroop.id} etc. Army links carry `id % 1_000_000`. */
	id: number;
	tid: string;
	name: string;
	slug: string | null;
	village: UnitVillage;
	/** Category as the API groups it: pets and siege machines are `troop`. */
	category: UnitCategory;
	subCategory: UnitSubCategory;
	housingSpace: number;
	seasonal: boolean;
	/** Hero this equipment belongs to; `null` for anything that is not hero equipment. */
	hero: string | null;
	rarity: 'Common' | 'Epic' | null;
	superTroop: { originalId: number; originalName: string; minOriginalLevel: number } | null;
	minLevel: number;
	maxLevel: number;
	/** Max level at each Town/Builder Hall level (`levels[hall - 1]`); `0` until the unit is unlocked. */
	levels: number[];
	/** Damage per second at each level (`dps[level - minLevel]`). */
	dps: number[];
	unlock: {
		hall: number;
		building: string;
		buildingLevel: number;
		cost: number;
		time: number;
		resource: string;
	};
	upgrade: {
		resource: string;
		/** Cost to upgrade from each level to the next (`cost[level - minLevel]`). */
		cost: number[];
		time: number[];
		/** Per-upgrade ore costs; only populated for hero equipment. */
		resources: { resource: string; cost: number }[][];
	};
}

export interface RawSuperUnit {
	id: number;
	name: string;
	/** Name of the troop this super troop is boosted from. */
	original: string;
	originalId: number;
	minOriginalLevel: number;
	village: 'home';
	housingSpace: number;
}

const ORES = [
	['shiny_ore', 'Shiny Ore'],
	['glowy_ore', 'Glowy Ore'],
	['starry_ore', 'Starry Ore']
] as const;

/** In-game display order, which is also the order of {@link RAW_UNITS}. */
const PRODUCTION_BUILDINGS = [
	'Barracks',
	'Dark Barracks',
	'Workshop',
	'Builder Barracks',
	'Spell Factory',
	'Dark Spell Factory',
	'Hero Hall',
	'Builder Hall',
	'Pet House',
	'Blacksmith'
];

const toVillage = (village?: StaticVillageType | null): UnitVillage => (village === 'builder_base' ? 'builderBase' : 'home');

const findBuilding = (name: string | null, village: UnitVillage) =>
	BUILDINGS_DATA.buildings.find((building) => building.name === name && toVillage(building.village_type) === village) ?? null;

const HALL_LEVELS: Record<UnitVillage, number> = {
	home: findBuilding('Town Hall', 'home')!.levels.length,
	builderBase: findBuilding('Builder Hall', 'builderBase')!.levels.length
};

type StaticUnit = StaticTroop | StaticSpell | StaticHero | StaticPet | StaticEquipment;
type StaticLevel = StaticUnit['levels'][number];

interface BuildOptions {
	unit: StaticUnit;
	category: UnitCategory;
	subCategory: UnitSubCategory;
	village: UnitVillage;
	upgradeResource: string;
	housingSpace?: number;
	seasonal?: boolean | null;
	hero?: string;
	rarity?: 'Common' | 'Epic';
	superTroop?: RawUnit['superTroop'];
	unlock?: RawUnit['unlock'];
}

const isEquipmentLevel = (level: StaticLevel): level is StaticEquipmentLevel => typeof level.upgrade_cost === 'object';

const unlockFrom = ({ unit, village, upgradeResource }: BuildOptions): RawUnit['unlock'] => {
	const building = findBuilding(unit.production_building, village);
	const level = building?.levels[(unit.production_building_level ?? 0) - 1];
	if (building && level?.required_townhall) {
		return {
			hall: level.required_townhall,
			building: building.name,
			buildingLevel: level.level,
			cost: level.build_cost,
			time: level.build_time,
			resource: building.upgrade_resource
		};
	}

	// builder base heroes have no production building; the Builder Hall level itself gates them
	const hall = unit.levels[0].required_townhall;
	return {
		hall,
		building: village === 'home' ? 'Town Hall' : 'Builder Hall',
		buildingLevel: hall,
		cost: 0,
		time: 0,
		resource: upgradeResource
	};
};

const buildUnit = (options: BuildOptions): RawUnit => {
	const { unit, category, subCategory, village } = options;
	const levels: StaticLevel[] = unit.levels;
	const minLevel = levels[0].level;
	const maxLevel = levels[levels.length - 1].level;
	const unlock = options.unlock ?? unlockFrom(options);

	// The first level's `required_townhall` is lab-derived and can sit above (Barbarian: TH3) or below
	// (Lightning Spell: TH3) the production building's Town Hall, so the unit is available from
	// `unlock.hall` and only the later levels are gated by their own requirement.
	const hallLevels = Array.from({ length: HALL_LEVELS[village] }, (_, index) => {
		const hall = index + 1;
		if (hall < unlock.hall) return 0;
		return levels.slice(1).reduce((max, level) => (level.required_townhall <= hall ? Math.max(max, level.level) : max), minLevel);
	});

	const upgrades = levels.slice(0, -1); // the last level has nothing to upgrade to

	return {
		id: unit.id,
		tid: unit.tid,
		name: unit.name,
		slug: unit.slug,
		village,
		category,
		subCategory,
		housingSpace: options.housingSpace ?? 0,
		seasonal: Boolean(options.seasonal),
		hero: options.hero ?? null,
		rarity: options.rarity ?? null,
		superTroop: options.superTroop ?? null,
		minLevel,
		maxLevel,
		levels: hallLevels,
		dps: levels.map((level) => ('dps' in level ? level.dps : 0)),
		unlock,
		upgrade: {
			resource: options.upgradeResource,
			cost: upgrades.map((level) => (isEquipmentLevel(level) ? level.upgrade_cost.shiny_ore : level.upgrade_cost)),
			time: upgrades.map((level) => ('upgrade_time' in level ? level.upgrade_time : 0)),
			resources:
				category === 'equipment'
					? upgrades.map((level) =>
							isEquipmentLevel(level)
								? ORES.filter(([key]) => level.upgrade_cost[key] > 0).map(([key, resource]) => ({
										resource,
										cost: level.upgrade_cost[key]
								  }))
								: []
					  )
					: []
		}
	};
};

const troops = UNITS_DATA.troops
	.filter((troop) => !troop.super_troop)
	.map((troop) =>
		buildUnit({
			unit: troop,
			category: 'troop',
			subCategory: troop.production_building === 'Workshop' ? 'siege' : 'troop',
			village: toVillage(troop.village_type),
			upgradeResource: troop.upgrade_resource,
			housingSpace: troop.housing_space,
			seasonal: troop.is_seasonal
		})
	);

const superTroops = UNITS_DATA.troops
	.filter((troop) => troop.super_troop)
	.map((troop) => {
		const { original_id: originalId, min_original_level: minOriginalLevel } = troop.super_troop!;
		const original = troops.find((unit) => unit.id === originalId)!;
		return buildUnit({
			unit: troop,
			category: 'troop',
			subCategory: 'troop',
			village: 'home',
			upgradeResource: troop.upgrade_resource,
			housingSpace: troop.housing_space,
			seasonal: troop.is_seasonal,
			superTroop: { originalId, originalName: original.name, minOriginalLevel },
			// boosting needs Town Hall 11 and the original troop at `minOriginalLevel`
			unlock: {
				...original.unlock,
				hall: Math.max(SUPER_TROOP_MIN_TOWN_HALL_LEVEL, original.levels.findIndex((level) => level >= minOriginalLevel) + 1)
			}
		});
	});

const spells = UNITS_DATA.spells.map((spell) =>
	buildUnit({
		unit: spell,
		category: 'spell',
		subCategory: 'spell',
		village: 'home',
		upgradeResource: spell.upgrade_resource,
		housingSpace: spell.housing_space,
		seasonal: spell.is_seasonal
	})
);

const heroes = UNITS_DATA.heroes.map((hero) =>
	buildUnit({
		unit: hero,
		category: 'hero',
		subCategory: 'hero',
		village: toVillage(hero.village_type),
		upgradeResource: hero.upgrade_resource
	})
);

const pets = UNITS_DATA.pets.map((pet) =>
	buildUnit({ unit: pet, category: 'troop', subCategory: 'pet', village: 'home', upgradeResource: pet.upgrade_resource })
);

const equipment = UNITS_DATA.equipment.map((item) =>
	buildUnit({
		unit: item,
		category: 'equipment',
		subCategory: 'equipment',
		village: 'home',
		upgradeResource: 'Shiny Ore',
		hero: item.hero,
		rarity: item.rarity
	})
);

const displayOrder = (unit: RawUnit) => PRODUCTION_BUILDINGS.indexOf(unit.unlock.building);

/** Every unit in {@link UNITS_DATA} (super troops and seasonal units included), in in-game order. */
export const RAW_UNITS: RawUnit[] = [...troops, ...superTroops, ...spells, ...heroes, ...pets, ...equipment].sort(
	(a, b) => displayOrder(a) - displayOrder(b) || a.unlock.buildingLevel - b.unlock.buildingLevel || a.id - b.id
);

export const RAW_SUPER_UNITS: RawSuperUnit[] = RAW_UNITS.filter((unit) => unit.superTroop).map((unit) => ({
	id: unit.id,
	name: unit.name,
	original: unit.superTroop!.originalName,
	originalId: unit.superTroop!.originalId,
	minOriginalLevel: unit.superTroop!.minOriginalLevel,
	village: 'home',
	housingSpace: unit.housingSpace
}));

export const RAW_DATA = { RAW_UNITS, RAW_SUPER_UNITS };

const unitsByName = new Map<string, RawUnit>();
for (const unit of RAW_UNITS) {
	const key = `${unit.village}:${unit.name}`;
	const existing = unitsByName.get(key);
	// seasonal troops reuse permanent names (e.g. Meteor Golem); the permanent one wins
	if (!existing || (existing.seasonal && !unit.seasonal)) unitsByName.set(key, unit);
}

/** Static data for a unit, looked up by its API `name` and `village`. */
export const getRawUnit = (name: string, village: UnitVillage = 'home') => unitsByName.get(`${village}:${name}`) ?? null;

// #endregion
