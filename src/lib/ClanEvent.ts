import { Events } from './Events';
import { Throttler } from './Throttler';
import { Client } from './Client';

export class ClanEvent {

	private throttler: Throttler;

	public constructor(private event: Events, private tokens: string[], private timeout: number) {
		this.throttler = new Throttler();
	}

	public async init() {
		for (const tag of this.event.clans.keys()) {
			await this.fetch(tag);
			await this.throttler.throttle();
		}
	}

	public async fetch(tag: string) {
		const res = await Client.fetch(tag, { token: this.tokens[0], timeout: this.timeout });
		if (!res.ok) return;
		return this.handleClanUpdate(res);
	}

	public handleClanUpdate(clan: Clan) {
		if (!clan.memberList.length) return;
		const oldClan = this.event.clans.get(clan.tag) as Clan;
		const newMemberList = clan.memberList.map(m => m.tag);
		const oldMemberList = oldClan.memberList.length ? oldClan.memberList.map(m => m.tag) : [];

		if (newMemberList.length && oldMemberList.length) {
			newMemberList.filter(tag => !oldMemberList.includes(tag))
				.forEach(tag => {
					this.event.emit('clanMemberAdd', clan, clan.memberList.find(m => m.tag === tag));
				});

			oldMemberList.filter(tag => !newMemberList.includes(tag))
				.forEach(tag => {
					this.event.emit('clanMemberRemove', clan, oldClan.memberList.find(m => m.tag === tag));
				});
		}
	}

}
