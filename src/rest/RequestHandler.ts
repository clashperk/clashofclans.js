import { EventEmitter } from 'node:events';
import { fetch, Pool } from 'undici';
import { LoginOptions, RequestHandlerOptions, RequestOptions, Response, Store } from '../types';
import { APIBaseURL, DevSiteAPIBaseURL } from '../util/Constants';
import { CacheStore } from '../util/Store';
import { timeoutSignal } from '../util/Util';
import { HTTPError, PrivateWarLogError } from './HTTPError';
import { IRestEvents } from './RESTManager';
import { BatchThrottler, QueueThrottler } from './Throttler';

const IP_REGEX = /\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/g;

export interface RequestHandler {
	emit: (<K extends keyof IRestEvents>(event: K, ...args: IRestEvents[K]) => boolean) &
		(<S extends string | symbol>(event: Exclude<S, keyof IRestEvents>, ...args: any[]) => boolean);

	off: (<K extends keyof IRestEvents>(event: K, listener: (...args: IRestEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IRestEvents>, listener: (...args: any[]) => void) => this);

	on: (<K extends keyof IRestEvents>(event: K, listener: (...args: IRestEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IRestEvents>, listener: (...args: any[]) => void) => this);

	once: (<K extends keyof IRestEvents>(event: K, listener: (...args: IRestEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof IRestEvents>, listener: (...args: any[]) => void) => this);

	removeAllListeners: (<K extends keyof IRestEvents>(event?: K) => this) &
		(<S extends string | symbol>(event?: Exclude<S, keyof IRestEvents>) => this);

	/**
	 * Emitted for general debugging information.
	 * @public
	 * @event
	 */
	debug: string;

	/**
	 * Emitted when the client encounters an error.
	 * @public
	 * @event
	 */
	error: string;

	/**
	 * Emitted when the client is rate limited.
	 * @public
	 * @event
	 */
	rateLimited: string;
}

export type ResponseBody = any;

/** Represents the class that manages handlers for endpoints. */
export class RequestHandler extends EventEmitter {
	#keyIndex = 0; // eslint-disable-line

	private email!: string;
	private password!: string;
	private keyCount!: number;
	private keyName!: string;
	private keyDescription?: string;

	private keys: string[];
	private readonly baseURL: string;
	private readonly rejectIfNotValid: boolean;
	private readonly retryLimit: number;
	private readonly restRequestTimeout: number;
	private readonly throttler?: QueueThrottler | BatchThrottler | null;
	private readonly cached: Store<{ data: unknown; ttl: number; status: number }> | null;

	private readonly dispatcher!: Pool;

	public constructor(options?: RequestHandlerOptions) {
		super();

		this.keys = options?.keys ?? [];
		this.retryLimit = options?.retryLimit ?? 0;
		this.throttler = options?.throttler ?? null;
		this.baseURL = options?.baseURL ?? APIBaseURL;
		this.restRequestTimeout = options?.restRequestTimeout ?? 0;
		this.rejectIfNotValid = options?.rejectIfNotValid ?? true;
		if (typeof options?.cache === 'object') this.cached = options.cache;
		else this.cached = options?.cache === true ? new CacheStore() : null;

		this.dispatcher = new Pool(new URL(this.baseURL).origin, {
			connections: options?.connections ?? null,
			pipelining: options?.pipelining ?? 1
		});
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

	private get creds() {
		return Boolean(this.email && this.password);
	}

	public async request<T>(path: string, options: RequestOptions = {}): Promise<Response<T>> {
		const cached = this.cached ? (await this.cached.get(path)) ?? null : null;
		if (cached && options.force !== true) {
			return { data: cached.data as T, maxAge: cached.ttl - Date.now(), status: cached.status, path, ok: cached.status === 200 };
		}

		if (!this.throttler || options.ignoreRateLimit) return this.exec<T>(path, options);

		await this.throttler.wait();
		return this.exec<T>(path, options);
	}

	private async exec<T>(path: string, options: RequestOptions = {}, retries = 0): Promise<Response<T>> {
		try {
			const res = await this.dispatcher.request({
				path: `/v1${path}`,
				body: options.body,
				method: 'GET',
				signal: timeoutSignal(options.restRequestTimeout ?? this.restRequestTimeout),
				headers: { 'Authorization': `Bearer ${this._key}`, 'Content-Type': 'application/json' }
			});

			if (res.statusCode === 504 && retries < (options.retryLimit ?? this.retryLimit)) {
				return await this.exec<T>(path, options, ++retries);
			}
			const data = (await res.body.json()) as ResponseBody;

			if (
				this.creds &&
				res.statusCode === 403 &&
				data?.reason === 'accessDenied.invalidIp' &&
				retries < (options.retryLimit ?? this.retryLimit)
			) {
				const keys = await this.reValidateKeys().then(() => () => this.login());
				if (keys.length) return await this.exec<T>(path, options, ++retries);
			}

			const maxAge = Number((res.headers['cache-control'] as string | null)?.split('=')?.[1] ?? 0) * 1000;

			if (res.statusCode === 403 && !data?.message && this.rejectIfNotValid) {
				throw new HTTPError(PrivateWarLogError, res.statusCode, path, maxAge);
			}
			if (res.statusCode !== 200 && this.rejectIfNotValid) {
				throw new HTTPError(data, res.statusCode, path, maxAge, options.method);
			}
			if (this.cached && maxAge > 0 && options.cache !== false && res.statusCode === 200) {
				await this.cached.set(path, { data, ttl: Date.now() + maxAge, status: res.statusCode }, maxAge);
			}
			return { data: data as T, maxAge, status: res.statusCode, path, ok: res.statusCode === 200 };
		} catch (error: any) {
			if (error.code === 'UND_ERR_ABORTED' && retries < (options.retryLimit ?? this.retryLimit)) {
				return this.exec<T>(path, options, ++retries);
			}
			if (this.rejectIfNotValid) throw error;
			return { data: { message: error.message } as unknown as T, maxAge: 0, status: 500, path, ok: false };
		}
	}

	public async init(options: LoginOptions) {
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
				signal: timeoutSignal(this.restRequestTimeout),
				headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' }
			}).catch(() => null);

			if (res?.status === 403) {
				const index = this.keys.indexOf(key);
				this.keys.splice(index, 1);
				process.emitWarning(`Key #${index + 1} is no longer valid. Removed from the key list.`);
			}
		}
	}

	private async login() {
		const res = await fetch(`${DevSiteAPIBaseURL}/login`, {
			method: 'POST',
			signal: timeoutSignal(this.restRequestTimeout),
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: this.email, password: this.password })
		});

