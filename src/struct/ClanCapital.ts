import type { APIClanCapital } from '../types';

export class ClanCapital {
	/**
	 * The clan capital hall level
	 */
	public capitalHallLevel: number | null;

	/**
	 * The clan capital districts
	 */
	public districts: { districtHallLevel: number, id: number; name: string; }[] | null;

	public constructor(data: APIClanCapital) {
		this.capitalHallLevel = data.capitalHallLevel ?? null;
		this.districts = data.districts ? data.districts : null;
	}
}
