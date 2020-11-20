import { Events } from '../lib/Events';

export function handleClanUpdate(client: Events, clan: Clan) {
	if (!clan.memberList.length) return;
	const oldClan: Clan = client.clans.get(clan.tag);
	if (!(oldClan.memberList && oldClan.memberList.length)) return client.clans.set(clan.tag, clan);

	const newMemberList = clan.memberList.map(m => m.tag);
	const oldMemberList = oldClan.memberList.length ? oldClan.memberList.map(m => m.tag) : [];

	if (newMemberList.length && oldMemberList.length) {
		newMemberList.filter(tag => !oldMemberList.includes(tag))
			.forEach(tag => {
				client.emit('clanMemberAdd', clan, clan.memberList.find(m => m.tag === tag));
			});

		oldMemberList.filter(tag => !newMemberList.includes(tag))
			.forEach(tag => {
				client.emit('clanMemberRemove', clan, oldClan.memberList.find(m => m.tag === tag));
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
		client.emit('clanUpdate', clan, oldClan);
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
				client.emit('clanMemberUpdate', clan, oldMem, member);
			}
		}
	}

	return client.clans.set(clan.tag, clan);
}
