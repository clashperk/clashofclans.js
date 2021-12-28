import { QueueThrottler, BatchThrottler } from '../rest/Throttler';
import Keyv from 'keyv';

/** Options for a Client. */
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

/** Options for a RESTManager. */
export interface RESTOptions extends ClientOptions {
	/** Set this `false` to use `res.ok` property. */
	rejectIfNotValid?: boolean;
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
	/** Whether the response is ok. */
	ok: boolean;

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
 * If name is used as part of search query, it needs to be at least three characters long.
 * Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name.
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
export interface LoginOptions {
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
