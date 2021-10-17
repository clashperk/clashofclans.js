import { HTTPError } from './HTTPError';
import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({ keepAlive: true });

export class RequestHandler {
	#keyIndex = 0; // eslint-disable-line

	private keys: string[];
	private readonly baseURL: string;
	private readonly restRequestTimeout: number;

	public constructor(options?: ClientOptions) {
		this.keys = options?.keys ?? [];
		this.baseURL = options?.baseURL ?? 'https://api.clashofclans.com/v1';
		this.restRequestTimeout = options?.restRequestTimeout ?? 0;
	}

	private get _keys() {
		return Array.isArray(this.keys) ? this.keys : [this.keys];
	}

	private get _key() {
		const key = this._keys[this.#keyIndex];
		this.#keyIndex = this.#keyIndex + 1 >= this._keys.length ? 0 : this.#keyIndex + 1;
		return key;
	}

	public setKeys(keys: string[]) {
		this.keys = keys;
	}

	public async request<T = any>(path: string, options: RequestOptions = {}) {
		const res = await fetch(`${this.baseURL}${path}`, {
			headers: {
				Authorization: `Bearer ${this._key}`,
				'Content-Type': 'application/json'
			},
			timeout: this.restRequestTimeout,
			agent,
			...options
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

export interface ClientOptions {
	keys?: string[];
	baseURL?: string;
	restRequestTimeout?: number;
}
