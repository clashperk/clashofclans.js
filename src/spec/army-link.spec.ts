import { extractArmyCode, parseArmyLink } from '../util/ArmyLink';

const names = (list: { unit: { name: string }; count: number }[]) => list.map((entry) => [entry.unit.name, entry.count]);

describe('army link', () => {
	it('parses troops and spells', () => {
		const army = parseArmyLink('https://link.clashofclans.com/en?action=CopyArmy&army=u10x0-2x3s1x9-3x2')!;

		expect(names(army.troops)).toEqual([
			['Barbarian', 10],
			['Giant', 2]
		]);
		expect(names(army.spells)).toEqual([
			['Poison Spell', 1],
			['Rage Spell', 3]
		]);
		expect(army.code).toBe('u10x0-2x3s1x9-3x2');
		expect(army.unknown).toEqual([]);
	});

	it('parses heroes with pets and equipment, and the clan castle', () => {
		const army = parseArmyLink('https://link.clashofclans.com/en?action=CopyArmy&army=h0m1p0e0_1-1i1x51-2x1d1x0u5x26-1x195s2x0')!;

		expect(army.heroes.map((hero) => [hero.unit.name, hero.pet?.name ?? null, hero.equipment.map((en) => en.name)])).toEqual([
			['Barbarian King', 'L.A.S.S.I', ['Barbarian Puppet', 'Rage Vial']],
			['Archer Queen', null, []]
		]);
		expect(names(army.clanCastle.troops)).toEqual([
			['Wall Wrecker', 1],
			['Archer', 2]
		]);
		expect(names(army.clanCastle.spells)).toEqual([['Lightning Spell', 1]]);
		expect(army.troops.map((entry) => [entry.unit.name, entry.unit.subCategory, Boolean(entry.unit.superTroop)])).toEqual([
			['Super Barbarian', 'troop', true],
			['Barch Squad', 'squad', false]
		]);
		expect(names(army.spells)).toEqual([['Lightning Spell', 2]]);
	});

	it('accepts a bare code, any language path and a trailing dash', () => {
		expect(parseArmyLink('u10x0-')?.troops).toHaveLength(1);
		expect(parseArmyLink('https://link.clashofclans.com/?army=u1x0&action=CopyArmy')?.troops).toHaveLength(1);
		expect(parseArmyLink('https://link.clashofclans.com/zh?action=copyarmy&army=s1x0')?.spells).toHaveLength(1);
	});

	it('merges repeated units and reports unknown ids', () => {
		const army = parseArmyLink('u1x0-2x0-1x999')!;

		expect(names(army.troops)).toEqual([['Barbarian', 3]]);
		expect(army.unknown).toEqual([{ section: 'u', id: 999 }]);
	});

	it('rejects malformed links', () => {
		expect(parseArmyLink('https://example.com/en?action=CopyArmy&army=u1x0')).toBeNull();
		expect(parseArmyLink('https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=%23ABC')).toBeNull();
		expect(parseArmyLink('u1x')).toBeNull();
		expect(parseArmyLink('u0x0')).toBeNull();
		expect(parseArmyLink('hello')).toBeNull();
		expect(extractArmyCode('')).toBeNull();
	});
});
