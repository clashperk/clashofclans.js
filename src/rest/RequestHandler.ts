import { API_BASE_URL, DEV_SITE_API_BASE_URL } from '../util/Constants';
import { QueueThrottler, BatchThrottler } from './Throttler';
import { HTTPError } from './HTTPError';
import fetch from 'node-fetch';
import https from 'https';
import Keyv from 'keyv';

const agent = new https.Agent({ keepAlive: true });

/** Represents a Request Handler. */
export class RequestHandler {
	#keyIndex = 0; // eslint-disable-line

	private email!: string;
	private password!: string;
	private keyCount!: number;
	private keyName!: string;
	private keyDescription?: string;

	private keys: string[];
	private readonly baseURL: string;
	private readonly retryLimit: number;
	private readonly cached: Keyv | null;
	private readonly restRequestTimeout: number;
	private readonly throttler?: QueueThrottler | BatchThrottler | null;

	public constructor(options?: ClientOptions) {
		this.keys = options?.keys ?? [];
		this.retryLimit = options?.retryLimit ?? 0;
		this.throttler = options?.throttler ?? null;
		this.baseURL = options?.baseURL ?? API_BASE_URL;
		this.restRequestTimeout = options?.restRequestTimeout ?? 0;
		if (options?.cache instanceof Keyv) this.cached = options.cache;
		else this.cached = options?.cache ? new Keyv() : null;
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

	public async request<T>(path: string, options: RequestOptions = {}) {
		const cached = (await this.cached?.get(path)) ?? null;
		if (cached && options.force !== true) return { data: cached as T, maxAge: 0, status: 200 };

		if (!this.throttler || options.ignoreRateLimit) return this.exec<T>(path, options);
		await this.throttler.wait();

		try {
			return await this.exec<T>(path, options);
		} finally {
			await this.throttler.throttle();
		}
	}

	private async exec<T>(path: string, options: RequestOptions = {}, retries = 0): Promise<{ data: T; maxAge: number; status: number }> {
		const res = await fetch(`${this.baseURL}${path}`, {
			agent,
			body: options.body,
			method: options.method,
			timeout: options.restRequestTimeout ?? this.restRequestTimeout,
			headers: { 'Authorization': `Bearer ${this._key}`, 'Content-Type': 'application/json' }
		}).catch(() => null);

		const data = await res?.json().catch(() => null);
		if (!res && retries < (options.retryLimit ?? this.retryLimit)) return this.exec<T>(path, options, ++retries);

		if (res?.status === 403 && data?.reason === 'accessDenied.invalidIp' && this.email && this.password) {
			await this.login();
			return this.exec<T>(path, options, ++retries);
		}
		if (!res?.ok) throw new HTTPError(data, res?.status ?? 504, path, options.method);

		const maxAge = Number(res.headers.get('cache-control')?.split('=')?.[1] ?? 0) * 1000;
		if (this.cached && maxAge > 0 && options.cache !== false) await this.cached.set(path, data, maxAge);
		return { data, maxAge, status: res.status };
	}

	public async init(options: InitOptions) {
		if (!(options.email && options.password)) throw ReferenceError('Missing email and password.');

		this.keyDescription = options.keyDescription;
		this.keyName = options.keyName ?? 'clashofclans.js.keys';
		this.keyCount = Math.min(options.keyCount ?? 1, 10);
		this.password = options.password;
		this.email = options.email;

		await this.reValidateKeys();
		return this.login();
	}

	private async reValidateKeys() {
		for (const key of this.keys) {
			const res = await fetch(`${this.baseURL}/locations`, {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' }
			});
			if (res.status === 403) {
				const index = this.keys.indexOf(key);
				this.keys.splice(index, 1);
				console.warn(`[WARN] Pre-defined key #${index + 1} is no longer valid. Removed from the key list.`);
			}
		}
	}

	private async login() {
		const res = await fetch(`${DEV_SITE_API_BASE_URL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: this.email, password: this.password })
		});

		if (res.ok) {
			return this.getKeys(res.headers.get('set-cookie')!);
		}
		throw new ReferenceError('Invalid email or password.');
	}

	private async getKeys(cookie: string) {
		const ip = await this.getIp();
		const res = await fetch(`${DEV_SITE_API_BASE_URL}/apikey/list`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', cookie }
		});
		const data = await res.json();

		// Get all available keys from the developer site.
		const keys = (data.keys ?? []) as { id: string; name: string; key: string; cidrRanges: string[] }[];

		// Revoke keys for specified key name but not matching current IP address.
		const expiredKeys = keys.filter((key) => key.name === this.keyName && !key.cidrRanges.includes(ip));
		for (const key of expiredKeys) {
			if (!(await this.revokeKey(key.id, cookie))) continue;
			const index = keys.findIndex(({ id }) => id === key.id);
			keys.splice(index, 1);
		}

		// Filter keys for current IP address and specified key name.
		for (const key of keys.filter((key) => key.name === this.keyName && key.cidrRanges.includes(ip))) {
			if (this.keys.length >= this.keyCount) break;
			if (!this.keys.includes(key.key)) this.keys.push(key.key);
		}

		// Create keys within limits (maximum of 10 keys per account)
		while (this.keys.length < this.keyCount && keys.length < 10) {
			const key = await this.createKey(cookie, ip);
			this.keys.push(key.key);
			keys.push(key);
		}

		if (this.keys.length < this.keyCount && keys.length === 10) {
			console.warn(
				`[WARN] ${this.keyCount} key(s) were requested but failed to create ${this.keyCount - this.keys.length} more key(s).`
			);
		}

		if (!this.keys.length) {
			throw new Error(
				[
					`${keys.length} API keys were created but none match a key name of "${this.keyName}" and IP "${ip}".`,
					`Specify a key name or go to "https://developer.clashofclans.com" to delete unused keys.`
				].join(' ')
			);
		}

		return this.keys;
	}

	private async revokeKey(keyId: string, cookie: string) {
		const res = await fetch(`${DEV_SITE_API_BASE_URL}/apikey/revoke`, {
			method: 'POST',
			body: JSON.stringify({ id: keyId }),
			headers: { 'Content-Type': 'application/json', cookie }
		});

		return res.ok;
	}

	private async createKey(cookie: string, ip: string) {
		const res = await fetch(`${DEV_SITE_API_BASE_URL}/apikey/create`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', cookie },
			body: JSON.stringify({
				cidrRanges: [ip],
				name: this.keyName,
				description: this.keyDescription ?? new Date().toUTCString()
			})
		});

		const data = await res.json();
		return data.key as { id: string; name: string; key: string; cidrRanges: string[] };
	}

	private async getIp() {
		return fetch('https://api.ipify.org/').then((res) => res.text());
	}
}

export interface ClientOptions {
	keys?: string[];
	baseURL?: string;
	retryLimit?: number;
	cache?: boolean | Keyv;
	restRequestTimeout?: number;
	throttler?: QueueThrottler | BatchThrottler;
}

export interface SearchOptions extends OverrideOptions {
	limit?: number;
	after?: string;
	before?: string;
}

export interface OverrideOptions {
	cache?: boolean;
	force?: boolean;
	retryLimit?: string;
	ignoreRateLimit?: boolean;
	restRequestTimeout?: number;
}

export interface RequestOptions extends OverrideOptions {
	body?: string;
	method?: string;
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

export interface InitOptions {
	email: string;
	password: string;
	keyName?: string;
	keyCount?: number;
	keyDescription?: string;
}
