import { Client } from './client/Client';

describe('root', () => {
	const client = new Client({ baseURL: process.env.BASE_URL });

	it('should return a player', async () => {
		const result = await client.getPlayer('#LUV2PG2Y9');
		console.log({
			name: result.name,
			tag: result.tag,
			troops: result.troops.map((troop) => troop.name),
			spells: result.spells.map((spell) => spell.name),
			heroes: result.heroes.map((hero) => hero.name)
		});
		expect(result).toHaveProperty('tag');
	});

	it('should return a clan', async () => {
		const result = await client.getClan('#8QU8J9LP');
		console.log({
			name: result.name,
			tag: result.tag
		});
		expect(result).toHaveProperty('tag');
	});
});
