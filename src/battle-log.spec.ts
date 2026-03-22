import { Client } from './client/Client';

describe('root', () => {
	const client = new Client({ baseURL: process.env.BASE_URL });

	it('should return battle logs', async () => {
		const { body: result } = await client.rest.getBattleLog('#9JPLU2RJ2');
		expect(result).toHaveProperty('items');
	});
});
