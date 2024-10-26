import { APICapitalRaidSeason } from '../types';
import { FriendlyWarPreparationTimes } from './Constants';

export const calculateRaidsCompleted = (attackLog: APICapitalRaidSeason['attackLog']) => {
	let total = 0;
	for (const clan of attackLog) {
		if (clan.districtsDestroyed === clan.districtCount) total += 1;
	}
	return total;
};

export const calculateOffensiveRaidMedals = (attackLog: APICapitalRaidSeason['attackLog']) => {
	const districtMap: Record<string, number> = {
		1: 135,
		2: 225,
		3: 350,
		4: 405,
		5: 460
	};
	const capitalMap: Record<string, number> = {
		2: 180,
		3: 360,
		4: 585,
		5: 810,
		6: 1115,
		7: 1240,
		8: 1260,
		9: 1375,
		10: 1450
	};

	let totalMedals = 0;
	let attacksDone = 0;
	for (const clan of attackLog) {
		attacksDone += clan.attackCount;
		for (const district of clan.districts) {
			if (district.destructionPercent === 100) {
				if (district.id === 70000000) {
					totalMedals += capitalMap[district.districtHallLevel];
				} else {
					totalMedals += districtMap[district.districtHallLevel];
				}
			}
		}
	}
	if (totalMedals !== 0) totalMedals = Math.ceil(totalMedals / attacksDone);
	return totalMedals;
};

export const isFriendlyWar = (preparationStartTime: Date, startTime: Date) => {
	const preparationTime = startTime.getTime() - preparationStartTime.getTime();
	return FriendlyWarPreparationTimes.includes(preparationTime);
};

export const getWarResult = (clan: PartialWarClan, opponent: PartialWarClan) => {
	if (clan.stars > opponent.stars) return 'win';
	if (clan.stars === opponent.stars) {
		if (clan.destructionPercentage > opponent.destructionPercentage) return 'win';
		if (clan.destructionPercentage === opponent.destructionPercentage) return 'tie';
	}
	return 'lose';
};

export const isWarWinner = (clan: PartialWarClan, opponent: PartialWarClan) => {
	const result = getWarResult(clan, opponent);
	return result === 'win';
};

export interface PartialWarClan {
	stars: number;
	destructionPercentage: number;
}
