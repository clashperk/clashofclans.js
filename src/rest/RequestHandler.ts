import { API_BASE_URL, DEV_SITE_API_BASE_URL } from '../util/Constants';
import { HTTPError } from './HTTPError';
import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({ keepAlive: true });

/** @private */
export class RequestHandler {
	/** @internal */
	#keyIndex = 0; // eslint-disable-line

	private keys: string[];
	private readonly baseURL: string;
	private readonly retryLimit: number;
	private readonly restRequestTimeout: number;

	public constructor(options?: ClientOptions) {
		this.keys = options?.keys ?? [];
		this.retryLimit = options?.retryLimit ?? 0;
		this.baseURL = options?.baseURL ?? API_BASE_URL;
		this.restRequestTimeout = options?.restRequestTimeout ?? 0;
	}

	/** @internal */
	private get _keys() {
		return Array.isArray(this.keys) ? this.keys : [this.keys];
	}

	/** @internal */
	private get _key() {
		const key = this._keys[this.#keyIndex];
		this.#keyIndex = this.#keyIndex + 1 >= this._keys.length ? 0 : this.#keyIndex + 1;
		return key;
	}

	public setKeys(keys: string[]) {
		this.keys = keys;
		return this;
	}

	public async request<T>(
		path: string,
		options: { method?: string; body?: string } = {},
		retries = 0
	): Promise<{ data: T; ok: boolean; status: number; maxAge: number }> {
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
		if (!res?.ok) throw new HTTPError(data, res?.status ?? 504, path, options.method);

		const maxAge = res.headers.get('cache-control')?.split('=')?.[1] ?? 0;
		return { data, ok: res.status === 200, status: res.status, maxAge: Number(maxAge) * 1000 };
	}

	private async getIp() {
		const res = await fetch('https://api.ipify.org/');
		return res.text();
	}

	private async login() {
		const res = await fetch(`${DEV_SITE_API_BASE_URL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: '', password: '' })
		}).catch(() => null);
		const data = await res?.json().catch(() => null);

		if (res && data?.status?.message === 'ok') {
			await this.getKeys(res.headers.get('set-cookie')!);
		}
	}

	private async getKeys(cookie: string) {
		const keyName = 'something';
		const keyCount = 1;

		const res = await fetch(`${DEV_SITE_API_BASE_URL}/apikey/list`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', cookie }
		});
		const data = await res.json();

		const keys = data.keys?.filter((key: { name: string }) => key.name === keyName);
		if (!keys.length) return this.createKey(cookie);

		if (keyCount > 10 - (data.keys.length - keys.length)) {
			// TODO: throw Error
		}

		for (const key of keys as { id: string }[]) await this.revokeKey(key, cookie);
		return Promise.all(
			Array(keyCount)
				.fill(0)
				.map(() => this.createKey(cookie))
		);
	}

	private async revokeKey(key: { id: string }, cookie: string) {
		const res = await fetch(`${DEV_SITE_API_BASE_URL}/apikey/revoke`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', cookie },
			body: JSON.stringify({ id: key.id })
		});

		return res.json().catch(() => null);
	}

	private async createKey(cookie: string) {
		const keyName = 'something';
		const keyDescription = 'some desc';

		const IP = await this.getIp();

		const res = await fetch(`${DEV_SITE_API_BASE_URL}/apikey/create`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', cookie },
			body: JSON.stringify({
				name: keyName,
				description: keyDescription,
				cidrRanges: [IP]
			})
		});

		const data = await res.json();
		if (res.ok && data.key) return data.key.key as string;
		// TODO: throw Error
	}
}

export interface ClientOptions {
	keys?: string[];
	baseURL?: string;
	retryLimit?: number;
	restRequestTimeout?: number;
	credentials?: {
		email: string;
		password: string;
		keyName?: string;
		keyCount?: string;
		keyDescription?: string;
	};
}

export interface SearchOptions {
	limit?: number;
	after?: string;
	before?: string;
}

export interface ClanSearchOptions {
	name?: string;
	minMembers?: number;
	maxMembers?: number;
	minClanPoints?: number;
	minClanLevel?: number;
	warFrequency?: string;
	locationId?: string;
	labelIds?: string;
	limit?: number;
	after?: string;
	before?: string;
}

export interface InitOptions {}
