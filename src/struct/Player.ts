import { Achievement, Hero, Label, League, PlayerClan, Spell, Troop } from './Misc';
import { Client } from '../client/Client';
import { APIPlayer } from '../types';
import { LegendStatistics } from '..';

export default class Player {
	public name: string;
	public tag: string;
	public townHallLevel: number;
	public townHallWeaponLevel: number | null;
	public expLevel: number;
	public trophies: number;
	public bestTrophies: number;
	public warStars: number;
	public attackWins: number;
	public defenseWins: number;
	public builderHallLevel: number | null;
	public versusTrophies: number | null;
	public bestVersusTrophies: number | null;
	public versusBattleWins: number | null;
	public donations: number;
	public donationsReceived: number;
	public role: string | null;
	public clan: PlayerClan | null;
	public league: League | null;
	public legendStatistics: LegendStatistics | null;
	public achievements: Achievement[];
	public labels: Label[];
	public troops: Troop[];
	public spells: Spell[];
	public heroes: Hero[];

	public constructor(private readonly client: Client, data: APIPlayer) {
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
		this.donationsReceived = data.donationsReceived;
		this.role = data.role ?? null;
		this.clan = data.clan ? new PlayerClan(data.clan) : null;
		this.league = data.league ? new League(data.league) : null;
		this.legendStatistics = data.legendStatistics ? new LegendStatistics(data.legendStatistics) : null;
		this.achievements = data.achievements.map((data) => new Achievement(data));
		this.labels = data.labels.map((data) => new Label(data));
		this.troops = data.troops.map((data) => new Troop(data));
		this.spells = data.spells.map((data) => new Spell(data));
		this.heroes = data.heroes.map((data) => new Hero(data));
	}

	public async fetchClan() {
		if (!this.clan) return null;
		return this.client.getClan(this.clan.tag);
	}
}
