const https = require('https');

class Util {
	constructor(option) {
		this.email = option.email;
		this.password = option.password;
		this.name = option.name || 'CLASH_OF_CLANS_JS_TOKEN';
		this.autoRevoke = Boolean(option.autoRevoke);
		if (!option.email || !option.password) throw Error('Can\'t login without email and password.');
	}

	async login() {
		const data = await new Promise((resolve, reject) => {
			https.request('https://developer.clashofclans.com/api/login', {
				method: 'POST', headers: {
					'Content-Type': 'application/json'
				}
			}, res => {
				if (res.statusCode === 200) {
					https.request('https://developer.clashofclans.com/api/login', {
						method: 'POST', headers: {
							'Content-Type': 'application/json'
						}
					}, res => {
						let raw = '';
						res.on('data', chunk => {
							raw += chunk;
						});
						res.on('end', () => {
							if (res.statusCode === 200 && res.headers['content-type'].includes('application/json')) {
								const data = JSON.parse(raw);
								resolve(Object.assign(data, { cookie: res.headers['set-cookie'] }));
							} else {
								reject(Error(raw));
							}
						});
					}).end(JSON.stringify({ email: this.email, password: this.password }));
				} else {
					reject(Error('Invalid email or password.'));
				}
			}).end(JSON.stringify({ email: this.email, password: this.password }));
		});

		if (data.status && data.status.message === 'ok') return this.list(data.cookie, data.developer.prevLoginIp);
		throw Error('Invalid email or password.');
	}

	async list(cookie, IP) {
		const data = await new Promise((resolve, reject) => {
			https.request('https://developer.clashofclans.com/api/apikey/list', {
				method: 'POST', headers: {
					'Content-Type': 'application/json',
					cookie
				}
			}, res => {
				let raw = '';
				res.on('data', chunk => {
					raw += chunk;
				});
				res.on('end', () => {
					if (res.statusCode === 200 && res.headers['content-type'].includes('application/json')) {
						const data = JSON.parse(raw);
						resolve(data);
					} else {
						reject(Error(raw));
					}
				});
			}).end();
		});

		const keys = data.keys.filter(key => key.name === this.name);
		const item = data.keys.find(key => key.cidrRanges.includes(IP));
		if (item) {
			process.env.CLASHOFCLANS_JS_TOKEN = item.key;
			return item.key;
		}

		if (!keys.length) {
			if (data.keys.length === 10) {
				throw Error('Maximum token limit reached!');
			}
			return this.create(cookie, IP);
		}

		for (const key of keys) {
			if (this.autoRevoke) await this.revoke(key, cookie);
		}

		return this.create(cookie, IP);
	}

	async revoke(key, cookie) {
		return new Promise((resolve, reject) => {
			https.request('https://developer.clashofclans.com/api/apikey/revoke', {
				method: 'POST', headers: {
					'Content-Type': 'application/json', cookie
				}
			}, res => {
				if (res.statusCode !== 200) {
					throw Error('Something went wrong');
				}
			}).end(JSON.stringify({ id: key.id }));
		});
	}

	async create(cookie, IP) {
		return new Promise((resolve, reject) => {
			https.request('https://developer.clashofclans.com/api/apikey/create', {
				method: 'POST', headers: {
					'Content-Type': 'application/json',
					cookie
				}
			}, res => {
				let raw = '';
				res.on('data', chunk => {
					raw += chunk;
				});
				res.on('end', () => {
					if (res.statusCode === 200 && res.headers['content-type'].includes('application/json')) {
						const data = JSON.parse(raw);
						process.env.CLASHOFCLANS_JS_TOKEN = data.key.key;
						resolve(data.key.key);
					} else {
						reject(Error(raw));
					}
				});
			}).end(JSON.stringify({
				name: this.name,
				description: `Creator: clashofclans.js | Date: ${new Date().toUTCString()}`,
				cidrRanges: [IP]
			}));
		});
	}
}

module.exports = Util;
