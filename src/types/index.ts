// **************** CLANS **************** //

/**
 * /clans?name={name}&limit={limit}
 */
export interface ClanList {
	items: (Omit<APIClan, 'memberList'>)[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

/**
 * /clans/{clanTag}
 */
export interface APIClan {
	tag: string;
	name: string;
	type: string;
	description: string;
	location?: Location;
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
	labels: Label[];
	memberList: ClanMember[];

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

export interface ClanMember {
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
export interface ClanMemberList {
	items: ClanMember[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

/**
 * /clans/{clanTag}/currentwar
 */
export interface ClanWar {
	state: 'notInWar' | 'preparation' | 'inWar' | 'warEnded';
	teamSize: number;
	startTime: string;
	preparationStartTime: string;
	endTime: string;
	clan: WarClan;
	opponent: WarClan;
	attacksPerMember: number;

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

export interface WarClan {
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
	members: ClanWarMember[];
}

export interface ClanWarMember {
	tag: string;
	name: string;
	mapPosition: number;
	townhallLevel: number;
	opponentAttacks: number;
	bestOpponentAttack?: ClanWarAttack;
	attacks?: ClanWarAttack[];
}

export interface ClanWarAttack {
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
export interface ClanWarLog {
	items: {
		result: 'win' | 'lose' | 'tie' | null;
		endTime: string;
		teamSize: number;
		attacksPerMember?: number;
		clan: Omit<WarClan, 'members'>;
		opponent: Omit<WarClan, 'members' | 'attacks' | 'expEarned'>;
	}[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

/**
 * /clans/{clanTag}/currentwar/leaguegroup
 */
export interface ClanWarLeagueGroup {
	state: 'notInWar' | 'preparation' | 'inWar' | 'warEnded';
	season: string;
	clans: ClanWarLeagueClan[];
	rounds: ClanWarLeagueRound[];

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

export interface ClanWarLeagueClan {
	name: string;
	tag: string;
	clanLevel: number;
	badgeUrls: {
		small: string;
		large: string;
		medium: string;
	};
	members: ClanWarLeagueClanMember[];
}

export interface ClanWarLeagueClanMember {
	name: string;
	tag: string;
	townHallLevel: number;
}

export interface ClanWarLeagueRound {
	warTags: string[];
}

// /clanwarleagues/wars/{warTag}
// Same as {ClanWar}

// *************** PLAYERS *************** //

/**
 * /players/{playerTag}
 */
export interface Player {
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
	achievements: PlayerAchievement[];
	troops: PlayerItem[];
	heroes: PlayerItem[];
	spells: PlayerItem[];
	labels: {
		id: number;
		name: string;
		iconUrls: {
			small: string;
			medium: string;
		};
	}[];

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
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

export interface PlayerItem {
	name: string;
	level: number;
	maxLevel: number;
	superTroopIsActive?: boolean;
	village: 'home' | 'builderBase';
}

/**
 * /players/{playerTag}/verifytoken
 */
export interface VerifyToken {
	tag: string;
	token: string;
	status: 'ok' | 'invalid';

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

// ************* LOCATIONS ************* //

/**
 * /locations
 */
export interface LocationList {
	items: Location[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

/**
 * /locations/{loacationId}
 */
export interface Location {
	localizedName: string;
	id: number;
	name: string;
	isCountry: boolean;
	countryCode: string;

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

/**
 * /locations/{locationId}/rankings/clans
 */
export interface ClanRankingList {
	items: ClanRanking[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

export interface ClanRanking {
	clanLevel: number;
	clanPoints: number;
	location: Location;
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
export interface PlayerRankingList {
	items: PlayerRanking[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

export interface PlayerRanking {
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
export interface ClanVersusRankingList {
	items: ClanVersusRanking[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

export interface ClanVersusRanking {
	clanLevel: number;
	location: Location;
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
 * /locations/{locationId}/rankings/clans-versus
 */
export interface PlayerVersusRankingList {
	items: ClanVersusRanking[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

export interface PlayerVersusRanking {
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
export interface LeagueList {
	items: League[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

/**
 * /leagues/{leagueId}
 */
export interface League {
	id: string;
	name: string;
	iconUrls: {
		tiny: string;
		small: string;
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

/**
 * /leagues/{leagueId}/seasons/{seasonId}
 */
export interface PlayerSeasonRankingList {
	items: (Omit<PlayerRanking, 'league'>)[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

/**
 * /leagues/{leagueId}/seasons
 */
export interface LeagueSeasonList {
	items: {
		id: string;
	}[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

/**
 * /warleagues
 */
export interface WarLeagueList {
	items: WarLeague[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

/**
 * /warleagues/{leagueId}
 */
export interface WarLeague {
	id: string;
	name: string;

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

// ************** LABELS ************** //

/**
  * /labels/players
  *
  * /labels/clans
  */
export interface LabelList {
	items: Label[];
	paging: {
		cursors: {
			after?: string;
			before?: string;
		};
	};

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

export interface Label {
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
export interface GoldPassSeason {
	startTime: string;
	endTime: string;

	ok: boolean;
	maxAge: number;
	reason?: string;
	message?: string;
	statusCode: number;
}

