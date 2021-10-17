const messages: { [key: string]: string } = {
	504: 'The user aborted a request.',
	404: 'Resource was not found.'
};

const reasons: { [key: string]: string } = {
	504: 'networkTimeout',
	404: 'notFound'
};

export class HTTPError extends Error {
	public method: string;
	public reason: string;
	public status: number;
	public path: string;

	public constructor(error: any, status: number, path: string, method: string) {
		super();
		this.message = error?.message ?? messages[status];
		this.reason = error?.reason ?? reasons[status];

		this.path = path;
		this.method = method;
		this.status = status;
	}
}
