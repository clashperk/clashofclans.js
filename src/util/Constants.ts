import RAW from '../util/raw.json';

export const API_BASE_URL = 'https://api.clashofclans.com/v1';
export const DEV_SITE_API_BASE_URL = 'https://developer.clashofclans.com/api';

export const SUPER_TROOPS = RAW.RAW_SUPER_UNITS.map((unit) => unit.name);

export const ELIXIR_TROOPS = RAW.RAW_UNITS.filter(
	(unit) => !SUPER_TROOPS.includes(unit.name) && unit.subCategory === 'troop' && unit.upgrade.resource === 'Elixir'
).map((unit) => unit.name);

export const DARK_ELIXIR_TROOPS = RAW.RAW_UNITS.filter(
	(unit) => !SUPER_TROOPS.includes(unit.name) && unit.subCategory === 'troop' && unit.upgrade.resource === 'Dark Elixir'
).map((unit) => unit.name);

export const HOME_TROOPS = [...ELIXIR_TROOPS, ...DARK_ELIXIR_TROOPS];

export const SIEGE_MACHINES = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'siege').map((unit) => unit.name);

export const HERO_EQUIPMENT = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'equipment').map((unit) => unit.name);

export const ELIXIR_SPELLS = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'spell' && unit.upgrade.resource === 'Elixir').map(
	(unit) => unit.name
);

export const DARK_ELIXIR_SPELLS = RAW.RAW_UNITS.filter(
	(unit) => unit.subCategory === 'spell' && unit.upgrade.resource === 'Dark Elixir'
).map((unit) => unit.name);

export const SPELLS = [...ELIXIR_SPELLS, ...DARK_ELIXIR_SPELLS];

export const BUILDER_TROOPS = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'troop' && unit.village === 'builderBase').map(
	(unit) => unit.name
);

export const HEROES = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'hero').map((unit) => unit.name);

export const HERO_PETS = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'pet').map((unit) => unit.name);

export const UNRANKED_LEAGUE_DATA = {
	id: 105000000,
	name: 'Unranked',
	iconUrls: {
		small: 'https://api-assets.clashofclans.com/leaguetiers/125/yyYo5DUFeFBZvmMEQh0ZxvG-1sUOZ_S3kDMB7RllXX0.png',
		large: 'https://api-assets.clashofclans.com/leaguetiers/326/yyYo5DUFeFBZvmMEQh0ZxvG-1sUOZ_S3kDMB7RllXX0.png'
	}
};

export const UNRANKED_LEAGUE_ID = 105000000;
export const LEGEND_LEAGUE_ID = 105000034;
export const UNRANKED_WAR_LEAGUE_ID = 48000000;

export const LEAGUES = [
	105000000, 105000001, 105000002, 105000003, 105000004, 105000005, 105000006, 105000007, 105000008, 105000009, 105000010, 105000011,
	105000012, 105000013, 105000014, 105000015, 105000016, 105000017, 105000018, 105000019, 105000020, 105000021, 105000022, 105000023,
	105000024, 105000025, 105000026, 105000027, 105000028, 105000029, 105000030, 105000031, 105000032, 105000033, 105000034
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

export const POLLING_EVENTS = {
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

export const CLIENT_EVENTS = {
	Error: 'error',
	Debug: 'debug'
} as const;

export const REST_EVENTS = {
	Error: 'error',
	Debug: 'debug',
	RateLimited: 'rateLimited'
} as const;

export const CWL_ROUNDS = {
	PreviousRound: 'warEnded',
	CurrentRound: 'inWar',
	NextRound: 'preparation'
} as const;

export const RAW_DATA = {
	RawUnits: RAW.RAW_UNITS,
	RawSuperUnits: RAW.RAW_SUPER_UNITS
};
