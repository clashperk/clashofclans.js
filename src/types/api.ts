export interface APIPaging {
	cursors?: APICursors;
}

export interface APICursors {
	after?: string;
	before?: string;
}

export interface APIIcon {
	small: string;

	/** Tiny Icon is not available for Labels. */
	tiny?: string;

	/** Medium Icon is not available for Unranked Icon. */
	medium?: string;
}

export interface APIBadge {
	small: string;
	large: string;
	medium: string;
}

export interface APISeason {
	id: string;
	rank: number;
	trophies: number;
}

// **************** CLANS **************** //

/** /clans?name={name}&limit={limit} */
export interface APIClanList {
	items: Omit<APIClan, 'memberList' | 'clanCapital'>[];
	paging: APIPaging;
}

export interface APIChatLanguage {
	name: string;
	id: number;
	languageCode: string;
}

/** /clans/{clanTag} */
export interface APIClan {
	tag: string;
	name: string;
	type: 'open' | 'inviteOnly' | 'closed';
	description: string;
	location?: APILocation;
	chatLanguage?: APIChatLanguage;
	badgeUrls: APIBadge;
	clanLevel: number;
	clanPoints: number;
	clanBuilderBasePoints: number;
	requiredTrophies: number;
	requiredTownhallLevel?: number;
	requiredBuilderBaseTrophies?: number;
	warFrequency: 'always' | 'moreThanOncePerWeek' | 'oncePerWeek' | 'lessThanOncePerWeek' | 'never' | 'unknown';
	warWinStreak: number;
	warWins: number;
	warTies?: number;
	warLosses?: number;
	isWarLogPublic: boolean;
	warLeague?: APIWarLeague;
	members: number;
	labels: APILabel[];
	memberList: APIClanMember[];
	clanCapital: APIClanCapital;
	isFamilyFriendly: boolean;
	clanCapitalPoints: number;
	capitalLeague?: APICapitalLeague;
}

export interface APIClanMember {
	name: string;
	tag: string;
	role: 'member' | 'admin' | 'coLeader' | 'leader';
	expLevel: number;
	league: APILeague;
	trophies: number;
	builderBaseTrophies?: number;
	clanRank: number;
	previousClanRank: number;
	donations: number;
	donationsReceived: number;
	playerHouse?: APIPlayerHouse;
}

export interface APIPlayerHouse {
	elements: {
		type: string;
		id: number;
	}[];
}

export interface APIClanCapital {
	capitalHallLevel?: number;
	districts?: { id: number; name: string; districtHallLevel: number }[];
}

/** /clans/{clanTag}/members */
export interface APIClanMemberList {
	items: APIClanMember[];
	paging: APIPaging;
}

/** /clans/{clanTag}/currentwar and /clanwarleagues/wars/{warTag} */
export interface APIClanWar {
	state: 'notInWar' | 'preparation' | 'inWar' | 'warEnded';
	teamSize: number;
	startTime: string;
	preparationStartTime: string;
	endTime: string;
	clan: APIWarClan;
	opponent: APIWarClan;
	/** This property is not available for CWL */
	attacksPerMember?: number;
}

