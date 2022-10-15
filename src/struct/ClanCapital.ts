import { APIClanCapital } from '../types';

export class ClanCapital {
	/** The clan capital hall level */
	public capitalHallLevel: number | null;

	/** The clan capital districts */
	public districts: { id: number; name: string; districtHallLevel: number }[] | null;

	public constructor(data: APIClanCapital) {
		this.capitalHallLevel = data.capitalHallLevel ?? null;
		this.districts = data.districts ?? null;
	}
}
