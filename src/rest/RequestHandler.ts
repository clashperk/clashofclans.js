import { API_BASE_URL, DEV_SITE_API_BASE_URL } from '../util/Constants';
import { QueueThrottler, BatchThrottler } from './Throttler';
import { HTTPError, PrivateWarLogError } from './HTTPError';
import fetch from 'node-fetch';
import https from 'https';
import Keyv from 'keyv';

const IP_REGEX = /\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/g;

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
	private readonly restRequestTimeout: number;
	private readonly throttler?: QueueThrottler | BatchThrottler | null;
	private readonly cached: Keyv<{ data: unknown; ttl: number }> | null;

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

	public async request<T>(path: string, options: RequestOptions = {}): Promise<Response<T>> {
		const cached = (await this.cached?.get(path)) ?? null;
		if (cached && options.force !== true) {
			return { data: cached.data as T, maxAge: cached.ttl - Date.now(), status: 200, path };
		}

		if (!this.throttler || options.ignoreRateLimit) return this.exec<T>(path, options);

		await this.throttler.wait();
		try {
			return await this.exec<T>(path, options);
		} finally {
			await this.throttler.throttle();
		}
	}

	private async exec<T>(path: string, options: RequestOptions = {}, retries = 0): Promise<Response<T>> {
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
			const keys = await this.reValidateKeys().then(() => this.login());
			if (keys.length) return this.exec<T>(path, options, ++retries);
		}

		const maxAge = Number(res?.headers.get('cache-control')?.split('=')?.[1] ?? 0) * 1000;
		if (res?.status === 403 && !data?.message) throw new HTTPError(PrivateWarLogError, res.status, path, maxAge);
		if (!res?.ok) throw new HTTPError(data, res?.status ?? 504, path, maxAge, options.method);

		if (this.cached && maxAge > 0 && options.cache !== false) {
			await this.cached.set(path, { data, ttl: Date.now() + maxAge }, maxAge);
		}
		return { data, maxAge, status: res.status, path };
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
			const res = await fetch(`${this.baseURL}/locations?limit=1`, {
				method: 'GET',
				timeout: 10_000,
				headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' }
			}).catch(() => null);

			if (res?.status === 403) {
				const index = this.keys.indexOf(key);
				this.keys.splice(index, 1);
				process.emitWarning(`Pre-defined key #${index + 1} is no longer valid. Removed from the key list.`);
			}
		}
	}

	private async login() {
		const res = await fetch(`${DEV_SITE_API_BASE_URL}/login`, {
			method: 'POST',
			timeout: 10_000,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: this.email, password: this.password })
		});

		const data = await res.json();
		if (!res.ok) throw new Error(`Invalid email or password. ${JSON.stringify(data)}`);

		const ip = await this.getIp(data.temporaryAPIToken as string);
		if (!ip) throw new Error('Failed to get the IP address.');

		return this.getKeys(res.headers.get('set-cookie')!, ip);
	}

	private async getKeys(cookie: string, ip: string) {
		const res = await fetch(`${DEV_SITE_API_BASE_URL}/apikey/list`, {
			method: 'POST',
			timeout: 10_000,
			headers: { 'Content-Type': 'application/json', cookie }
		});
		const data = await res.json();
		if (!res.ok) throw new Error(`Failed to retrieve the API Keys. ${JSON.stringify(data)}`);

		// Get all available keys from the developer site.
		const keys = (data.keys ?? []) as { id: string; name: string; key: string; cidrRanges: string[] }[];

		// Revoke keys for specified key name but not matching current IP address.
		for (const key of keys.filter((key) => key.name === this.keyName && !key.cidrRanges.includes(ip))) {
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
			process.emitWarning(
				`${this.keyCount} key(s) were requested but failed to create ${this.keyCount - this.keys.length} more key(s).`
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
			timeout: 10_000,
			body: JSON.stringify({ id: keyId }),
			headers: { 'Content-Type': 'application/json', cookie }
		});

		return res.ok;
	}

	private async createKey(cookie: string, ip: string) {
		const res = await fetch(`${DEV_SITE_API_BASE_URL}/apikey/create`, {
			method: 'POST',
			timeout: 10_000,
			headers: { 'Content-Type': 'application/json', cookie },
			body: JSON.stringify({
				cidrRanges: [ip],
				name: this.keyName,
				description: this.keyDescription ?? new Date().toUTCString()
			})
		});

		const data = await res.json();
		if (!res.ok) throw new Error(`Failed to create API Key. ${JSON.stringify(data)}`);
		return data.key as { id: string; name: string; key: string; cidrRanges: string[] };
	}

	private async getIp(token: string): Promise<string | null> {
		try {
			const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
			const props = decoded.limits.find((limit: { cidrs: string[] }) => limit.hasOwnProperty('cidrs'));
			return (props.cidrs[0] as string).match(IP_REGEX)![0];
		} catch {
			const body = await fetch('https://api.ipify.org', { timeout: 10_000 }).then((res) => res.text());
			return body.match(IP_REGEX)?.[0] ?? null;
		}
	}
}

