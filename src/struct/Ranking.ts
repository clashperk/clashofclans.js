import type { Client } from '../client/Client';
import type { APIClanRanking, APIClanVersusRanking, APIPlayerRanking, APIPlayerVersusRanking } from '../types';
import { UnrankedLeagueData } from '../util/Constants.js';
import { Badge } from './Badge.js';
import { League } from './League.js';
import { Location } from './Location.js';
import { PlayerClan } from './PlayerClan.js';

/**
 * Represents the Player of seasonal legend league leader-board ranking.
 */
export class SeasonRankedPlayer {
    /**
     * The player's name.
     */
    public name: string;

    /**
     * The player's tag.
     */
    public tag: string;

    /**
     * The player's experience level.
     */
    public expLevel: number;

    /**
     * The player's trophy count.
     */
    public trophies: number;

    /**
     * The player's attack wins.
     */
    public attackWins: number;

    /**
     * The player's defense wins.
     */
    public defenseWins: number;

    /**
     * The player's rank in the clan leader-board.
     */
    public rank: number;

    /**
     * The player's clan.
     */
    public clan: PlayerClan | null;

    public constructor(client: Client, data: Omit<APIPlayerRanking, 'league'>) {
        this.name = data.name;
        this.tag = data.tag;
        this.rank = data.rank;
        this.expLevel = data.expLevel;
        this.trophies = data.trophies;
        this.attackWins = data.attackWins;
        this.defenseWins = data.defenseWins;
        // @ts-expect-error something to write
        this.clan = data.clan ? new PlayerClan(client, data.clan) : null;
    }

    /**
     * Get player's formatted link to open player in-game.
     */
    public get shareLink() {
        return `https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${this.tag.replaceAll('#', '')}`;
    }
}

/**
 * Represents the Player of location based leader-board ranking.
 */
export class RankedPlayer {
    /**
     * The player's name.
     */
    public name: string;

    /**
     * The player's tag.
     */
    public tag: string;

    /**
     * The player's experience level.
     */
    public expLevel: number;

    /**
     * The player's trophy count. If retrieving info for versus leader-boards, this will be `null`.
     */
    public trophies: number | null;

    /**
     * The player's attack wins. If retrieving info for versus leader-boards, this will be `null`.
     */
    public attackWins: number | null;

    /**
     * The player's defense wins. If retrieving info for versus leader-boards, this will be `null`.
     */
    public defenseWins: number | null;

    /**
     * The player's versus trophy count. If retrieving info for regular leader-boards, this will be `null`.
     */
    public versusTrophies: number | null;

    /**
     * The number of total versus attacks the player has won. If retrieving info for regular leader-boards, this will be `null`.
     */
    public versusBattleWins: number | null;

    /**
     * The player's rank in the clan leader-board.
     */
    public rank: number;

    /**
     * The player's rank before the last leader-board change. If retrieving info for legend league season, this will be `null`.
     */
    public previousRank: number | null;

    /**
     * The player's clan.
     */
    public clan: PlayerClan | null;

    /**
     * The player's league. If retrieving info for versus leader-boards, this will be `null`.
     */
    public league!: League | null;

    public constructor(client: Client, data: APIPlayerRanking | APIPlayerVersusRanking) {
        this.name = data.name;
        this.tag = data.tag;
        this.expLevel = data.expLevel;
        // @ts-expect-error something to write
        this.trophies = data.trophies ?? null;
        // @ts-expect-error something to write
        this.attackWins = data.attackWins ?? null;
        // @ts-expect-error something to write
        this.defenseWins = data.defenseWins ?? null;
        // @ts-expect-error something to write
        this.versusTrophies = data.versusTrophies ?? null;
        // @ts-expect-error something to write
        this.versusBattleWins = data.versusBattleWins ?? null;
        this.rank = data.rank;
        this.previousRank = data.previousRank ?? null;
        // @ts-expect-error something to write
        this.clan = data.clan ? new PlayerClan(client, data.clan) : null;
        // @ts-expect-error something to write
        this.league = data.trophies ? new League(data.league ?? UnrankedLeagueData) : null;
    }

    /**
     * Get player's formatted link to open player in-game.
     */
    public get shareLink() {
        return `https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${this.tag.replaceAll('#', '')}`;
    }
}

/**
 * Represents the Clan of location based leader-board ranking.
 */
export class RankedClan {
    /**
     * The clan's name.
     */
    public name: string;

    /**
     * The clan's tag.
     */
    public tag: string;

    /**
     * The clan's level.
     */
    public level: number;

    /**
     * The clan's trophy count. If retrieving info for versus leader-boards, this will be `null`.
     */
    public points: number | null;

    /**
     * The clan's versus trophy count. If retrieving info for regular leader boards, this will be `null`.
     */
    public versusPoints: number | null;

    /**
     * The clan's location.
     */
    public location: Location;

    /**
     * The number of members in the clan.
     */
    public memberCount: number;

    /**
     * The clan's rank in the leader board.
     */
    public rank: number;

    /**
     * The clan's rank in the previous season's leader-board.
     */
    public previousRank: number;

    /**
     * The clan's badge.
     */
    public badge: Badge;

    public constructor(data: APIClanRanking | APIClanVersusRanking) {
        this.name = data.name;
        this.tag = data.tag;
        this.level = data.clanLevel;
        // @ts-expect-error something to write
        this.points = data.clanPoints ?? null;
        // @ts-expect-error something to write
        this.versusPoints = data.clanVersusPoints ?? null;
        this.location = new Location(data.location);
        this.memberCount = data.members;
        this.rank = data.rank;
        this.previousRank = data.previousRank;
        this.badge = new Badge(data.badgeUrls);
    }

    /**
     * Get clan's formatted link to open clan in-game.
     */
    public get shareLink() {
        return `https://link.clashofclans.com/en?action=OpenClanProfile&tag=${this.tag.replaceAll('#', '')}`;
    }
}
