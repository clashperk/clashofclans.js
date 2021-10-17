import { Location } from './Location';
import { ChatLanguage } from './ChatLanguage';
import { Badge } from './Badge';
import { WarLeague } from './WarLeague';
import { Label } from './Label';
import { ClanMember } from './ClanMember';

import { Client } from '../client/Client';
import { APIClan } from '../types';

/**
 * Represents a Clan in Clash of Clans
 */
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
	public requiredTownhallLevel: number | null;
	public warFrequency: string;
	public warWinStreak: number;
	public warWins: number;
	public warTies: number | null;
	public warLosses: number | null;
	public isWarLogPublic: boolean;
	public warLeague: WarLeague | null;
	public members: number;
	public labels: Label[];
	public memberList: ClanMember[];

	public constructor(private readonly client: Client, data: APIClan) {
		/**
		 * Name of the clan
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * Tag of the clan
		 * @type {string}
		 */
		this.tag = data.tag;

		/**
		 * Type of the clan
		 * @type {string}
		 */
		this.type = data.type;

		/**
		 * Description of the clan
		 * @type {string}
		 */
		this.description = data.description;

		/**
		 * Clan location
		 * @type {?Location|null}
		 */
		this.location = data.location ? new Location(data.location) : null;

		/**
		 * Chat language
		 * @type {?ChatLanguage|null}
		 */
		this.chatLanguage = data.chatLanguage ? new ChatLanguage(data.chatLanguage) : null;

		/**
		 * Badge urls
		 * @type {Badge}
		 */
		this.badge = new Badge(data.badgeUrls);

		/**
		 * Clan level
		 * @type {number}
		 */
		this.clanLevel = data.clanLevel;

		/**
		 * Clan points
		 * @type {number}
		 */
		this.clanPoints = data.clanPoints;

		/**
		 * Versus clan points
		 * @type {number}
		 */
		this.clanVersusPoints = data.clanVersusPoints;

		/**
		 * Required trophies
		 * @type {number}
		 */
		this.requiredTrophies = data.requiredTrophies;

		this.requiredTownhallLevel = data.requiredTownhallLevel ?? null;
		this.warFrequency = data.warFrequency;
		this.warWinStreak = data.warWinStreak;
		this.warWins = data.warWins;
		this.warTies = data.warTies ?? null;
		this.warLosses = data.warLosses ?? null;
		this.isWarLogPublic = data.isWarLogPublic;

		/**
		 * Clan War League
		 * @type {?WarLeague|null}
		 */
		this.warLeague = data.warLeague ? new WarLeague(data.warLeague) : null;

		/**
		 * Member count of the clan
		 * @type {number}
		 */
		this.members = data.members;

		/**
		 * Clan Labels
		 * @type {Label[]}
		 */
		this.labels = data.labels.map((label: any) => new Label(label));

		/**
		 * Member list of the clan
		 * @type {ClanMember[]}
		 */
		this.memberList = data.memberList.map((mem: any) => new ClanMember(mem));
	}
}
