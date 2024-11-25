import RAW from '../util/raw.json';

export const APIBaseURL = 'https://api.clashofclans.com/v1';
export const DevSiteAPIBaseURL = 'https://developer.clashofclans.com/api';

export const ElixirTroops = [
	'Barbarian',
	'Archer',
	'Giant',
	'Goblin',
	'Wall Breaker',
	'Balloon',
	'Wizard',
	'Healer',
	'Dragon',
	'P.E.K.K.A',
	'Baby Dragon',
	'Miner',
	'Electro Dragon',
	'Yeti',
	'Dragon Rider',
	'Electro Titan',
	'Root Rider',
	'Thrower'
];

export const DarkElixirTroops = [
	'Minion',
	'Hog Rider',
	'Valkyrie',
	'Golem',
	'Witch',
	'Lava Hound',
	'Bowler',
	'Ice Golem',
	'Headhunter',
	'Apprentice Warden',
	'Druid'
];

export const HomeTroops = [...ElixirTroops, ...DarkElixirTroops];

export const SiegeMachines = [
	'Wall Wrecker',
	'Battle Blimp',
	'Stone Slammer',
	'Siege Barracks',
	'Log Launcher',
	'Flame Flinger',
	'Battle Drill'
];

export const SuperTroops = [
	'Super Barbarian',
	'Super Archer',
	'Super Giant',
	'Sneaky Goblin',
	'Super Wall Breaker',
	'Rocket Balloon',
	'Super Wizard',
	'Super Dragon',
	'Inferno Dragon',
	'Super Minion',
	'Super Valkyrie',
	'Super Witch',
	'Ice Hound',
	'Super Bowler',
	'Super Miner',
	'Super Hog Rider'
];

export const ElixirSpells = [
	'Lightning Spell',
	'Healing Spell',
	'Rage Spell',
	'Jump Spell',
	'Freeze Spell',
	'Clone Spell',
	'Invisibility Spell',
	'Recall Spell',
	'Revive Spell'
];

export const DarkElixirSpells = ['Poison Spell', 'Earthquake Spell', 'Haste Spell', 'Skeleton Spell', 'Bat Spell', 'Overgrowth Spell'];

export const Spells = [...ElixirSpells, ...DarkElixirSpells];

export const BuilderTroops = [
	'Raged Barbarian',
	'Sneaky Archer',
	'Boxer Giant',
	'Beta Minion',
	'Bomber',
	'Baby Dragon',
	'Cannon Cart',
	'Night Witch',
	'Drop Ship',
	'Super P.E.K.K.A',
	'Hog Glider',
	'Electrofire Wizard'
];

export const Heroes = ['Barbarian King', 'Archer Queen', 'Grand Warden', 'Royal Champion', 'Minion Prince', 'Battle Machine', 'Battle Copter'];

export const HeroPets = [
	'L.A.S.S.I',
	'Electro Owl',
	'Mighty Yak',
	'Unicorn',
	'Poison Lizard',
	'Diggy',
	'Frosty',
	'Phoenix',
	'Spirit Fox',
	'Angry Jelly'
];

export const UnrankedLeagueData = {
	id: 29000000,
	name: 'Unranked',
	iconUrls: {
		small: 'https://api-assets.clashofclans.com/leagues/72/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png',
		tiny: 'https://api-assets.clashofclans.com/leagues/36/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png'
	}
};

export const UnrankedLeagueId = 29000000;
export const LegendLeagueId = 29000022;
export const UnrankedWarLeagueId = 48000000;

export const Leagues = [
	29000000,
	29000001,
	29000002,
	29000003,
	29000004,
	29000005,
	29000006,
	29000007,
	29000008,
	29000009,
	29000010,
	29000011,
	29000012,
	29000013,
	29000014,
	29000015,
	29000016,
	29000017,
	29000018,
	29000019,
	29000020,
	29000021,
	LegendLeagueId
];

export const WarLeagues = [
	48000000, 48000001, 48000002, 48000003, 48000004, 48000005, 48000006, 48000007, 48000008, 48000009, 48000010, 48000011, 48000012,
	48000013, 48000014, 48000015, 48000016, 48000017, 48000018
];

export const FriendlyWarPreparationTimes = [
	1000 * 60 * 60 * 24,
	1000 * 60 * 60 * 20,
	1000 * 60 * 60 * 16,
	1000 * 60 * 60 * 12,
	1000 * 60 * 60 * 8,
	1000 * 60 * 60 * 6,
	1000 * 60 * 60 * 4,
	1000 * 60 * 60 * 2,
	1000 * 60 * 60,
	1000 * 60 * 30,
	1000 * 60 * 15,
	1000 * 60 * 5
] as const;

export const PollingEvents = {
	ClanLoopStart: 'clanLoopStart',
	ClanLoopEnd: 'clanLoopEnd',
	PlayerLoopStart: 'playerLoopStart',
	PlayerLoopEnd: 'playerLoopEnd',
	WarLoopStart: 'warLoopStart',
	WarLoopEnd: 'warLoopEnd',
	NewSeasonStart: 'newSeasonStart',
	MaintenanceStart: 'maintenanceStart',
	MaintenanceEnd: 'maintenanceEnd',
	Error: 'error',
	Debug: 'debug'
} as const;

export const ClientEvents = {
	Error: 'error',
	Debug: 'debug'
} as const;

export const RestEvents = {
	Error: 'error',
	Debug: 'debug',
	RateLimited: 'rateLimited'
} as const;

export const CWLRounds = {
	PreviousRound: 'warEnded',
	CurrentRound: 'inWar',
	NextRound: 'preparation'
} as const;

export const RawData = {
	RawUnits: RAW.RAW_UNITS,
	RawSuperUnits: RAW.RAW_SUPER_UNITS
};