		const data = (await res.json()) as ResponseBody;
		if (!res.ok) throw new Error(`Invalid email or password. ${JSON.stringify(data)}`);

		const ip = await this.getIp(data.temporaryAPIToken as string);
		if (!ip) throw new Error('Failed to get the IP address.');

		return this.getKeys(res.headers.get('set-cookie')!, ip);
	}

	private async getKeys(cookie: string, ip: string) {
		const res = await fetch(`${DevSiteAPIBaseURL}/apikey/list`, {
			method: 'POST',
			signal: timeoutSignal(this.restRequestTimeout),
			headers: { 'Content-Type': 'application/json', cookie }
		});
		const data = (await res.json()) as ResponseBody;
		if (!res.ok) throw new Error(`Failed to retrieve the API Keys. ${JSON.stringify(data)}`);

		// Get all available keys from the developer site.
		const keys = (data.keys ?? []) as { id: string; name: string; key: string; cidrRanges?: string[] }[];

		// Revoke keys for specified key name but not matching current IP address.
		for (const key of keys.filter((key) => key.name === this.keyName && !key.cidrRanges?.includes(ip))) {
			if (!(await this.revokeKey(key.id, cookie))) continue;
			const index = keys.findIndex(({ id }) => id === key.id);
			keys.splice(index, 1);
		}

		// Filter keys for current IP address and specified key name.
		for (const key of keys.filter((key) => key.name === this.keyName && key.cidrRanges?.includes(ip))) {
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
		const res = await fetch(`${DevSiteAPIBaseURL}/apikey/revoke`, {
			method: 'POST',
			signal: timeoutSignal(this.restRequestTimeout),
			body: JSON.stringify({ id: keyId }),
			headers: { 'Content-Type': 'application/json', cookie }
		});

		return res.ok;
	}

	private async createKey(cookie: string, ip: string) {
		const res = await fetch(`${DevSiteAPIBaseURL}/apikey/create`, {
			method: 'POST',
			signal: timeoutSignal(this.restRequestTimeout),
			headers: { 'Content-Type': 'application/json', cookie },
			body: JSON.stringify({
				cidrRanges: [ip],
				name: this.keyName,
				description: this.keyDescription ?? new Date().toUTCString()
			})
		});

		const data = (await res.json()) as ResponseBody;
		if (!res.ok) throw new Error(`Failed to create API Key. ${JSON.stringify(data)}`);
		return data.key as { id: string; name: string; key: string; cidrRanges?: string[] };
	}

	private async getIp(token: string): Promise<string | null> {
		try {
			const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
			const props = decoded.limits.find((limit: { cidrs: string[] }) => limit.hasOwnProperty('cidrs'));
			return (props.cidrs[0] as string).match(IP_REGEX)![0];
		} catch {
			const body = await fetch('https://api.ipify.org', {
				signal: timeoutSignal(this.restRequestTimeout)
			}).then((res) => res.text());
			return body.match(IP_REGEX)?.[0] ?? null;
		}
	}
}
