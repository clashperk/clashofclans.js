import { Client } from './client/Client';

describe('root', () => {
	const client = new Client({ restRequestTimeout: 30_000 });

	it('should return a player', async () => {
		const result = await client.login({
			email: process.env.EMAIL!,
			password: process.env.PASSWORD!,
			keyCount: 2,
			keyName: 'prod_key'
		});
		console.log({
			result: result.length
		});
		expect(result).toBeDefined();
	}, 60_000);
});
