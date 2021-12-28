import { HERO_PETS, SIEGE_MACHINES, UNRANKED_LEAGUE_DATA, SUPER_TROOPS, BUILDER_TROOPS, HOME_TROOPS } from '../util/Constants';
import { APIPlayer, OverrideOptions } from '../types';
import { LegendStatistics } from './LegendStatistics';
import { Achievement } from './Achievement';
import { Hero, Spell, Troop } from './Unit';
import { PlayerClan } from './PlayerClan';
import { Client } from '../client/Client';
import { League } from './League';
import { Label } from './Label';

/** Represents a Clash of Clans Player. */
export class Player {
	/** The player's name. */
	public name: string;

	/** The player's tag. */
	public tag: string;

	/** The player's Town Hall level.. */
	public townHallLevel: number;

	/** The player's Town Hall weapon level. */
	public townHallWeaponLevel: number | null;

	/** The player's experience level. */
	public expLevel: number;

	/** The player's trophy count. */
	public trophies: number;

	/** The player's best trophies. */
	public bestTrophies: number;

	/** The player's war stars. */
	public warStars: number;

	/** The number of attacks the player has won this season. */
	public attackWins: number;

	/** The number of defenses the player has won this season. */
	public defenseWins: number;

	/** The player's builder hall level, or 0 if it hasn't been unlocked. */
	public builderHallLevel: number | null;

	/** The player's versus trophy count. */
	public versusTrophies: number | null;

	/** The player's best versus trophies. */
	public bestVersusTrophies: number | null;

	/** The number of total versus attacks the player has won. */
	public versusBattleWins: number | null;

	/** The player's donation count for this season. */
	public donations: number;

	/** The player's donation received count for this season. */
	public received: number;

	/** The player's role in the clan or `null` if not in a clan. */
	public role: 'member' | 'elder' | 'coLeader' | 'leader' | null;

	/** Whether the player has selected that they are opted in. This will be `null` if the player is not in a clan. */
	public warOptedIn: boolean | null;

	/** The player's clan. */
	public clan: PlayerClan | null;

	/** The player's current League. */
	public league: League;

	/** The player's legend statistics, or `null` if they have never been in the legend league. */
	public legendStatistics: LegendStatistics | null;

	/** An array of the player's achievements. */
	public achievements: Achievement[];

	/** An array of player's labels. */
	public labels: Label[];

	/** An array of player's troops (including pets and seige machines). */
	public troops: Troop[];

	/** An array of player's spells. */
	public spells: Spell[];

	/** An array of player's heroes (both home base and build base). */
	public heroes: Hero[];

	public constructor(public client: Client, data: APIPlayer) {
		this.name = data.name;
		this.tag = data.tag;
		this.townHallLevel = data.townHallLevel;
		this.townHallWeaponLevel = data.townHallWeaponLevel ?? null;
		this.expLevel = data.expLevel;
		this.trophies = data.trophies;
		this.bestTrophies = data.bestTrophies;
		this.warStars = data.warStars;
		this.attackWins = data.attackWins;
		this.defenseWins = data.defenseWins;
		this.builderHallLevel = data.builderHallLevel ?? null;
		this.versusTrophies = data.versusTrophies ?? null;
		this.bestVersusTrophies = data.bestVersusTrophies ?? null;
		this.versusBattleWins = data.versusBattleWins ?? null;
		this.donations = data.donations;
		this.received = data.donationsReceived;
		// @ts-expect-error
		this.role = data.role?.replace('admin', 'elder') ?? null;
		this.warOptedIn = data.warPreference ? data.warPreference === 'in' : null;
		this.clan = data.clan ? new PlayerClan(client, data.clan) : null;
		this.league = new League(data.league ?? UNRANKED_LEAGUE_DATA);
		this.legendStatistics = data.legendStatistics ? new LegendStatistics(data.legendStatistics) : null;
		this.achievements = data.achievements.map((data) => new Achievement(data));
		this.labels = data.labels.map((data) => new Label(data));

		this.troops = data.troops.map((unit) => new Troop(data, unit));
		this.spells = data.spells.map((unit) => new Spell(data, unit));
		this.heroes = data.heroes.map((unit) => new Hero(data, unit));
	}

	/** Fetch detailed clan info for the player's clan. */
	public async fetchClan(options?: OverrideOptions) {
		if (!this.clan) return null;
		return this.client.getClan(this.clan.tag, options);
	}

	/** An array of the player's home base troops. */
	public get homeTroops() {
		return this.troops
			.filter((entry) => HOME_TROOPS.includes(entry.name))
			.sort((a, b) => HOME_TROOPS.indexOf(a.name) - HOME_TROOPS.indexOf(b.name));
	}

	/** An array of the player's builder base troops. */
	public get builderTroops() {
		return this.troops
			.filter((entry) => BUILDER_TROOPS.includes(entry.name))
			.sort((a, b) => BUILDER_TROOPS.indexOf(a.name) - BUILDER_TROOPS.indexOf(b.name));
	}

	/** An array of the player's super troops. */
	public get superTroops() {
		return this.troops
			.filter((entry) => SUPER_TROOPS.includes(entry.name))
			.sort((a, b) => SUPER_TROOPS.indexOf(a.name) - SUPER_TROOPS.indexOf(b.name));
	}

	/** An array of the player's hero pets. */
	public get heroPets() {
		return this.troops
			.filter((entry) => HERO_PETS.includes(entry.name))
			.sort((a, b) => HERO_PETS.indexOf(a.name) - HERO_PETS.indexOf(b.name));
	}

	/** An array of the player's siege machines. */
	public get siegeMachines() {
		return this.troops
			.filter((entry) => SIEGE_MACHINES.includes(entry.name))
			.sort((a, b) => SIEGE_MACHINES.indexOf(a.name) - SIEGE_MACHINES.indexOf(b.name));
	}
}
