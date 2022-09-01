export type APIPaging = {
	cursors?: APICursors;
}

export type APICursors = {
	after?: string;
	before?: string;
}

export type APIIcon = {
	/**
	 * Medium Icon is not available for Unranked Icon.
	 */
	medium?: string;

	small: string;

	/**
	 * Tiny Icon is not available for Labels.
	 */
	tiny?: string;
}

export type APIBadge = {
	large: string;
	medium: string;
	small: string;
}

export type APISeason = {
	id: string;
	rank: number;
	trophies: number;
}

// **************** CLANS **************** //

/**
 * /clans?name={name}&limit={limit}
 */
export type APIClanList = {
	items: Omit<APIClan, 'memberList'>[];
	paging: APIPaging;
}

export type APIChatLanguage = {
	id: number;
	languageCode: string;
	name: string;
}

/**
 * /clans/{clanTag}
 */
export type APIClan = {
    badgeUrls: APIBadge;
    chatLanguage?: APIChatLanguage;
    clanCapital: APIClanCapital;
    clanLevel: number;
    clanPoints: number;
    clanVersusPoints: number;
    description: string;
    isWarLogPublic: boolean;
    labels: APILabel[];
    location?: APILocation;
    memberList: APIClanMember[];
    members: number;
    name: string;
    requiredTownhallLevel?: number;
    requiredTrophies: number;
    requiredVersusTrophies?: number;
    tag: string;
    type: 'closed' | 'inviteOnly' | 'open';
    warFrequency: 'always' | 'lessThanOncePerWeek' | 'moreThanOncePerWeek' | 'never' | 'oncePerWeek' | 'unknown';
    warLeague?: APIWarLeague;
    warLosses?: number;
    warTies?: number;
    warWinStreak: number;
    warWins: number;
};

export type APIClanMember = {
	clanRank: number;
	donations: number;
	donationsReceived: number;
	expLevel: number;
	league: APILeague;
	name: string;
	previousClanRank: number;
	role: 'admin' | 'coLeader' | 'leader' | 'member';
	tag: string;
	trophies: number;
	versusTrophies?: number;
}

export type APIClanCapital = {
	capitalHallLevel?: number;
	districts?: { districtHallLevel: number, id: number; name: string; }[];
}

/**
 * /clans/{clanTag}/members
 */
export type APIClanMemberList = {
	items: APIClanMember[];
	paging: APIPaging;
}

/**
 * /clans/{clanTag}/currentwar and /clanwarleagues/wars/{warTag}
 */
export type APIClanWar = {
	/**
	 * This property is not available for CWL
	 */
	attacksPerMember?: number;
	clan: APIWarClan;
	endTime: string;
	opponent: APIWarClan;
	preparationStartTime: string;
	startTime: string;
	state: 'inWar' | 'notInWar' | 'preparation' | 'warEnded';
	teamSize: number;
}

export type APIWarClan = {
	attacks: number;
	badgeUrls: APIBadge;
	clanLevel: number;
	destructionPercentage: number;
	members: APIClanWarMember[];
	name: string;
	stars: number;
	tag: string;
}

export type APIClanWarMember = {
	attacks?: APIClanWarAttack[];
	bestOpponentAttack?: APIClanWarAttack;
	mapPosition: number;
	name: string;
	opponentAttacks: number;
	tag: string;
	townhallLevel: number;
}

export type APIClanWarAttack = {
	attackerTag: string;
	defenderTag: string;
	destructionPercentage: number;
	duration: number;
	order: number;
	stars: number;
}

export type APIWarLogClan = {
	attacks?: number;
	badgeUrls: APIBadge;
	clanLevel: number;
	destructionPercentage: number;
	expEarned?: number;
	name?: string;
	stars: number;
	tag?: string;
}

export type APIClanWarLogEntry = {
	attacksPerMember?: number;
	clan: APIWarLogClan;
	endTime: string;
	opponent: APIWarLogClan;
	result: 'lose' | 'tie' | 'win' | null;
	teamSize: number;
}

/**
 * /clans/{clanTag}/warlog
 */
export type APIClanWarLog = {
	items: APIClanWarLogEntry[];
	paging: APIPaging;
}

/**
 * /clans/{clanTag}/currentwar/leaguegroup
 */
export type APIClanWarLeagueGroup = {
	clans: APIClanWarLeagueClan[];
	rounds: APIClanWarLeagueRound[];
	season: string;
	state: 'ended' | 'inWar' | 'notInWar' | 'preparation';
}

export type APIClanWarLeagueClan = {
	badgeUrls: APIBadge;
	clanLevel: number;
	members: APIClanWarLeagueClanMember[];
	name: string;
	tag: string;
}

export type APIClanWarLeagueClanMember = {
	name: string;
	tag: string;
	townHallLevel: number;
}

export type APIClanWarLeagueRound = {
	warTags: string[];
}

// *************** PLAYERS *************** //

/**
 * /players/{playerTag}
 */
