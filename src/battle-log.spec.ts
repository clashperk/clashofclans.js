import { Client } from './client/Client';
import { Util } from './util/Util';

describe('root', () => {
	const client = new Client({ baseURL: process.env.BASE_URL });

	it('should return battle logs', async () => {
		const { body: result } = await client.rest.getBattleLog('#9JPLU2RJ2');
		const legendAttacks = result.items.filter((item) => item.battleType === 'legend').slice(-8);
		console.log(legendAttacks.map((m) => Util.calculateTrophies(m.stars, m.destructionPercentage, m.attack, true)));
		expect(result).toHaveProperty('items');
	});
});
