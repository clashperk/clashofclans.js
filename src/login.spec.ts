import { Client } from './client/Client';

describe('root', () => {
	const client = new Client({ restRequestTimeout: 30_000 });

	it('should return a player', async () => {
		const result = await client.login({
			email: process.env.EMAIL!,
			password: process.env.PASSWORD!,
			keyCount: 10,
			keyName: 'prod_key'
		});
		console.log({
			result: result.join(',')
		});
		expect(result).toBeDefined();
	}, 60_000);
});
