const { UNITS, SUPER_UNITS } = require('../static/parsed.json');

/**
 * PlayerItem Builder Class
 * @class
 * @private
 */
class PlayerItem {
	/**
	 * Player Item
	 * @private
	 * @param {Object} player Raw API data
	 * @param {Object} data Player Item Data
	 * @param {string} category Category of the Item
	 */
	constructor(player, data, category) {
		/**
		 * Name of the item
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * Level of the item
		 * @type {number}
		 */
		this.level = data.level;

		/**
		 * Max level of the unit
		 * @type {number}
		 */
		this.maxLevel = data.maxLevel;

		/**
		 * Village of the item
		 * @type {string}
		 */
		this.village = data.village;

		/**
		 * ID of the item
		 * @type {number}
		 * @name PlayerItem#id
		 */

		/**
		 * Housing Space
		 * @type {number}
		 * @name PlayerItem#housingSpace
		 */

		/**
		 * Unlock Cost
		 * @type {number}
		 * @name PlayerItem#unlockCost
		 */

		/**
		 * Unlock Time
		 * @type {number}
		 * @name PlayerItem#unlockTime
		 */

		/**
		 * Unlock Resource Name
		 * @type {string}
		 * @name PlayerItem#unlockResource
		 */

		/**
		 * Unlock Building Name
		 * @type {string}
		 * @name PlayerItem#unlockBuilding
		 */

		/**
		 * Unlock Towmhall Level
		 * @type {number}
		 * @name PlayerItem#unlockTownHallLevel
		 */

		/**
		 * Unlock Building Level
		 * @type {number}
		 * @name PlayerItem#unlockBuildingLevel
		 */

		/**
		 * Upgrade Resource
		 * @type {string}
		 * @name PlayerItem#upgradeResource
		 */

		/**
		 * Upgrade Cost
		 * @type {number}
		 * @name PlayerItem#upgradeCost
		 */

		/**
		 * Upgrade Time
		 * @type {number}
		 * @name PlayerItem#upgradeTime
		 */

		this._extra(data, player, category);
		this.superTroopIsActive = data.superTroopIsActive ?? false;
	}

	_extra(data, player, category) {
		const unit = UNITS.find(unit => unit.village === data.village && unit.category === category && unit.name === data.name);
		const superUnit = SUPER_UNITS.find(unit => unit.name === data.name && data.village === 'home');

		if (superUnit) {
			this.id = superUnit.id;
			this.housingSpace = superUnit.housingSpace;
			this.originalName = superUnit.original;
			this.minOriginalLevel = superUnit.minOriginalLevel;
			this.trainingCost = superUnit.resourceCost;
			this.cooldown = superUnit.cooldown;
			this.boostDuration = superUnit.duration;
			const original = UNITS.find(unit => unit.village === 'home' && unit.name === superUnit.original);
			this.unlockTownhallLevel = original.levels.findIndex(level => level >= this.minOriginalLevel) + 1;
			this.unlockCost = original.unlock.cost;
			this.unlockTime = original.unlock.time;
			this.unlockResource = original.unlock.resource;
			this.unlockBuilding = original.unlock.building;
			this.unlockBuildingLevel = original.unlock.buildingLevel;
			const origin = player.troops.find(troop => troop.village === 'home' && troop.name === original.name);
			this.upgradeCost = original.upgrade.cost[origin.level - 1] ?? 0;
			this.upgradeResource = original.upgrade.resource;
			this.upgradeTime = original.upgrade.time[origin.level - 1] ?? 0;
			this.townHallmaxLevel = original.levels[player.townHallLevel - 1];
		}

		if (unit) {
			this.id = unit.id;
			this.housingSpace = unit.housingSpace;
			this.unlockCost = unit.unlock.cost;
			this.unlockTime = unit.unlock.time;
			this.unlockResource = unit.unlock.resource;
			this.unlockBuilding = unit.unlock.building;
			this.unlockTownHallLevel = unit.unlock.hall;
			this.unlockBuildingLevel = unit.unlock.buildingLevel;
			this.upgradeResource = unit.upgrade.resource;
			this.upgradeCost = unit.upgrade.cost[this.level - 1] ?? 0;
			this.upgradeTime = unit.upgrade.time[this.level - 1] ?? 0;
			this.townHallmaxLevel = unit.levels[(data.village === 'home' ? player.townHallLevel : player.builderHallLevel) - 1];
		}

		this.isExtended = Boolean(unit || superUnit);
		this.isSuperTroop = data.name in SUPER_UNITS;
	}
}

