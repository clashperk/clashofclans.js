const messages: { [key: string]: string } = {
	500: 'Unknown error happened when handling the request.',
	504: 'The user aborted this request.',
	404: 'Requested resource was not found.',
	400: 'Client provided incorrect parameters for the request.',
	503: 'Service is temporarily unavailable because of maintenance.',
	429: 'Request was throttled, because amount of requests was above the threshold defined for the used API token.',
	403: 'Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.'
};

const reasons: { [key: string]: string } = {
	503: 'serviceUnavailable',
	429: 'tooManyRequests',
	400: 'badRequest',
	403: 'forbidden',
	500: 'unknownError',
	404: 'notFound',
	504: 'requestAborted'
};

/**
 * Represents an HTTP Error.
 */
export class HTTPError extends Error {
	/** The message of this error. */
	public message: string;

	/** The HTTP method of this request. */
	public method: string;

	/** The reason of this error. */
	public reason: string;

	/** The HTTP status code of this request. */
	public status: number;

	/** The path of this request. */
	public path: string;

	/** Maximum number of milliseconds the results can be cached. */
	public maxAge: number;

	public constructor(error: any, status: number, path: string, maxAge: number, method?: string) {
		super();
		this.message = error?.message ?? messages[status];
		this.reason = error?.reason ?? reasons[status];
		this.path = path;
		this.method = method ?? 'GET';
		this.status = status;
		this.maxAge = maxAge;
	}
}

export const NotInWarError = {
	message: 'Clan is not in war at this moment.',
	reason: 'notInWar'
};

export const PrivateWarLogError = {
	message: 'Access denied, clan war log is private.',
	reason: 'privateWarLog'
};
