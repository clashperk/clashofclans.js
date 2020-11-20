import { Events } from './Events';
import { Throttler } from './Throttler';
import { Client } from './Client';

export class ClanEvent {

	private throttler: Throttler;

	public constructor(
		private client: Events,
		private tokens: string[],
		private baseUrl: string,
		private timeout: number,
		private refreshRate: number
	) {
		this.throttler = new Throttler(client.rateLimit * tokens.length);
	}

	public parseTag(tag: string): string {
		return encodeURIComponent(`#${tag.toUpperCase().replace(/O/g, '0').replace('#', '')}`);
	}

	public async init() {
		const startTime = Date.now();
		let i = 0;
		for (const tag of this.client.clans.keys()) {
			if (i > this.tokens.length - 1) i = 0;
			await this.fetch(`${this.baseUrl}/clans/${this.parseTag(tag)}`, i);
			await this.throttler.throttle();
			i += 1;
		}

		const timeTaken = Date.now() - startTime;
		const waitFor = (timeTaken >= this.refreshRate ? 0 : this.refreshRate - timeTaken);
		setTimeout(this.init.bind(this), waitFor);
	}

	public async fetch(tag: string, i: number) {
		const res = await Client.fetch(tag, { token: this.tokens[i], timeout: this.timeout });
		if (!res.ok) return;
		return this.handleClanUpdate(res);
	}

	public handleClanUpdate(clan: Clan) {
		if (!clan.memberList.length) return;
		const oldClan = this.client.clans.get(clan.tag) as Clan;
		if (!(oldClan.memberList && oldClan.memberList.length)) return this.updateCache(clan.tag, clan);

		const newMemberList = clan.memberList.map(m => m.tag);
		const oldMemberList = oldClan.memberList.length ? oldClan.memberList.map(m => m.tag) : [];

		if (newMemberList.length && oldMemberList.length) {
			newMemberList.filter(tag => !oldMemberList.includes(tag))
				.forEach(tag => {
					this.client.emit('clanMemberAdd', clan, clan.memberList.find(m => m.tag === tag));
				});

			oldMemberList.filter(tag => !newMemberList.includes(tag))
				.forEach(tag => {
					this.client.emit('clanMemberRemove', clan, oldClan.memberList.find(m => m.tag === tag));
				});
		}

		if (
			clan.name !== oldClan.name
			|| clan.description !== oldClan.description
			|| clan.type !== oldClan.type
			|| clan.badgeUrls !== oldClan.badgeUrls
			|| clan.location !== oldClan.location
			|| clan.labels !== oldClan.labels
			|| clan.clanLevel !== oldClan.clanLevel
			|| clan.clanPoints !== oldClan.clanPoints
			|| clan.clanVersusPoints !== oldClan.clanVersusPoints
			|| clan.requiredTrophies !== oldClan.requiredTrophies
			|| clan.warFrequency !== oldClan.warFrequency
			|| clan.warWinStreak !== oldClan.warWinStreak
			|| clan.warWins !== oldClan.warWins
			|| clan.isWarLogPublic !== oldClan.isWarLogPublic
			|| clan.warLeague !== oldClan.warLeague
			|| clan.members !== oldClan.members
			|| (clan.isWarLogPublic && oldClan.isWarLogPublic && clan.warLosses !== oldClan.warLosses)
			|| (clan.isWarLogPublic && oldClan.isWarLogPublic && clan.warTies !== oldClan.warTies)
		) {
			this.client.emit('clanUpdate', clan as Clan, oldClan as Clan);
		}

		for (const member of clan.memberList) {
			if (oldClan.memberList.map(m => m.tag).includes(member.tag)) {
				const oldMem = oldClan.memberList.find(m => m.tag === member.tag)!;
				if (
					member.name !== oldMem.name
					|| member.role !== oldMem.role
					|| member.expLevel !== oldMem.expLevel
					|| member.league !== oldMem.league
					|| member.trophies !== oldMem.trophies
					|| member.versusTrophies !== oldMem.versusTrophies
					|| member.clanRank !== oldMem.clanRank
					|| member.previousClanRank !== oldMem.previousClanRank
					|| member.dontaions !== oldMem.dontaions
					|| member.donationsReceived !== oldMem.donationsReceived
				) {
					this.client.emit('clanMemberUpdate', clan, oldMem, member);
				}
			}
		}

		return this.updateCache(clan.tag, clan);
	}

	public updateCache(tag: string, clan: Clan) {
		this.client.clans.delete(tag);
		return this.client.clans.set(tag, clan);
	}

}
