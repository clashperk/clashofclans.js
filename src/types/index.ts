// **************** CLANS **************** //

/**
 * /clans?name={name}&limit={limit}
 */
export interface APIClanList {
	items: Omit<APIClan, 'memberList'>[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

/**
 * /clans/{clanTag}
 */
export interface APIClan {
	tag: string;
	name: string;
	type: string;
	description: string;
	location?: APILocation;
	chatLanguage?: {
		name: string;
		id: number;
		languageCode: string;
	};
	badgeUrls: {
		small: string;
		large: string;
		medium: string;
	};
	clanLevel: number;
	clanPoints: number;
	clanVersusPoints: number;
	requiredTrophies: number;
	requiredTownhallLevel?: number;
	warFrequency: string;
	warWinStreak: number;
	warWins: number;
	warTies?: number;
	warLosses?: number;
	isWarLogPublic: boolean;
	warLeague?: {
		name: string;
		id: number;
	};
	members: number;
	labels: APILabel[];
	memberList: APIClanMember[];
}

export interface APIClanMember {
	name: string;
	tag: string;
	role: 'member' | 'admin' | 'coLeader' | 'leader';
	expLevel: number;
	league: {
		id: number;
		name: string;
		iconUrls: {
			small: string;
			tiny: string;
			medium: string;
		};
	};
	trophies: number;
	versusTrophies: number;
	clanRank: number;
	previousClanRank: number;
	donations: number;
	donationsReceived: number;
}

/**
 * /clans/{clanTag}/members
 */
export interface APIClanMemberList {
	items: APIClanMember[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

export type APIWarStatus = 'notInWar' | 'preparation' | 'inWar' | 'warEnded';

/**
 * /clans/{clanTag}/currentwar
 */
export interface APIClanWar {
	state: APIWarStatus;
	teamSize: number;
	startTime: string;
	preparationStartTime: string;
	endTime: string;
	clan: APIWarClan;
	opponent: APIWarClan;
	attacksPerMember: number;
}

export interface APIWarClan {
	tag: string;
	name: string;
	badgeUrls: {
		small: string;
		large: string;
		medium: string;
	};
	clanLevel: number;
	attacks: number;
	stars: number;
	destructionPercentage: number;
	expEarned?: number;
	members: APIClanWarMember[];
}

export interface APIClanWarMember {
	tag: string;
	name: string;
	mapPosition: number;
	townhallLevel: number;
	opponentAttacks: number;
	bestOpponentAttack?: APIClanWarAttack;
	attacks?: APIClanWarAttack[];
}

export interface APIClanWarAttack {
	order: number;
	attackerTag: string;
	defenderTag: string;
	stars: number;
	duration: number;
	destructionPercentage: number;
}

/**
 * /clans/{clanTag}/warlog
 */
export interface APIClanWarLog {
	items: {
		result: 'win' | 'lose' | 'tie' | null;
		endTime: string;
		teamSize: number;
		attacksPerMember?: number;
		clan: Omit<APIWarClan, 'members'>;
		opponent: Omit<APIWarClan, 'members' | 'attacks' | 'expEarned'>;
	}[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

/**
 * /clans/{clanTag}/currentwar/leaguegroup
 */
export interface APIClanWarLeagueGroup {
	state: APIWarStatus;
	season: string;
	clans: APIClanWarLeagueClan[];
	rounds: APIClanWarLeagueRound[];
}

export interface APIClanWarLeagueClan {
	name: string;
	tag: string;
	clanLevel: number;
	badgeUrls: {
		small: string;
		large: string;
		medium: string;
	};
	members: APIClanWarLeagueClanMember[];
}

export interface APIClanWarLeagueClanMember {
	name: string;
	tag: string;
	townHallLevel: number;
}

export interface APIClanWarLeagueRound {
	warTags: string[];
}

// /clanwarleagues/wars/{warTag}
// Same as {ClanWar}

// *************** PLAYERS *************** //

/**
 * /players/{playerTag}
 */
export interface APIPlayer {
	name: string;
	tag: string;
	townHallLevel: number;
	townHallWeaponLevel?: number;
	expLevel: number;
	trophies: number;
	bestTrophies: number;
	warStars: number;
	attackWins: number;
	defenseWins: number;
	builderHallLevel?: number;
	versusTrophies?: number;
	bestVersusTrophies?: number;
	versusBattleWins?: number;
	donations: number;
	donationsReceived: number;
	role?: string;
	warPreference?: 'in' | 'out';
	clan?: {
		tag: string;
		name: string;
		clanLevel: number;
		badgeUrls: {
			small: string;
			large: string;
			medium: string;
		};
	};
	league?: {
		id: number;
		name: string;
		iconUrls: {
			small: string;
			tiny: string;
			medium: string;
		};
	};
	legendStatistics?: {
		legendTrophies: number;
		bestSeason: {
			id: string;
			rank: number;
			trophies: number;
		};
		currentSeason: {
			trophies: number;
		};
	};
	achievements: APIPlayerAchievement[];
	troops: APIPlayerItem[];
	heroes: APIPlayerItem[];
	spells: APIPlayerItem[];
	labels: {
		id: number;
		name: string;
		iconUrls: {
			small: string;
			medium: string;
		};
	}[];
}

export interface APIPlayerAchievement {
	name: string;
	stars: number;
	value: number;
	target: number;
	info: string;
	completionInfo: string | null;
	village: 'home' | 'builderBase';
}

export interface APIPlayerItem {
	name: string;
	level: number;
	maxLevel: number;
	superTroopIsActive?: boolean;
	village: 'home' | 'builderBase';
}

/**
 * /players/{playerTag}/verifytoken
 */
export interface APIVerifyToken {
	tag: string;
	token: string;
	status: 'ok' | 'invalid';
}

// ************* LOCATIONS ************* //

/**
 * /locations
 */
export interface APILocationList {
	items: APILocation[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

/**
 * /locations/{loacationId}
 */
export interface APILocation {
	localizedName: string;
	id: number;
	name: string;
	isCountry: boolean;
	countryCode: string;
}

/**
 * /locations/{locationId}/rankings/clans
 */
export interface APIClanRankingList {
	items: APIClanRanking[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

export interface APIClanRanking {
	clanLevel: number;
	clanPoints: number;
	location: APILocation;
	members: number;
	tag: string;
	name: string;
	rank: number;
	previousRank: number;
	badgeUrls: {
		small: string;
		large: string;
		medium: string;
	};
}

/**
 * /locations/{locationId}/rankings/players
 */
export interface APIPlayerRankingList {
	items: APIPlayerRanking[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

export interface APIPlayerRanking {
	tag: string;
	name: string;
	expLevel: number;
	trophies: number;
	attackWins: number;
	defenseWins: number;
	rank: number;
	clan: {
		tag: string;
		name: string;
		badgeUrls: {
			small: string;
			large: string;
			medium: string;
		};
	};
	league: {
		id: number;
		name: string;
		iconUrls: {
			small: string;
			tiny: string;
			medium: string;
		};
	};
}

/**
 * /locations/{locationId}/rankings/clans-versus
 */
export interface APIClanVersusRankingList {
	items: APIClanVersusRanking[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

export interface APIClanVersusRanking {
	clanLevel: number;
	location: APILocation;
	members: number;
	tag: string;
	name: string;
	rank: number;
	previousRank: number;
	badgeUrls: {
		small: string;
		large: string;
		medium: string;
	};
	clanVersusPoints: number;
}

/**
 * /locations/{locationId}/rankings/players-versus
 */
export interface APIPlayerVersusRankingList {
	items: APIClanVersusRanking[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

export interface APIPlayerVersusRanking {
	tag: string;
	name: string;
	expLevel: number;
	versusTrophies: number;
	versusBattleWins: number;
	rank: number;
	clan: {
		tag: string;
		name: string;
		badgeUrls: {
			small: string;
			large: string;
			medium: string;
		};
	};
}

// *************** LEAGUES *************** //

/**
 * /leagues
 */
export interface APILeagueList {
	items: APILeague[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

/**
 * /leagues/{leagueId}
 */
export interface APILeague {
	id: string;
	name: string;
	iconUrls: {
		tiny: string;
		small: string;
	};
}

/**
 * /leagues/{leagueId}/seasons/{seasonId}
 */
export interface APIPlayerSeasonRankingList {
	items: Omit<APIPlayerRanking, 'league'>[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

/**
 * /leagues/{leagueId}/seasons
 */
export interface APILeagueSeasonList {
	items: {
		id: string;
	}[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

/**
 * /warleagues
 */
export interface APIWarLeagueList {
	items: APIWarLeague[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

/**
 * /warleagues/{leagueId}
 */
export interface APIWarLeague {
	id: string;
	name: string;
}

// ************** LABELS ************** //

/**
 * /labels/players
 *
 * /labels/clans
 */
export interface APILabelList {
	items: APILabel[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};
}

export interface APILabel {
	id: number;
	name: string;
	iconUrls: {
		small: string;
		medium: string;
	};
}

// *********** GOLD PASS *********** //

/**
 * /goldpass/seasons/current
 */
export interface APIGoldPassSeason {
	startTime: string;
	endTime: string;
}
