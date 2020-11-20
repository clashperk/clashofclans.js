import { Events } from '../lib/Events';

export function handleClanUpdate(client: Events, clan: Clan) {
	if (clan.members < 1) return;

	const oldClan: Clan | true = client.clans.get(clan.tag);
	if (oldClan === true) {
		client.clans.set(clan.tag, clan);
		return;
	}

	const oldMembers = oldClan.memberList && oldClan.memberList.length ? oldClan.memberList : [];
	const newMembers = clan.memberList && clan.memberList.length ? clan.memberList : [];

	newMembers.forEach(member => {
		if (!oldMembers.find(mem => mem.tag === member.tag)) client.emit('clanMemberAdd', clan, member);
	});
	oldMembers.forEach(member => {
		if (!newMembers.find(mem => mem.tag === member.tag)) client.emit('clanMemberRemove', clan, member);
	});

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

	for (const member of newMembers) {
		const oldMem = oldMembers.find(mem => mem.tag === member.tag);
		if (!oldMem) continue;
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

	client.clans.set(clan.tag, clan);
}
