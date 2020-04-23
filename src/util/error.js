const messages = {
	504: '504 Request Timeout.',
	400: 'Client provided incorrect parameters for the request.',
	403: 'Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.',
	404: 'Resource was not found.',
	429: 'Request was throttled, because amount of requests was above the threshold defined for the used API token.',
	500: 'Unknown error happened when handling the request.',
	503: 'Service is temprorarily unavailable because of maintenance.'
};

/**
 * Represents an error for Clash of Clans API
 * @param {string} status - Error status.
 * @param {...any} args - Arguments.
 * @extends {Error}
 */
class APIError extends Error {
	constructor(status, ...args) {
		if (messages[status] == null) throw new TypeError(`ERROR STATUS '${status}' DOES NOT EXIST`);
		const message = typeof messages[status] === 'function'
			? messages[status](...args)
			: messages[status];

		super(message);
		this.code = status;
		this.message = message;
	}

	get name() {
		return `APIError [${this.code}]`;
	}

	get status() {
		return this.status;
	}

	get message() {
		return this.message;
	}
}

module.exports = APIError;
