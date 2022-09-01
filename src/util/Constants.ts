import RAW from './raw.json';

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
    'Dragon Rider'
];

export const DarkElixirTroops = ['Minion', 'Hog Rider', 'Valkyrie', 'Golem', 'Witch', 'Lava Hound', 'Bowler', 'Ice Golem', 'Headhunter'];

export const HomeTroops = [...ElixirTroops, ...DarkElixirTroops];

export const SiegeMachines = ['Wall Wrecker', 'Battle Blimp', 'Stone Slammer', 'Siege Barracks', 'Log Launcher', 'Flame Flinger'];

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
    'Super Bowler'
];

export const ElixirSpells = [
    'Lightning Spell',
    'Healing Spell',
    'Rage Spell',
    'Jump Spell',
    'Freeze Spell',
    'Clone Spell',
    'Invisibility Spell'
];

export const DarkElixirSpells = ['Poison Spell', 'Earthquake Spell', 'Haste Spell', 'Skeleton Spell', 'Bat Spell'];

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
    'Hog Glider'
];

export const Heroes = ['Barbarian King', 'Archer Queen', 'Grand Warden', 'Royal Champion', 'Battle Machine'];

export const HeroPets = ['L.A.S.S.I', 'Electro Owl', 'Mighty Yak', 'Unicorn'];

export const UnrankedLeagueData = {
    id: 29_000_000,
    name: 'Unranked',
    iconUrls: {
        small: 'https://api-assets.clashofclans.com/leagues/72/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png',
        tiny: 'https://api-assets.clashofclans.com/leagues/36/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png'
    }
};

export const LegendLeagueId = 29_000_022;

export const Leagues = [
    29_000_000,
    29_000_001,
    29_000_002,
    29_000_003,
    29_000_004,
    29_000_005,
    29_000_006,
    29_000_007,
    29_000_008,
    29_000_009,
    29_000_010,
    29_000_011,
    29_000_012,
    29_000_013,
    29_000_014,
    29_000_015,
    29_000_016,
    29_000_017,
    29_000_018,
    29_000_019,
    29_000_020,
    29_000_021,
    LegendLeagueId
];

export const WarLeagues = [
    48_000_000, 48_000_001, 48_000_002, 48_000_003, 48_000_004, 48_000_005, 48_000_006, 48_000_007, 48_000_008, 48_000_009, 48_000_010,
    48_000_011, 48_000_012, 48_000_013, 48_000_014, 48_000_015, 48_000_016, 48_000_017, 48_000_018
];

export const FriendlyWarPreparationTimes = [
    1_000 * 60 * 60 * 24,
    1_000 * 60 * 60 * 20,
    1_000 * 60 * 60 * 16,
    1_000 * 60 * 60 * 12,
    1_000 * 60 * 60 * 8,
    1_000 * 60 * 60 * 6,
    1_000 * 60 * 60 * 4,
    1_000 * 60 * 60 * 2,
    1_000 * 60 * 60,
    1_000 * 60 * 30,
    1_000 * 60 * 15,
    1_000 * 60 * 5
] as const;

export const PollingEvents = {
    NewSeasonStart: 'newSeasonStart',
    ClanLoopStart: 'clanLoopStart',
    ClanLoopEnd: 'clanLoopEnd',
    PlayerLoopStart: 'playerLoopStart',
    PlayerLoopEnd: 'playerLoopEnd',
    WarLoopStart: 'warLoopEnd',
    WarLoopEnd: 'warLoopEnd',
    MaintenanceStart: 'maintenanceStart',
    MaintenanceEnd: 'maintenanceEnd',
    Error: 'error',
    Debug: 'debug'
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
