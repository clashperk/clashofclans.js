/**
 * Represents a Icon
 */
export class Icon {
	public url: string;
	public tiny: string;
	public small: string;
	public medium: string;

	public constructor(data: any) {
		/**
		 * The default icon URL
		 * @type {string}
		 */
		this.url = data.medium;

		/**
		 * The medium icon URL
		 * @type {string}
		 */
		this.medium = data.medium;

		/**
		 * The small icon URL
		 * @type {string}
		 */
		this.small = data.small;

		/**
		 * The tiny icon URL
		 * @type {string}
		 */
		this.tiny = data.tiny ?? data.small;
	}
}

/**
 * Represents a Badge
 */
export class Badge {
	public url: string;
	public large: string;
	public medium: string;
	public small: string;

	public constructor(data: any) {
		/**
		 * The default icon URL
		 * @type {string}
		 */
		this.url = data.large;

		/**
		 * The large icon URL
		 * @type {string}
		 */
		this.large = data.large;

		/**
		 * The medium icon URL
		 * @type {string}
		 */
		this.medium = data.medium;

		/**
		 * The small icon URL
		 * @type {string}
		 */
		this.small = data.small;
	}
}

/**
 * Represents a Clan or Player Label
 */
export class Label {
	public id: string;
	public name: string;
	public icon: Icon;

	public constructor(data: any) {
		/**
		 * The label's unique ID
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * The label's name
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * The label's icon
		 * @type {Icon}
		 */
		this.icon = new Icon(data.iconUrls);
	}
}

/**
 * Represents a Location
 */
export class Location {
	public id: string;
	public name: string;
	public localizedName: string | null;
	public isCountry: boolean;
	public countryCode: string | null;

	public constructor(data: any) {
		/**
		 * The location ID
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * The location name
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * A localized name of the location
		 * @type {string}
		 */
		this.localizedName = data.localizedName ?? null;

		/**
		 * Indicates whether the location is a country
		 * @type {boolean}
		 */
		this.isCountry = data.isCountry;

		/**
		 * The country code of the location
		 * @type {?string|null}
		 */
		this.countryCode = data.countryCode ?? null;
	}
}

/**
 * Represents a Player's League
 */
export class League {
	public id: string;
	public name: string;
	public icon: Icon;

	public constructor(data: any) {
		/**
		 * The league ID
		 * @type {number}
		 */
		this.id = data.id;

		/**
		 * The league name
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * The league icon URL
		 * @type {Icon}
		 */
		this.icon = new Icon(data.iconUrls);
	}
}

/**
 * Represents a Clan's War League
 */
export class WarLeague {
	public id: string;
	public name: string;

	public constructor(data: any) {
		/**
		 * The league's unique ID
		 * @type {number}
		 */
		this.id = data.id;

		/**
		 * The league's name
		 * @type {string}
		 */
		this.name = data.name;
	}
}

/**
 * Represents a Clan's Chat Language
 */
export class ChatLanguage {
	public id: string;
	public name: string;
	public code: string;

	public constructor(data: any) {
		/**
		 * The language's unique ID
		 * @type {number}
		 */
		this.id = data.id;

		/**
		 * The language's full name
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * The language's code
		 * @type {string}
		 */
		this.code = data.languageCode;
	}
}

export class ClanMember {
	public name: string;
	public tag: string;
	public role: string;
	public expLevel: number;
	public league: League;
	public trophies: number;
	public versusTrophies: number;
	public clanRank: number;
	public previousClanRank: number;
	public donations: number;
	public donationsReceived: number;

	public constructor(data: any) {
		/**
		 * Name of the member
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * Tag of the member
		 * @type {string}
		 */
		this.tag = data.tag;

		/**
		 * Role of member
		 * @type {string}
		 */
		this.role = data.role ?? null;

		/**
		 * EXP Level of the member
		 * @type {number}
		 */
		this.expLevel = data.expLevel;

		/**
		 * League of the member
		 * @type {League}
		 */
		this.league = new League(data.league);

		/**
		 * Trophies of the member
		 * @type {number}
		 */
		this.trophies = data.trophies;

		/**
		 * Versus trophies of the member
		 * @type {number}
		 */
		this.versusTrophies = data.versusTrophies;

		/**
		 * Clan rank of the member
		 * @type {number}
		 */
		this.clanRank = data.clanRank;

		/**
		 * Previous clan rank of the member
		 * @type {number}
		 */
		this.previousClanRank = data.previousClanRank;

		/**
		 * Donations of the member
		 * @type {number}
		 */
		this.donations = data.donations;

		/**
		 * Donations Received of the member
		 * @type {number}
		 */
		this.donationsReceived = data.donationsReceived;
	}
}

export class Season {
	public id: string;
	public rank: number;
	public trophies: number;

	public constructor(data: any) {
		this.id = data.id;
		this.rank = data.rank;
		this.trophies = data.trophies;
	}
}

// TODO:
export class LegendStatistics {
	public legendTrophies: number;

	public constructor(data: any) {
		this.legendTrophies = data.legendTrophies;
	}
}

export class Unit {
	public name: string;
	public level: number;
	public maxLevel: number;
	public village: 'home' | 'builderBase';

	public constructor(data: any) {
		this.name = data.name;
		this.level = data.level;
		this.maxLevel = data.maxLevel;
		this.village = data.village;
	}
}

export class Troop extends Unit {
	public superTroopIsActive: boolean;

	public constructor(data: any) {
		super(data);
		this.superTroopIsActive = data.superTroopIsActive;
	}
}

export class Spell extends Unit {
	public constructor(data: any) {
		super(data);
	}
}

export class Hero extends Unit {
	public constructor(data: any) {
		super(data);
	}
}

export class PlayerClan {
	public name: string;
	public tag: string;
	public level: number;
	public badge: Badge;

	public constructor(data: any) {
		this.name = data.name;
		this.tag = data.tag;
		this.level = data.level;
		this.badge = new Badge(data.badge);
	}
}

export interface PlayerAchievement {
	name: string;
	stars: number;
	value: number;
	target: number;
	info: string;
	completionInfo: string | null;
	village: 'home' | 'builderBase';
}

export class Achievement {
	public name: string;
	public stars: number;
	public value: number;
	public target: number;
	public info: string;
	public village: 'home' | 'builderBase';
	public completionInfo: string | null;

	public constructor(data: any) {
		this.name = data.name;
		this.stars = data.stars;
		this.value = data.value;
		this.target = data.target;
		this.info = data.info;
		this.village = data.village;
		this.completionInfo = data.completionInfo ?? null;
	}
}
