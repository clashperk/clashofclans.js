import type { Client } from '../client/Client';
import type {
    APIClanWarLeagueClan,
    APIClanWarLeagueClanMember,
    APIClanWarLeagueGroup,
    APIClanWarLeagueRound,
    OverrideOptions
} from '../types';
import { Badge } from './Badge.js';
import type { ClanWar } from './ClanWar';
import type { Player } from './Player';

/**
 * Represents a Clan War League member.
 */
export class ClanWarLeagueClanMember {
    /**
     * The member's name.
     */
    public name: string;

    /**
     * The member's tag.
     */
    public tag: string;

    /**
     * The member's town hall level.
     */
    public townHallLevel: number;

    public constructor(data: APIClanWarLeagueClanMember) {
        this.name = data.name;
        this.tag = data.tag;
        this.townHallLevel = data.townHallLevel;
    }

    /**
     * Get member's formatted link to open member in-game.
     */
    public get shareLink() {
        return `https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${this.tag.replaceAll('#', '')}`;
    }
}

/**
 * Represents a Clan of CWL Group.
 */
export class ClanWarLeagueClan {
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
     * The clan's badge.
     */
    public badge: Badge;

    /**
     * An array of members that are in the CWL group.
     */
    public members: ClanWarLeagueClanMember[];

    public constructor(private readonly client: Client, data: APIClanWarLeagueClan) {
        this.name = data.name;
        this.tag = data.tag;
        this.level = data.clanLevel;
        this.badge = new Badge(data.badgeUrls);
        this.members = data.members.map((mem) => new ClanWarLeagueClanMember(mem));
    }

    /**
     * Get {@link Player} info for every members that are in the CWL group.
     */
    public async fetchMembers(options?: OverrideOptions) {
        return (
            await Promise.allSettled(this.members.map(async (member) => this.client.getPlayer(member.tag, { ...options, ignoreRateLimit: true })))
        )
            .filter((res) => res.status === 'fulfilled')
            .map((res) => (res as PromiseFulfilledResult<Player>).value);
    }

    /**
     * Get clan's formatted link to open clan in-game.
     */
    public get shareLink() {
        return `https://link.clashofclans.com/en?action=OpenClanProfile&tag=${this.tag.replaceAll('#', '')}`;
    }
}

/**
 * Represents a Round of CWL Group.
 */
export class ClanWarLeagueRound {
    /**
     * War Tags for this round.
     */
    public warTags: string[];

    /**
     * The # (1-7) of this round.
     */
    public round: number;

    public constructor(data: APIClanWarLeagueRound, round: number) {
        this.warTags = data.warTags;
        this.round = round + 1;
    }
}

/**
 * Represents a CWL Group.
 */
export class ClanWarLeagueGroup {
    /**
     * The CWL group's current war state.
     */
    public state: 'ended' | 'inWar' | 'preparation';

    /**
     * Season Id of this CWL group.
     */
    public season: string;

    /**
     * Returns all participating clans.
     */
    public clans: ClanWarLeagueClan[];

    /**
     * An array containing all war tags for each round.
     */
    public rounds: ClanWarLeagueRound[];

    public constructor(private readonly client: Client, data: APIClanWarLeagueGroup) {
        // @ts-expect-error something to write
        this.state = data.state;
        this.season = data.season;
        this.clans = data.clans.map((clan) => new ClanWarLeagueClan(client, clan));
        this.rounds = data.rounds.map((round, index) => new ClanWarLeagueRound(round, index));
    }

    /**
     * Total number of rounds for this CWL.
     */
    public get totalRounds() {
        return this.clans.length - 1;
    }

    /**
     * This returns an array of {@link ClanWar} which fetches all wars in parallel.
     *
     * @param clanTag - Optional clan tag. If present, this will only return wars which belong to this clan.
     * @param options - Override options for the request.
     */
    public async getWars(clanTag?: string, options?: OverrideOptions) {
        const rounds = this.rounds.filter((round) => !round.warTags.includes('#0'));
        if (!rounds.length) return [];

        const warTags = rounds.flatMap((round) => round.warTags);
        const wars = await Promise.allSettled(
            warTags.map(async (warTag) => this.client.getClanWarLeagueRound({ warTag, clanTag }, { ...options, ignoreRateLimit: true }))
        );
        return wars
            .filter((res) => res.status === 'fulfilled')
            .map((res) => (res as PromiseFulfilledResult<ClanWar>).value)
            .filter((war) => (clanTag ? war.clan.tag === clanTag : true));
    }

    /**
     * Returns active wars (last 2) of the CWL group.
     */
    public async getCurrentWars(clanTag: string, options?: OverrideOptions) {
        const rounds = this.rounds.filter((round) => !round.warTags.includes('#0'));
        if (!rounds.length) return [];
        const warTags = rounds
            .slice(-2)
            .flatMap((round) => round.warTags)
            .reverse();
        const wars = await Promise.allSettled(
            warTags.map(async (warTag) => this.client.getClanWarLeagueRound({ warTag, clanTag }, { ...options, ignoreRateLimit: true }))
        );
        return wars
            .filter((res) => res.status === 'fulfilled')
            .map((res) => (res as PromiseFulfilledResult<ClanWar>).value)
            .filter((war) => war.clan.tag === clanTag);
    }

    /**
     * Returns the index of the round for this specified warTag.
     */
    public getRoundIndex(warTag: string): number | null {
        return this.rounds.find((round) => round.warTags.includes(warTag))?.round ?? null;
    }
}
