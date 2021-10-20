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

export const SPELLS = [...ELIXIR_SPELLS, DARK_ELIXIR_SPELLS];

export const HEROES = ['Barbarian King', 'Archer Queen', 'Grand Warden', 'Royal Champion', 'Battle Machine'];

export const HERO_PETS = ['L.A.S.S.I', 'Electro Owl', 'Mighty Yak', 'Unicorn'];

export const ACHIEVEMENTS = [
	// Home Base
	'Keep Your Account Safe!',
	'Bigger & Better',
	'Discover New Troops',
	'Bigger Coffers',
	'Gold Grab',
	'Elixir Escapade',
	'Heroic Heist',
	'Well Seasoned',
	'Nice and Tidy',
	'Empire Builder',
	'Clan War Wealth',
	'Friend in Need',
	'Sharing is caring',
	'Siege Sharer',
	'War Hero',
	'War League Legend',
	'Games Champion',
	'Unbreakable',
	'Sweet Victory!',
	'Conqueror',
	'League All-Star',
	'Humiliator',
	'Not So Easy This Time',
	'Union Buster',
	'Bust This!',
	'Wall Buster',
	'Mortar Mauler',
	'X-Bow Exterminator',
	'Firefighter',
	'Anti-Artillery',
	'Shattered and Scattered',
	'Get those Goblins!',
	'Get those other Goblins!',
	'Dragon Slayer',
	'Superb Work',

	// Builder Base
	'Master Engineering',
	'Hidden Treasures',
	'High Gear',
	'Next Generation Model',
	'Un-Build It',
	'Champion Builder'
];

export const UNRANKED_LEAGUE_DATA = {
	id: 29000000,
	name: 'Unranked',
	iconUrls: {
		small: 'https://api-assets.clashofclans.com/leagues/72/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png',
		tiny: 'https://api-assets.clashofclans.com/leagues/36/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png'
	}
};

export const LEAGUES = [
	29000000, 29000001, 29000002, 29000003, 29000004, 29000005, 29000006, 29000007, 29000008, 29000009, 29000010, 29000011, 29000012,
	29000013, 29000014, 29000015, 29000016, 29000017, 29000018, 29000019, 29000020, 29000021, 29000022
];

export const WAR_LEAGUES = [
	48000000, 48000001, 48000002, 48000003, 48000004, 48000005, 48000006, 48000007, 48000008, 48000009, 48000010, 48000011, 48000012,
	48000013, 48000014, 48000015, 48000016, 48000017, 48000018
];