export type APIPlayer = {
	achievements: APIPlayerAchievement[];
	attackWins: number;
	bestTrophies: number;
	bestVersusTrophies?: number;
	builderHallLevel?: number;
	clan?: APIPlayerClan;
	clanCapitalContributions: number;
	defenseWins: number;
	donations: number;
	donationsReceived: number;
	expLevel: number;
	heroes: APIPlayerItem[];
	labels: APILabel[];
	league?: APILeague;
	legendStatistics?: APILegendStatistics;
	name: string;
	role?: string;
	spells: APIPlayerItem[];
	tag: string;
	townHallLevel: number;
	townHallWeaponLevel?: number;
	troops: APIPlayerItem[];
	trophies: number;
	versusBattleWinCount?: number;
	versusBattleWins?: number;
	versusTrophies?: number;
	warPreference?: 'in' | 'out';
	warStars: number;
}

export type APILegendStatistics = {
	bestSeason?: APISeason;
	bestVersusSeason?: APISeason;
	currentSeason?: APISeason;
	legendTrophies: number;
	previousSeason?: APISeason;
	previousVersusSeason?: APISeason;
}

export type APIPlayerClan = {
	badgeUrls: APIBadge;
	clanLevel: number;
	name: string;
	tag: string;
}

export type APIPlayerAchievement = {
	completionInfo: string | null;
	info: string;
	name: string;
	stars: number;
	target: number;
	value: number;
	village: 'builderBase' | 'home';
}

export type APIPlayerItem = {
	level: number;
	maxLevel: number;
	name: string;
	superTroopIsActive?: boolean;
	village: 'builderBase' | 'home';
}

/**
 * /players/{playerTag}/verifytoken
 */
export type APIVerifyToken = {
	status: 'invalid' | 'ok';
	tag: string;
	token: string;
}

// ************* LOCATIONS ************* //

/**
 * /locations
 */
export type APILocationList = {
	items: APILocation[];
	paging: APIPaging;
}

/**
 * /locations/{locationId}
 */
export type APILocation = {
	countryCode?: string;
	id: number;
	isCountry: boolean;
	localizedName?: string;
	name: string;
}

/**
 * /locations/{locationId}/rankings/clans
 */
export type APIClanRankingList = {
	items: APIClanRanking[];
	paging: APIPaging;
}

export type APIClanRanking = {
	badgeUrls: APIBadge;
	clanLevel: number;
	clanPoints: number;
	location: APILocation;
	members: number;
	name: string;
	previousRank: number;
	rank: number;
	tag: string;
}

/**
 * /locations/{locationId}/rankings/players
 */
export type APIPlayerRankingList = {
	items: APIPlayerRanking[];
	paging: APIPaging;
}

export type APIPlayerRanking = {
	attackWins: number;
	clan?: Omit<APIPlayerClan, 'clanLevel'>;
	defenseWins: number;
	expLevel: number;
	league: APILeague;
	name: string;
	previousRank: number;
	rank: number;
	tag: string;
	trophies: number;
}

/**
 * /locations/{locationId}/rankings/clans-versus
 */
export type APIClanVersusRankingList = {
	items: APIClanVersusRanking[];
	paging: APIPaging;
}

export type APIClanVersusRanking = {
	badgeUrls: APIBadge;
	clanLevel: number;
	clanVersusPoints: number;
	location: APILocation;
	members: number;
	name: string;
	previousRank: number;
	rank: number;
	tag: string;
}

/**
 * /locations/{locationId}/rankings/players-versus
 */
export type APIPlayerVersusRankingList = {
	items: APIPlayerVersusRanking[];
	paging: APIPaging;
}

export type APIPlayerVersusRanking = {
	clan?: APIPlayerClan;
	expLevel: number;
	name: string;
	previousRank: number;
	rank: number;
	tag: string;
	versusBattleWins: number;
	versusTrophies: number;
}

// *************** LEAGUES *************** //

/**
 * /leagues
 */
export type APILeagueList = {
	items: APILeague[];
	paging: APIPaging;
}

/**
 * /leagues/{leagueId}
 */
export type APILeague = {
	iconUrls: APIIcon;
	id: number;
	name: string;
}

/**
 * /leagues/{leagueId}/seasons/{seasonId}
 */
export type APIPlayerSeasonRankingList = {
	items: Omit<APIPlayerRanking, 'league'>[];
	paging: APIPaging;
}

/**
 * /leagues/{leagueId}/seasons
 */
export type APILeagueSeasonList = {
	items: {
		id: string;
	}[];
	paging: APIPaging;
}

/**
 * /warleagues
 */
export type APIWarLeagueList = {
	items: APIWarLeague[];
	paging: APIPaging;
}

/**
 * /warleagues/{leagueId}
 */
export type APIWarLeague = {
	id: number;
	name: string;
}

// ************** LABELS ************** //

export type APILabel = {
	iconUrls: APIIcon;
	id: number;
	name: string;
}

/**
 * /labels/clans and /labels/players
 */
export type APILabelList = {
	items: APILabel[];
	paging: APIPaging;
}

// *********** GOLD PASS *********** //

/**
 * /goldpass/seasons/current
 */
export type APIGoldPassSeason = {
	endTime: string;
	startTime: string;
}
