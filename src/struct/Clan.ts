import { ChatLanguage } from './ChatLanguage';
import { ClanMember } from './ClanMember';
import { Client } from '../client/Client';
import { WarLeague } from './WarLeague';
import type { Player } from './Player';
import { Location } from './Location';
import { APIClan } from '../types';
import { Label } from './Label';
import { Badge } from './Badge';

/** Represents a Clan. */
export class Clan {
	public name: string;
	public tag: string;
	public type: string;
	public description: string;
	public location: Location | null;
	public chatLanguage: ChatLanguage | null;
	public badge: Badge;
	public clanLevel: number;
	public clanPoints: number;
	public clanVersusPoints: number;
	public requiredTrophies: number;
	public requiredTownHallLevel: number | null;
	public warFrequency: string;
	public warWinStreak: number;
	public warWins: number;
	public warTies: number | null;
	public warLosses: number | null;
	public isWarLogPublic: boolean;
	public warLeague: WarLeague | null;
	public memberCount: number;
	public labels: Label[];

	/**
	 * List of clan members.
	 * - This property returns empty array for {@link Client.getClans} method.
	 */
	public members: ClanMember[];

	public constructor(public client: Client, data: APIClan) {
		this.name = data.name;
		this.tag = data.tag;
		this.type = data.type;
		this.description = data.description;
		this.location = data.location ? new Location(data.location) : null;
		this.chatLanguage = data.chatLanguage ? new ChatLanguage(data.chatLanguage) : null;
		this.badge = new Badge(data.badgeUrls);
		this.clanLevel = data.clanLevel;
		this.clanPoints = data.clanPoints;
		this.clanVersusPoints = data.clanVersusPoints;
		this.requiredTrophies = data.requiredTrophies;
		this.requiredTownHallLevel = data.requiredTownhallLevel ?? null;
		this.warFrequency = data.warFrequency;
		this.warWinStreak = data.warWinStreak;
		this.warWins = data.warWins;
		this.warTies = data.warTies ?? null;
		this.warLosses = data.warLosses ?? null;
		this.isWarLogPublic = data.isWarLogPublic;
		this.warLeague = data.warLeague ? new WarLeague(data.warLeague) : null;
		this.memberCount = data.members;
		this.labels = data.labels.map((label) => new Label(label));
		this.members = data.memberList?.map((mem) => new ClanMember(this.client, mem)) ?? []; // eslint-disable-line
	}

	/** Get Player information for every Player in the clan. */
	public async fetchClanMembers() {
		return (await Promise.allSettled(this.members.map((m) => this.client.getPlayer(m.tag))))
			.filter((res) => res.status === 'fulfilled')
			.map((res) => (res as PromiseFulfilledResult<Player>).value);
	}
}
