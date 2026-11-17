import { RAW_UNITS, RawUnit } from './StaticData';

const ARMY_LINK_HOST = 'link.clashofclans.com';
const ARMY_CODE_PATTERN = /^(?:[hidus][0-9xpem_-]*)+$/;
const ITEM_PATTERN = /^(\d+)x(\d+)$/;
const HERO_PATTERN = /^(\d+)(?:m\d+)?(?:p(\d+))?(?:e(\d+(?:_\d+)*))?$/;
/** Generous cap on one item's count, so a malformed link can't claim absurd totals. */
const MAX_ITEM_COUNT = 999;

// Army links carry `GlobalID % 1_000_000`, so each section resolves within its own id series.
const ID_BASE = { troop: 4_000_000, spell: 26_000_000, hero: 28_000_000, pet: 73_000_000, equipment: 90_000_000 };

const homeUnitsById = new Map(RAW_UNITS.filter((unit) => unit.village === 'home').map((unit) => [unit.id, unit]));

type ArmySection = 'h' | 'i' | 'd' | 'u' | 's';

export interface ArmyLinkUnit {
	unit: RawUnit;
	count: number;
}

export interface ArmyLinkHero {
	unit: RawUnit;
	pet: RawUnit | null;
	equipment: RawUnit[];
}

export interface ArmyLink {
	/** The `army` code, e.g. `u10x0-2x3s1x9-3x2`. */
	code: string;
	/** A canonical share link for {@link ArmyLink.code}. */
	url: string;
	heroes: ArmyLinkHero[];
	/** Troops, super troops, siege machines and squads, in link order. Tell them apart by `subCategory` and `superTroop`. */
	troops: ArmyLinkUnit[];
	spells: ArmyLinkUnit[];
	clanCastle: { troops: ArmyLinkUnit[]; spells: ArmyLinkUnit[] };
	/** Ids this version's static data doesn't know (newer units), left out of the lists above. */
	unknown: { section: ArmySection; id: number }[];
}

/** Returns the `army` code of a `CopyArmy` share link, or the input itself when it's already a bare code. */
export const extractArmyCode = (input: string) => {
	const value = input.trim();
	if (!/^https?:\/\//i.test(value)) return ARMY_CODE_PATTERN.test(value) ? value : null;

	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return null;
	}
	if (url.hostname.toLowerCase() !== ARMY_LINK_HOST) return null;
	if (url.searchParams.get('action')?.toLowerCase() !== 'copyarmy') return null;

	const code = url.searchParams.get('army')?.trim();
	return code && ARMY_CODE_PATTERN.test(code) ? code : null;
};

/**
 * Parses an in-game army share link (`https://link.clashofclans.com/en?action=CopyArmy&army=...`) or its bare `army` code.
 * Returns `null` when the input isn't a well-formed army link.
 */
export const parseArmyLink = (input: string): ArmyLink | null => {
	const code = extractArmyCode(input);
	if (!code) return null;

	const army: ArmyLink = {
		code,
		url: `https://${ARMY_LINK_HOST}/en?action=CopyArmy&army=${code}`,
		heroes: [],
		troops: [],
		spells: [],
		clanCastle: { troops: [], spells: [] },
		unknown: []
	};

	const resolve = (section: ArmySection, base: number, id: number, accept: (unit: RawUnit) => boolean) => {
		const unit = homeUnitsById.get(base + id);
		if (unit && accept(unit)) return unit;
		army.unknown.push({ section, id });
		return null;
	};
	const isArmyTroop = (unit: RawUnit) => unit.category === 'troop' && unit.subCategory !== 'pet';
	const isSpell = (unit: RawUnit) => unit.category === 'spell';

	for (const [, section, body] of code.matchAll(/([hidus])([^hidus]*)/g) as IterableIterator<[string, ArmySection, string]>) {
		// Some shared links end a section with a stray `-`.
		for (const part of body.split('-').filter(Boolean)) {
			if (section === 'h') {
				const match = HERO_PATTERN.exec(part);
				if (!match) return null;

				const unit = resolve(section, ID_BASE.hero, Number(match[1]), (hero) => hero.category === 'hero');
				if (!unit) continue;

				const pet =
					match[2] === undefined ? null : resolve(section, ID_BASE.pet, Number(match[2]), (en) => en.subCategory === 'pet');
				const equipment = (match[3]?.split('_') ?? [])
					.map((id) => resolve(section, ID_BASE.equipment, Number(id), (en) => en.category === 'equipment'))
					.filter((en): en is RawUnit => en !== null);
				army.heroes.push({ unit, pet, equipment });
				continue;
			}

			const match = ITEM_PATTERN.exec(part);
			if (!match) return null;

			const count = Number(match[1]);
			if (count < 1 || count > MAX_ITEM_COUNT) return null;

			const isSpellSection = section === 's' || section === 'd';
			const unit = resolve(
				section,
				isSpellSection ? ID_BASE.spell : ID_BASE.troop,
				Number(match[2]),
				isSpellSection ? isSpell : isArmyTroop
			);
			if (!unit) continue;

			const list = {
				u: army.troops,
				s: army.spells,
				i: army.clanCastle.troops,
				d: army.clanCastle.spells
			}[section];
			const existing = list.find((entry) => entry.unit.id === unit.id);
			if (existing) existing.count += count;
			else list.push({ unit, count });
		}
	}

	return army;
};
