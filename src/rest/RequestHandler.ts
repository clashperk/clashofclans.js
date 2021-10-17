import { Client } from '../client/Client';
import HTTPError from './HTTPError';
import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({ keepAlive: true });

export default class RequestHandler {
	#keyIndex = 0; // eslint-disable-line

	private readonly client: Client;

	public constructor(client: Client) {
		this.client = client;
	}

	private get _keys() {
		return Array.isArray(this.client.keys) ? this.client.keys : [this.client.keys];
	}

	private get _key() {
		const key = this._keys[this.#keyIndex];
		this.#keyIndex = (this.#keyIndex + 1) >= this._keys.length ? 0 : this.#keyIndex + 1;
		return key;
	}

	public async request<T = any>(path: string, options: RequestOptions = {}) {
		const timeout = this.client.restRequestTimeout || 0;
		const res = await fetch(`${this.client.baseURL}${path}`, {
			headers: {
				'Authorization': `Bearer ${this._key}`,
				'Content-Type': 'application/json'
			}, timeout, agent, ...options
		}).catch(() => null);

		const data: T = await res?.json().catch(() => null);
		if (!res?.ok) throw new HTTPError(data, res?.status ?? 504, options.method ?? 'GET', path);

		const maxAge = res.headers.get('cache-control')?.split('=')?.[1] ?? 0;
		return { data, response: { ok: res.status === 200, status: res.status, maxAge: Number(maxAge) * 1000 } };
	}
}

export interface RequestOptions {
	method?: string;
	body?: string;
}