/**
 * Player Troop Builder Class
 * @class
 * @extends {PlayerItem}
 */
class Troop extends PlayerItem {
	/**
	 * Initializes a new instance of `Troop`
	 * @param {Object} player Raw API data
	 * @param {Object} data Player Item Data
	 */
	constructor(player, data) {
		super(player, data, 'troop');

		/**
		 * Whether this troop is super troops and active.
		 * @type {boolean}
		 * @name Troop#superTroopIsActive
		 */

		/**
		 * Whether this item is a Super Troop
		 * @type {boolean}
		 * @name Troop#isSuperTroop
		 */
		this.isSuperTroop;

		/**
		 * Original name of the Super Troop
		 * @type {string|null}
		 * @name Troop#originalName
		 */

		/**
		 * Minimum level of origin Super Troop
		 * @type {number|null}
		 * @name Troop#minOriginalLevel
		 */

		/**
		 * Cooldown of the Super Troop
		 * @type {number|null}
		 * @name Troop#cooldown
		 */

		/**
		 * Boost Duration of the Super Troop
		 * @type {number|null}
		 * @name Troop#boostDuration
		 */
	}
}

/**
 * Player Spell Builder Class
 * @class
 * @extends {PlayerItem}
 */
class Spell extends PlayerItem {
	/**
	 * Initializes a new instance of `Spell`
	 * @param {Object} player Raw API data
	 * @param {Object} data Player Item Data
	 */
	constructor(player, data) {
		super(player, data, 'spell');
	}
}

/**
 * Player Hero Builder Class
 * @class
 * @extends {PlayerItem}
 */
class Hero extends PlayerItem {
	/**
	 * Initializes a new instance of `Hero`
	 * @param {Object} player Raw API data
	 * @param {Object} data Player Item Data
	 */
	constructor(player, data) {
		super(player, data, 'hero');
	}
}

/**
 * Player Builder Class
 * @class
 */
class Player {
	/**
	 * Player
	 * @param {Object} client Base Client
	 * @param {Object} data Raw API data
	 */
	constructor(client, data) {
		/**
		 * Name of the player
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * Tag of the player
		 * @type {string}
		 */
		this.tag = data.tag;

		/**
		 * Townhall Level of the player
		 * @type {number}
		 */
		this.townHallLevel = data.townHallLevel;

		/**
		 * Town Hall Weapon Level
		 * @type {number|null}
		 */
		this.townHallWeaponLevel = data.townHallWeaponLevel ?? null;

		/**
		 * Experience Level
		 * @type {number}
		 */
		this.expLevel = data.expLevel;

		/**
		 * Trophies
		 * @type {number}
		 */
		this.trophies = data.expLevel;

		/**
		 * Best Trophies
		 * @type {number}
		 */
		this.bestTrophies = data.bestTrophies;

		/**
		 * War Stars
		 * @type {number}
		 */
		this.warStars = data.warStars;

		/**
		 * Attack Wins
		 * @type {number}
		 */
		this.attackWins = data.attackWins;

		/**
		 * Defense Wins
		 * @type {number}
		 */
		this.defenseWins = data.defenseWins;

		/**
		 * Builder Hall Level
		 * @type {number}
		 */
		this.builderHallLevel = data.builderHallLevel;

		/**
		 * Versus Trophies
		 * @type {number|null}
		 */
		this.versusTrophies = data.versusTrophies ?? null;

		/**
		 * Best Versus Trophies
		 * @type {number|null}
		 */
		this.bestVersusTrophies = data.bestVersusTrophies ?? null;

		/**
		 * Versus Battle Wins
		 * @type {number|null}
		 */
		this.versusBattleWins = data.versusBattleWins ?? null;

		/**
		 * Donations
		 * @type {number}
		 */
		this.donations = data.donations;

		/**
		 * Donations Received
		 * @type {number}
		 */
		this.donationsReceived = data.donationsReceived;

		/**
		 * Clan Role of the player
		 * @type {string|null}
		 */
		this.role = data.role ?? null;

		/**
		 * Clan of the player
		 * @type {PlayerClan|null}
		 */
		this.clan = data.clan;

		/**
		 * League of the player
		 * @type {PlayerLeague|null}
		 */
		this.league = data.league ?? null;

		/**
		 * Legend statistics of the player
		 * @type {LegendStatistics|null}
		 */
		this.legendStatistics = data.legendStatistics ?? null;

		/**
		 * Player Achievements
		 * @type {PlayerAchievement[]}
		 */
		this.achievements = data.achievements ?? [];

		/**
		 * Player Labels
		 * @type {PlayerLabel[]}
		 */
		this.labels = data.labels ?? [];

		Object.defineProperty(this, 'data', { value: data, writable: true });
		Object.defineProperty(this, 'client', { value: client, writable: true });
	}

