export type APIWarState = 'notInWar' | 'preparation' | 'inWar' | 'warEnded';
export type APIRole = 'member' | 'admin' | 'coLeader' | 'leader';

export interface APIPaging {
	cursors?: APICursors;
}

export interface APICursors {
	after?: string;
	before?: string;
}

export interface APIIcon {
	small: string;
	tiny: string;
	medium: string;
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
	items: Omit<APIClan, 'memberList'>[];
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
	type: string;
	description: string;
	location?: APILocation;
	chatLanguage?: APIChatLanguage;
	badgeUrls: APIBadge;
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
	warLeague?: APIWarLeague;
	members: number;
	labels: APILabel[];
	memberList: APIClanMember[];
}

export interface APIClanMember {
	name: string;
	tag: string;
	role: APIRole;
	expLevel: number;
	league: APILeague;
	trophies: number;
	versusTrophies: number;
	clanRank: number;
	previousClanRank: number;
	donations: number;
	donationsReceived: number;
}

/** /clans/{clanTag}/members */
export interface APIClanMemberList {
	items: APIClanMember[];
	paging: APIPaging;
}

/** /clans/{clanTag}/currentwar and /clanwarleagues/wars/{warTag} */
export interface APIClanWar {
	state: APIWarState;
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
	badgeUrls: APIBadge;
	clanLevel: number;
	attacks: number;
	stars: number;
	destructionPercentage: number;
	members: APIClanWarMember[];
	/** This property is only available for war log entry. */
	expEarned?: number;
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

export interface APIClanWarLogEntry {
	result: 'win' | 'lose' | 'tie' | null;
	endTime: string;
	teamSize: number;
	attacksPerMember?: number;
	clan: Omit<APIWarClan, 'members'>;
	opponent: Omit<APIWarClan, 'members' | 'attacks' | 'expEarned'>;
}

/** /clans/{clanTag}/warlog */
export interface APIClanWarLog {
	items: APIClanWarLogEntry[];
	paging: APIPaging;
}

/** /clans/{clanTag}/currentwar/leaguegroup */
export interface APIClanWarLeagueGroup {
	state: APIWarState;
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
	versusTrophies?: number;
	bestVersusTrophies?: number;
	versusBattleWins?: number;
	donations: number;
	donationsReceived: number;
	role?: string;
	warPreference?: 'in' | 'out';
	clan?: APIPlayerClan;
	league?: APILeague;
	legendStatistics?: APILegendStatistics;
	achievements: APIPlayerAchievement[];
	troops: APIPlayerItem[];
	heroes: APIPlayerItem[];
	spells: APIPlayerItem[];
	labels: APILabel[];
}

export interface APILegendStatistics {
	previousSeason?: APISeason;
	previousVersusSeason?: APISeason;
	bestVersusSeason?: APISeason;
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

/** /locations/{loacationId} */
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
	clan: APIPlayerClan;
	league: APILeague;
}

/** /locations/{locationId}/rankings/clans-versus */
export interface APIClanVersusRankingList {
	items: APIClanVersusRanking[];
	paging: APIPaging;
}

export interface APIClanVersusRanking {
	clanLevel: number;
	location: APILocation;
	members: number;
	tag: string;
	name: string;
	rank: number;
	previousRank: number;
	badgeUrls: APIBadge;
	clanVersusPoints: number;
}

/** /locations/{locationId}/rankings/players-versus */
export interface APIPlayerVersusRankingList {
	items: APIPlayerVersusRanking[];
	paging: APIPaging;
}

export interface APIPlayerVersusRanking {
	tag: string;
	name: string;
	expLevel: number;
	versusTrophies: number;
	versusBattleWins: number;
	rank: number;
	clan: APIPlayerClan;
}

// *************** LEAGUES *************** //

/** /leagues */
export interface APILeagueList {
	items: APILeague[];
	paging: APIPaging;
}

/** /leagues/{leagueId} */
export interface APILeague {
	id: string;
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
	id: string;
	name: string;
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