export interface APIWarClan {
	tag: string;
	name: string;
	badgeUrls: APIBadge;
	clanLevel: number;
	attacks: number;
	stars: number;
	destructionPercentage: number;
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

export interface APIWarLogClan {
	tag?: string;
	name?: string;
	badgeUrls: APIBadge;
	clanLevel: number;
	attacks?: number;
	stars: number;
	destructionPercentage: number;
	expEarned?: number;
}

export interface APIClanWarLogEntry {
	result: 'win' | 'lose' | 'tie' | null;
	endTime: string;
	teamSize: number;
	attacksPerMember?: number;
	clan: APIWarLogClan;
	opponent: APIWarLogClan;
}

/** /clans/{clanTag}/warlog */
export interface APIClanWarLog {
	items: APIClanWarLogEntry[];
	paging: APIPaging;
}

/** /clans/{clanTag}/currentwar/leaguegroup */
export interface APIClanWarLeagueGroup {
	state: 'notInWar' | 'preparation' | 'inWar' | 'ended';
	season: string;
	clans: APIClanWarLeagueClan[];
	rounds: APIClanWarLeagueRound[];
}

export interface APIClanWarLeagueClan {
	name: string;
	tag: string;
	clanLevel: number;
	badgeUrls: APIBadge;
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

export interface APICapitalRaidSeason {
	state: 'ongoing' | 'ended';
	startTime: string;
	endTime: string;
	capitalTotalLoot: number;
	raidsCompleted: number;
	totalAttacks: number;
	enemyDistrictsDestroyed: number;
	offensiveReward: number;
	defensiveReward: number;
	members?: APICapitalRaidSeasonMember[];
	attackLog: APICapitalRaidSeasonAttackLog[];
	defenseLog: APICapitalRaidSeasonDefenseLog[];
}

export interface APICapitalRaidSeasonMember {
	tag: string;
	name: string;
	attacks: number;
	attackLimit: number;
	bonusAttackLimit: number;
	capitalResourcesLooted: number;
}

export interface APICapitalRaidSeasonClan {
	tag: string;
	name: string;
	level: number;
	badgeUrls: {
		small: string;
		large: string;
		medium: string;
	};
}

export interface APICapitalRaidSeasonDistrict {
	id: number;
	name: string;
	districtHallLevel: number;
	destructionPercent: number;
	attackCount: number;
	totalLooted: number;
}

export interface APICapitalRaidSeasonAttackLog {
	defender: APICapitalRaidSeasonClan;
	attackCount: number;
	districtCount: number;
	districtsDestroyed: number;
	districts: APICapitalRaidSeasonDistrict[];
}

export interface APICapitalRaidSeasonDefenseLog {
	attacker: APICapitalRaidSeasonClan;
	attackCount: number;
	districtCount: number;
	districtsDestroyed: number;
	districts: APICapitalRaidSeasonDistrict[];
}

export interface APICapitalRaidSeasons {
	items: APICapitalRaidSeason[];
	paging: APIPaging;
}

// *************** PLAYERS *************** //

/** /players/{playerTag} */
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
	builderBaseTrophies?: number;
	bestBuilderBaseTrophies?: number;
	versusBattleWins?: number;
	donations: number;
	donationsReceived: number;
	clanCapitalContributions: number;
	role?: string;
	warPreference?: 'in' | 'out';
	clan?: APIPlayerClan;
	league?: APILeague;
	builderBaseLeague?: {
		id: number;
		name: string;
	};
	legendStatistics?: APILegendStatistics;
	achievements: APIPlayerAchievement[];
	troops: APIPlayerItem[];
	heroes: APIPlayerItem[];
	spells: APIPlayerItem[];
	labels: APILabel[];
	playerHouse?: APIPlayerHouse;
}

export interface APILegendStatistics {
	previousSeason?: APISeason;
	previousBuilderBaseSeason?: APISeason;
	bestBuilderBaseSeason?: APISeason;
	currentSeason?: APISeason;
	bestSeason?: APISeason;
	legendTrophies: number;
}

export interface APIPlayerClan {
	tag: string;
	name: string;
	clanLevel: number;
	badgeUrls: APIBadge;
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

/** /players/{playerTag}/verifytoken */
export interface APIVerifyToken {
	tag: string;
	token: string;
	status: 'ok' | 'invalid';
}

// ************* LOCATIONS ************* //

/** /locations */
export interface APILocationList {
	items: APILocation[];
	paging: APIPaging;
}

/** /locations/{locationId} */
export interface APILocation {
	localizedName?: string;
	id: number;
	name: string;
	isCountry: boolean;
	countryCode?: string;
}

/** /locations/{locationId}/rankings/clans */
export interface APIClanRankingList {
	items: APIClanRanking[];
	paging: APIPaging;
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
	badgeUrls: APIBadge;
}

/** /locations/{locationId}/rankings/players */
export interface APIPlayerRankingList {
	items: APIPlayerRanking[];
	paging: APIPaging;
}

export interface APIPlayerRanking {
	tag: string;
	name: string;
	expLevel: number;
	trophies: number;
	attackWins: number;
	defenseWins: number;
	rank: number;
	previousRank: number;
	clan?: Omit<APIPlayerClan, 'clanLevel'>;
	league: APILeague;
}

/** /locations/{locationId}/rankings/clans-builder-base */
export interface APIClanBuilderBaseRankingList {
	items: APIClanBuilderBaseRanking[];
	paging: APIPaging;
}

export interface APIClanBuilderBaseRanking {
	clanLevel: number;
	location: APILocation;
	members: number;
	tag: string;
	name: string;
	rank: number;
	previousRank: number;
	badgeUrls: APIBadge;
	clanBuilderBasePoints: number;
}

/** /locations/{locationId}/rankings/players-builder-base */
export interface APIPlayerBuilderBaseRankingList {
	items: APIPlayerBuilderBaseRanking[];
	paging: APIPaging;
}

export interface APIPlayerBuilderBaseRanking {
	tag: string;
	name: string;
	expLevel: number;
	builderBaseTrophies: number;
	versusBattleWins: number;
	rank: number;
	previousRank: number;
	clan?: APIPlayerClan;
	builderBaseLeague?: {
		id: number;
		name: string;
	};
}

export interface APIClanCapitalRanking {
	clanLevel: number;
	clanPoints: number;
	location: APILocation;
	members: number;
	tag: string;
	name: string;
	rank: number;
	previousRank: number;
	badgeUrls: APIBadge;
	clanCapitalPoints: number;
}

export interface APIClanCapitalRankingList {
	items: APIClanCapitalRanking[];
	paging: APIPaging;
}

// *************** LEAGUES *************** //

/** /leagues */
export interface APILeagueList {
	items: APILeague[];
	paging: APIPaging;
}

export interface APIBuilderBaseLeagueList {
	items: APIBuilderBaseLeague[];
	paging: APIPaging;
}

export interface APIBuilderBaseLeague {
	id: number;
	name: string;
}

/** /leagues/{leagueId} */
export interface APILeague {
	id: number;
	name: string;
	iconUrls: APIIcon;
}

/** /leagues/{leagueId}/seasons/{seasonId} */
export interface APIPlayerSeasonRankingList {
	items: Omit<APIPlayerRanking, 'league'>[];
	paging: APIPaging;
}

/** /leagues/{leagueId}/seasons */
export interface APILeagueSeasonList {
	items: {
		id: string;
	}[];
	paging: APIPaging;
}

/** /warleagues */
export interface APIWarLeagueList {
	items: APIWarLeague[];
	paging: APIPaging;
}

/** /warleagues/{leagueId} */
export interface APIWarLeague {
	id: number;
	name: string;
}

export interface APICapitalLeague {
	id: number;
	name: string;
}

export interface APICapitalLeagueList {
	items: APICapitalLeague[];
	paging: APIPaging;
}

// ************** LABELS ************** //

export interface APILabel {
	id: number;
	name: string;
	iconUrls: APIIcon;
}

/** /labels/clans and /labels/players */
export interface APILabelList {
	items: APILabel[];
	paging: APIPaging;
}

// *********** GOLD PASS *********** //

/** /goldpass/seasons/current */
export interface APIGoldPassSeason {
	startTime: string;
	endTime: string;
}
