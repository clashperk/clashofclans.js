import { ChatLanguage } from './ChatLanguage';
import { ClanMember } from './ClanMember';
import { Client } from '../client/Client';
import { WarLeague } from './WarLeague';
import { Location } from './Location';
import { APIClan } from '../types';
import { Label } from './Label';
import { Badge } from './Badge';

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
	public memberCount: number;
	public labels: Label[];

	/** List of clan members (Note: This property returns empty array for searched clans) */
	public members: ClanMember[];

	public constructor(public client: Client, data: APIClan) {
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
		this.memberCount = data.members;

		/**
		 * Clan Labels
		 * @type {Label[]}
		 */
		this.labels = data.labels.map((label) => new Label(label));

		/** List of clan members (Note: This property returns empty array for searched clans) */
		this.members = data.memberList?.map((mem) => new ClanMember(mem)) ?? []; // eslint-disable-line
	}
}
