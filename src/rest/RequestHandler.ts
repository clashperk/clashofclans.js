import { HTTPError } from './HTTPError';
import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({ keepAlive: true });

/**
 * @private
 */
export class RequestHandler {
	#keyIndex = 0; // eslint-disable-line

	private keys: string[];
	private readonly baseURL: string;
	private readonly retryLimit: number;
	private readonly restRequestTimeout: number;

	public constructor(options?: ClientOptions) {
		this.keys = options?.keys ?? [];
		this.retryLimit = options?.retryLimit ?? 0;
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
		return this;
	}

	public async request<T = any>(path: string, options: RequestOptions = {}, retries = 0): Promise<Response<T>> {
		const res = await fetch(`${this.baseURL}${path}`, {
			agent,
			...options,
			timeout: this.restRequestTimeout,
			headers: {
				Authorization: `Bearer ${this._key}`,
				'Content-Type': 'application/json'
			}
		}).catch(() => null);

		const data: T = await res?.json().catch(() => null);
		if (!res && retries < this.retryLimit) return this.request<T>(path, options, ++retries);
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
	retryLimit?: number;
	restRequestTimeout?: number;
}

export interface Response<T> {
	data: T;
	response: {
		ok: boolean;
		status: number;
		maxAge: number;
	};
}
