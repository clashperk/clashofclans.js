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
		client.emit('clanUpdate', oldClan, clan);
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

export function handlePlayerUpdate(client: Events, player: Player) {
	const oldPlayer: Player | true = client.players.get(player.tag);
	if (oldPlayer === true) {
		client.players.set(player.tag, player);
		return;
	}

	const oldTroops = oldPlayer.troops;
	for (const hero of oldPlayer.heroes) oldTroops.push(hero);
	for (const spell of oldPlayer.spells) oldTroops.push(spell);

	const newTroops = player.troops;
	for (const hero of player.heroes) newTroops.push(hero);
	for (const spell of player.spells) newTroops.push(spell);

	newTroops.forEach(troop => {
		const oldData = oldTroops.find(trp => trp.name === troop.name);
		if (!oldData || oldData.level !== troop.level) client.emit('playerTroopUpdate', player, oldData, troop);
	});

	const oldAchievements = oldPlayer.achievements;
	const newAchievements = player.achievements;
	for (const achieve of newAchievements) {
		const oldData = oldAchievements.find(ach => ach.name === achieve.name);
		if (oldData && oldData.stars !== achieve.stars) client.emit('playerAchievementUpdate', player, oldData, achieve);
	}

	if (
		oldPlayer.name !== player.name
		|| oldPlayer.townHallLevel !== player.townHallLevel
		|| oldPlayer.townHallLevel !== player.townHallWeaponLevel
		|| oldPlayer.builderHallLevel !== player.builderHallLevel
		|| oldPlayer.expLevel !== player.expLevel
		|| oldPlayer.trophies !== player.trophies
		|| oldPlayer.bestTrophies !== player.bestTrophies
		|| oldPlayer.versusTrophies !== player.versusTrophies
		|| oldPlayer.bestVersusTrophies !== player.bestVersusTrophies
		|| oldPlayer.warStars !== player.warStars
		|| oldPlayer.attackWins !== player.attackWins
		|| oldPlayer.defenseWins !== player.defenseWins
		|| oldPlayer.versusBattleWins !== player.versusBattleWins
		|| oldPlayer.role !== player.role
		|| oldPlayer.donations !== player.donations
		|| oldPlayer.donationsReceived !== player.donationsReceived
		|| (oldPlayer.clan ? player.clan ? oldPlayer.clan.tag === player.clan.tag : false : player.clan ? true : false)
		|| oldPlayer.league !== player.league
		|| oldPlayer.labels !== player.labels
	) {
		client.emit('playerUpdate', oldPlayer, player);
	}

	client.players.set(player.tag, player);
}
