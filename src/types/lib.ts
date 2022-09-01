import type { QueueThrottler, BatchThrottler } from '../rest/Throttler';

export type Store<T = any> = {
	clear(): Promise<void> | void;
	delete(key: string): Promise<boolean> | boolean;
	get(key: string): Promise<T | null> | T | null;
	set(key: string, value: T, ttl?: number): Promise<boolean> | boolean;
}

/**
 * Options for a {@link Client}
 */
export type ClientOptions = {
	/**
	 * Base URL of the Clash of Clans API.
	 */
	baseURL?: string;

	/**
	 * Whether enable or disable internal caching.
	 *
	 * @example
	 * ```ts
	 * const client = new Client({ cache: true });
	 * ```
	 */
	cache?: Store | boolean;

	/**
	 * Keys from Clash of Clans API developer site.
	 */
	keys?: string[];

	/**
	 * Time to wait before cancelling a REST request, in milliseconds.
	 */
	restRequestTimeout?: number;

	/**
	 * How many times to retry on 5XX errors.
	 */
	retryLimit?: number;

	/**
	 * Throttler class which handles rate-limit
	 *
	 * @example
	 * ```ts
	 * const client = new Client({ throttler: new QueueThrottler(1000 / 10) });
	 * ```
	 * @example
	 * ```ts
	 * const client = new Client({ throttler: new BatchThrottler(30) });
	 * ```
	 */
	throttler?: BatchThrottler | QueueThrottler | null;
}

/**
 * Options for a {@link RESTManager}
 */
export type RESTOptions = ClientOptions & {
	/**
	 * Set this `false` to use `res.ok` property.
	 */
	rejectIfNotValid?: boolean;
}

/**
 * Options for a {@link RequestHandler}
 */
export type RequestHandlerOptions = ClientOptions & {
	/**
	 * Set this `false` to use `res.ok` property.
	 */
	rejectIfNotValid?: boolean;
}

/**
 * Search options for request.
 */
export type SearchOptions = OverrideOptions & {
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

	/**
	 * Limit the number of items returned in the response.
	 */
	limit?: number;
}

/**
 * Override options for a request.
 */
export type OverrideOptions = {
	/**
	 * Whether to cache this response.
	 */
	cache?: boolean;

	/**
	 * Whether to skip the cache check and request the API.
	 */
	force?: boolean;

	/**
	 * Whether to ignore throttlers.
	 */
	ignoreRateLimit?: boolean;

	/**
	 * Time to wait before cancelling a REST request, in milliseconds.
	 */
	restRequestTimeout?: number;

	/**
	 * How many times to retry on 5XX errors.
	 */
	retryLimit?: number;
}

export type RequestOptions = OverrideOptions & {
	/**
	 * The request body.
	 */
	body?: string;

	/**
	 * The request method.
	 */
	method?: string;
}

export type Response<T> = {
	/**
	 * The response body.
	 */
	data: T;

	/**
	 * The maxAge of this response.
	 */
	maxAge: number;

	/**
	 * Whether the response is ok.
	 */
	ok: boolean;

	/**
	 * Path of the request for this response.
	 */
	path: string;

	/**
	 * HTTP status code of this response.
	 */
	status: number;
}

/**
 * Clan search options for a request.
 *
 * If name is used as part of search query, it needs to be at least three characters long.
 * Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name.
 */
export type ClanSearchOptions = {
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

	/**
	 * Comma separated list of label IDs to use for filtering results.
	 */
	labelIds?: string;

	/**
	 * Limit the number of items returned in the response.
	 */
	limit?: number;

	/**
	 * Filter by clan location identifier. For list of available locations, refer to getLocations operation.
	 */
	locationId?: string;

	/**
	 * Filter by maximum number of clan members.
	 */
	maxMembers?: number;

	/**
	 * Filter by minimum clan level.
	 */
	minClanLevel?: number;

	/**
	 * Filter by minimum amount of clan points.
	 */
	minClanPoints?: number;

	/**
	 * Filter by minimum number of clan members.
	 */
	minMembers?: number;

	/**
	 * Search clans by name.
	 */
	name?: string;

	/**
	 * Filter by clan war frequency.
	 */
	warFrequency?: string;
}

/**
 * Login options for a client.
 */
export type LoginOptions = {
	/**
	 * Developer site email address.
	 */
	email: string;

	/**
	 * Number of allowed API keys.
	 */
	keyCount?: number;

	/**
	 * Description of API key(s).
	 */
	keyDescription?: string;

	/**
	 * Name of API key(s).
	 */
	keyName?: string;

	/**
	 * Developer site password.
	 */
	password: string;
}
