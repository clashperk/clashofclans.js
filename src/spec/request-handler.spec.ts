import { createServer, IncomingHttpHeaders, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { deflateSync, gzipSync } from 'node:zlib';
import { RequestHandler } from '../rest/RequestHandler';

const encoders: Record<string, [string | null, (data: string) => Buffer]> = {
	GZIP: ['gzip', (data) => gzipSync(data)],
	DEFLATE: ['deflate', (data) => deflateSync(data)],
	PLAIN: [null, (data) => Buffer.from(data)]
};

describe('RequestHandler', () => {
	let server: Server;
	let baseURL: string;
	let received: IncomingHttpHeaders;

	beforeAll(async () => {
		// The tag in /v1/players/%23<TAG> picks how the response is encoded; unknown tags 404 gzipped.
		server = createServer((req, res) => {
			received = req.headers;
			const tag = decodeURIComponent(req.url!.split('/').pop()!).slice(1);
			const [encoding, encode] = encoders[tag] ?? encoders.GZIP;
			const status = tag in encoders ? 200 : 404;
			const body = JSON.stringify(status === 200 ? { tag: `#${tag}` } : { reason: 'notFound' });
			res.writeHead(status, { 'Content-Type': 'application/json', ...(encoding && { 'Content-Encoding': encoding }) });
			res.end(encode(body));
		});
		await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
		baseURL = `http://127.0.0.1:${(server.address() as AddressInfo).port}/v1`;
	});

	afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

	const handler = () => new RequestHandler({ baseURL, keys: ['key'], rejectIfNotValid: false });

	it('asks for deflate or gzip', async () => {
		await handler().request('/players/%23PLAIN');
		expect(received['accept-encoding']).toBe('gzip, deflate');
	});

	it("keeps the runtime's default User-Agent unless one is set", async () => {
		// Node's undici sends none, Bun's fetch sends `Bun/<version>`.
		const bun = (globalThis as { Bun?: { version: string } }).Bun;
		await handler().request('/players/%23PLAIN');
		expect(received['user-agent']).toBe(bun ? `Bun/${bun.version}` : undefined);
	});

	it('sends the User-Agent, including one changed after construction', async () => {
		const withAgent = new RequestHandler({ baseURL, keys: ['key'], rejectIfNotValid: false, userAgent: 'clashperk/1.0.0/0' });
		await withAgent.request('/players/%23PLAIN');
		expect(received['user-agent']).toBe('clashperk/1.0.0/0');

		withAgent.userAgent = 'clashperk/1.0.0/0 (123)';
		await withAgent.request('/players/%23PLAIN');
		expect(received['user-agent']).toBe('clashperk/1.0.0/0 (123)');
	});

	it.each(Object.keys(encoders))('decodes a %s body', async (tag) => {
		const { body, res } = await handler().request<{ tag: string }>(`/players/%23${tag}`);
		expect(res.status).toBe(200);
		expect(body.tag).toBe(`#${tag}`);
	});

	it('decodes compressed error bodies', async () => {
		const { body, res } = await handler().request<{ reason: string }>('/players/%23MISSING');
		expect(res.status).toBe(404);
		expect(body.reason).toBe('notFound');
	});
});