/** Options for a client. */
export interface ClientOptions {
	/** Keys from Clash of Clans API developer site. */
	keys?: string[];

	/** Base URL of the Clash of Clans API. */
	baseURL?: string;

	/**
	 * How many times to retry on 5XX errors.
	 */
	retryLimit?: number;

	/**
	 * Whether enable or disable internal caching.
	 * @example
	 * ```ts
	 * const client = new Client({ cache: true });
	 * ```
	 */
	cache?: boolean | Keyv;

	/** Time to wait before cancelling a REST request, in milliseconds. */
	restRequestTimeout?: number;

	/**
	 * Throttler class which handles rate-limit
	 * @example
	 * ```ts
	 * const client = new Client({ throttler: new QueueThrottler(1000 / 10) });
	 * ```
	 * @example
	 * ```ts
	 * const client = new Client({ throttler: new BatchThrottler(30) });
	 * ```
	 */
	throttler?: QueueThrottler | BatchThrottler;
}

/** Search options for request. */
export interface SearchOptions extends OverrideOptions {
	/** Limit the number of items returned in the response. */
	limit?: number;

	/**
	 * Return only items that occur after this marker.
	 * Before marker can be found from the response, inside the 'paging' property.
	 * Note that only after or before can be specified for a request, not both.
	 */
	after?: string;

	/**
	 * Return only items that occur before this marker.
	 * Before marker can be found from the response, inside the 'paging' property.
	 * Note that only after or before can be specified for a request, not both.
	 */
	before?: string;
}

/** Override options for a request. */
export interface OverrideOptions {
	/** Whether to cache this response. */
	cache?: boolean;

	/** Whether to skip the cache check and request the API. */
	force?: boolean;

	/** How many times to retry on 5XX errors. */
	retryLimit?: string;

	/** Whether to ignore throttlers. */
	ignoreRateLimit?: boolean;

	/** Time to wait before cancelling a REST request, in milliseconds. */
	restRequestTimeout?: number;
}

export interface RequestOptions extends OverrideOptions {
	/** The request body. */
	body?: string;

	/** The request method. */
	method?: string;
}

export interface Response<T> {
	/** The response body. */
	data: T;

	/** Path of the request for this response. */
	path: string;

	/** HTTP status code of this response. */
	status: number;

	/** The maxAge of this response. */
	maxAge: number;
}

/**
 * Clan search options for a request.
 *
 * ::info
 * If name is used as part of search query, it needs to be at least three characters long.
 * Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name.
 * :::
 */
export interface ClanSearchOptions {
	/** Search clans by name. */
	name?: string;

	/** Filter by minimum number of clan members. */
	minMembers?: number;

	/** Filter by maximum number of clan members. */
	maxMembers?: number;

	/** Filter by minimum amount of clan points. */
	minClanPoints?: number;

	/** Filter by minimum clan level. */
	minClanLevel?: number;

	/** Filter by clan war frequency. */
	warFrequency?: string;

	/** Filter by clan location identifier. For list of available locations, refer to getLocations operation. */
	locationId?: string;

	/** Comma separated list of label IDs to use for filtering results. */
	labelIds?: string;

	/** Limit the number of items returned in the response. */
	limit?: number;

	/**
	 * Return only items that occur after this marker.
	 * Before marker can be found from the response, inside the 'paging' property.
	 * Note that only after or before can be specified for a request, not both.
	 */
	after?: string;

	/**
	 * Return only items that occur before this marker.
	 * Before marker can be found from the response, inside the 'paging' property.
	 * Note that only after or before can be specified for a request, not both.
	 */
	before?: string;
}

/** Login options for a client. */
export interface InitOptions {
	/** Developer site email address. */
	email: string;

	/** Developer site password. */
	password: string;

	/** Name of API key(s). */
	keyName?: string;

	/** Number of allowed API keys. */
	keyCount?: number;

	/** Description of API key(s). */
	keyDescription?: string;
}
