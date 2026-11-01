import { createServer, IncomingHttpHeaders, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { gzipSync } from 'node:zlib';
import { RequestHandler } from '../rest/RequestHandler';

describe('RequestHandler', () => {
	let server: Server;
	let baseURL: string;
	let received: IncomingHttpHeaders;

	beforeAll(async () => {
		server = createServer((req, res) => {
			received = req.headers;
			const found = req.url === '/v1/players/%23ABC';
			const body = gzipSync(JSON.stringify(found ? { tag: '#ABC' } : { reason: 'notFound' }));
			res.writeHead(found ? 200 : 404, { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip' });
			res.end(body);
		});
		await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
		baseURL = `http://127.0.0.1:${(server.address() as AddressInfo).port}/v1`;
	});

	afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

	it('asks for gzip and decodes the body', async () => {
		const handler = new RequestHandler({ baseURL, keys: ['key'], rejectIfNotValid: false });
		const { body, res } = await handler.request<{ tag: string }>('/players/%23ABC');

		expect(received['accept-encoding']).toBe('gzip');
		expect(res.status).toBe(200);
		expect(body.tag).toBe('#ABC');
	});

	it('decodes gzipped error bodies', async () => {
		const handler = new RequestHandler({ baseURL, keys: ['key'], rejectIfNotValid: false });
		const { body, res } = await handler.request<{ reason: string }>('/players/%23MISSING');

		expect(res.status).toBe(404);
		expect(body.reason).toBe('notFound');
	});
});