	get statusCode() {
		return this.data.statusCode;
	}

	get ok() {
		return this.data.ok;
	}

	get maxAge() {
		return this.data.maxAge;
	}

	/**
	 * Player Troops
	 * @readonly
	 * @type {Troop[]}
	 */
	get troops() {
		return this.data.troops?.map(troop => new Troop(this.data, troop)) ?? [];
	}

	/**
	 * Player Spells
	 * @readonly
	 * @type {Spell[]}
	 */
	get spells() {
		return this.data.spells?.map(spell => new Spell(this.data, spell)) ?? [];
	}

	/**
	 * Player Heroes
	 * @readonly
	 * @type {Spell[]}
	 */
	get heroes() {
		return this.data.heroes?.map(hero => new Hero(this.data, hero)) ?? [];
	}
}

module.exports = Player;

/**
 * Badge Urls
 * @memberof core
 * @typedef {Object} BadgeUrls
 * @property {string} small - Small Badge
 * @property {string} large - Large Badge
 * @property {string} medium - Medium Badge
 */

/**
 * Icon Urls
 * @memberof core
 * @typedef {Object} IconUrls
 * @property {string} small - Small Icon
 * @property {string} tiny - Tiny Icon
 * @property {string} medium - Medium Icon
 */

/**
 * Clan of the player
 * @memberof core
 * @typedef {Object} PlayerClan
 * @property {string} tag Tag of the clan
 * @property {string} name Name of the clan
 * @property {number} clanLevel Level of the clan
 * @property {BadgeUrls} badgeUrls Clan Badge Urls
 */

/**
 * League of the player
 * @memberof core
 * @typedef {Object} PlayerLeague
 * @property {number} id ID of the League
 * @property {string} name Name of the League
 * @property {IconUrls} iconUrls Clan Badge Urls
 */

/**
 * Legend statistics of the player
 * @memberof core
 * @typedef {Object} LegendStatistics
 * @property {number} legendTrophies - Legend Trophies
 * @property {Object} bestSeason - Best Legend Season Data
 * @property {string} bestSeason.id - ID of the Season
 * @property {number} bestSeason.rank - Best rank of the season
 * @property {numver} bestSeason.trophies - Best season trophies
 * @property {Object} currentSeason - Current Season Data
 * @property {number} currentSeason.trophies - Current Season Trophies
 */

/**
 * Player Achievement
 * @memberof core
 * @typedef {Object} PlayerAchievement
 * @property {string} name - Name of the Achievement
 * @property {number} stars - Stars of the Achievement
 * @property {number} value - Value of the Achievement
 * @property {number} target - Target of the Achievement
 * @property {sring} completionInfo - Completion info of the Achievement
 * @property {'home'|'builderBase'} village - Village of the Achievement
 */

/**
 * Player Label
 * @memberof core
 * @typedef {Object} PlayerLabel
 * @property {number} id ID of the Label
 * @property {string} name Name of the Label
 * @property {Object} iconUrls Label Icon Data
 * @property {string} iconUrls.small Small Icon
 * @property {string} iconUrls.medium Medium Icon
 */
