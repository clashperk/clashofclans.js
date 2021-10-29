export const API_BASE_URL = 'https://api.clashofclans.com/v1';

export const DEV_SITE_API_BASE_URL = 'https://developer.clashofclans.com/api';

export const ELIXIR_TROOPS = [
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
	'Dragon Rider'
];

export const DARK_ELIXIR_TROOPS = ['Minion', 'Hog Rider', 'Valkyrie', 'Golem', 'Witch', 'Lava Hound', 'Bowler', 'Ice Golem', 'Headhunter'];

export const HOME_TROOPS = [...ELIXIR_TROOPS, ...DARK_ELIXIR_TROOPS];

export const SIEGE_MACHINES = ['Wall Wrecker', 'Battle Blimp', 'Stone Slammer', 'Siege Barracks', 'Log Launcher'];

export const SUPER_TROOPS = [
	'Super Barbarian',
	'Super Archer',
	'Super Giant',
	'Sneaky Goblin',
	'Super Wall Breaker',
	'Rocket Balloon',
	'Super Wizard',
	'Inferno Dragon',
	'Super Minion',
	'Super Valkyrie',
	'Super Witch',
	'Ice Hound',
	'Super Bowler'
];

export const ELIXIR_SPELLS = [
	'Lightning Spell',
	'Healing Spell',
	'Rage Spell',
	'Jump Spell',
	'Freeze Spell',
	'Clone Spell',
	'Invisibility Spell'
];

export const DARK_ELIXIR_SPELLS = ['Poison Spell', 'Earthquake Spell', 'Haste Spell', 'Skeleton Spell', 'Bat Spell'];

export const SPELLS = [...ELIXIR_SPELLS, ...DARK_ELIXIR_SPELLS];

export const HEROES = ['Barbarian King', 'Archer Queen', 'Grand Warden', 'Royal Champion', 'Battle Machine'];

export const HERO_PETS = ['L.A.S.S.I', 'Electro Owl', 'Mighty Yak', 'Unicorn'];

export const UNRANKED_LEAGUE_DATA = {
	id: 29000000,
	name: 'Unranked',
	iconUrls: {
		small: 'https://api-assets.clashofclans.com/leagues/72/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png',
		tiny: 'https://api-assets.clashofclans.com/leagues/36/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png'
	}
};

export const LEGEND_LEAGUE_ID = 29000022;

export const LEAGUES = [
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
	LEGEND_LEAGUE_ID
];

export const WAR_LEAGUES = [
	48000000, 48000001, 48000002, 48000003, 48000004, 48000005, 48000006, 48000007, 48000008, 48000009, 48000010, 48000011, 48000012,
	48000013, 48000014, 48000015, 48000016, 48000017, 48000018
];

export const FRIENDLY_WAR_PREPARATION_TIMES = [
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

export const EVENTS = {
	NEW_SEASON_START: 'newSeasonStart',
	CLAN_LOOP_START: 'clanLoopStart',
	CLAN_LOOP_END: 'clanLoopEnd',
	PLAYER_LOOP_START: 'playerLoopStart',
	PLAYER_LOOP_END: 'playerLoopEnd',
	WAR_LOOP_START: 'warLoopEnd',
	WAR_LOOP_END: 'warLoopEnd',
	MAINTENANCE_START: 'maintenanceStart',
	MAINTENANCE_END: 'maintenanceEnd',
	ERROR: 'error'
} as const;
