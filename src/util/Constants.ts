import RAW from '../util/raw.json';

export const APIBaseURL = 'https://api.clashofclans.com/v1';
export const DevSiteAPIBaseURL = 'https://developer.clashofclans.com/api';

export const SuperTroops = RAW.RAW_SUPER_UNITS.map((unit) => unit.name);

export const ElixirTroops = RAW.RAW_UNITS.filter(
	(unit) => !SuperTroops.includes(unit.name) && unit.subCategory === 'troop' && unit.upgrade.resource === 'Elixir'
).map((unit) => unit.name);

export const DarkElixirTroops = RAW.RAW_UNITS.filter(
	(unit) => !SuperTroops.includes(unit.name) && unit.subCategory === 'troop' && unit.upgrade.resource === 'Dark Elixir'
).map((unit) => unit.name);

export const HomeTroops = [...ElixirTroops, ...DarkElixirTroops];

export const SiegeMachines = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'siege').map((unit) => unit.name);

export const HeroEquipment = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'equipment').map((unit) => unit.name);

export const ElixirSpells = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'spell' && unit.upgrade.resource === 'Elixir').map(
	(unit) => unit.name
);

export const DarkElixirSpells = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'spell' && unit.upgrade.resource === 'Dark Elixir').map(
	(unit) => unit.name
);

export const Spells = [...ElixirSpells, ...DarkElixirSpells];

export const BuilderTroops = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'troop' && unit.village === 'builderBase').map(
	(unit) => unit.name
);

export const Heroes = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'hero').map((unit) => unit.name);

export const HeroPets = RAW.RAW_UNITS.filter((unit) => unit.subCategory === 'pet').map((unit) => unit.name);

export const UnrankedLeagueData = {
	id: 105000000,
	name: 'Unranked',
	iconUrls: {
		small: 'https://api-assets.clashofclans.com/leaguetiers/125/yyYo5DUFeFBZvmMEQh0ZxvG-1sUOZ_S3kDMB7RllXX0.png',
		large: 'https://api-assets.clashofclans.com/leaguetiers/326/yyYo5DUFeFBZvmMEQh0ZxvG-1sUOZ_S3kDMB7RllXX0.png'
	}
};

export const UnrankedLeagueId = 105000000;
export const LegendLeagueId = 105000034;
export const UnrankedWarLeagueId = 48000000;

export const Leagues = [
	105000000, 105000001, 105000002, 105000003, 105000004, 105000005, 105000006, 105000007, 105000008, 105000009, 105000010, 105000011,
	105000012, 105000013, 105000014, 105000015, 105000016, 105000017, 105000018, 105000019, 105000020, 105000021, 105000022, 105000023,
	105000024, 105000025, 105000026, 105000027, 105000028, 105000029, 105000030, 105000031, 105000032, 105000033, 105000034
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
