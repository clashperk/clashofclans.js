const messages: { [key: string]: string } = {
	500: 'Unknown error happened when handling the request.',
	504: 'The user aborted a request.',
	404: 'Resource was not found.',
	400: 'Client provided incorrect parameters for the request.',
	503: 'Service is temporarily unavailable because of maintenance.',
	429: 'Request was throttled, because amount of requests was above the threshold defined for the used API token.',
	403: 'Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.'
};

const reasons: { [key: string]: string } = {
	504: 'networkTimeout',
	404: 'notFound',
	503: 'serviceUnavailable',
	429: 'tooManyRequests',
	400: 'badRequest',
	403: 'forbidden',
	500: 'unknownError'
};

/** Represents an HTTP Error. */
export class HTTPError extends Error {
	public method: string;
	public reason: string;
	public status: number;
	public path: string;

	public constructor(error: any, status: number, path: string, method = 'GET') {
		super();
		this.message = error?.message ?? messages[status];
		this.reason = error?.reason ?? reasons[status];

		this.path = path;
		this.method = method;
		this.status = status;
	}
}
