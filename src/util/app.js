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
		});

		if (data.status && data.status.message === 'ok') return this.list(data.cookie, await this.getIP());
		throw Error('Invalid email or password.');
	}

	async getIP() {
		const https = require('https');
		const hosts = ['https://api.ipify.org/', 'https://myexternalip.com/raw'];
		const ips = [];
		for (const host of hosts) {
			await new Promise(resolve => {
				const req = https.request(host, {
					method: 'GET',
					timeout: 2000
				}, res => {
					res.on('data', d => {
						resolve(ips.push(d.toString()));
					});
				});
				req.on('timeout', () => req.destroy());
				req.end();
			});
		}
		if (!ips.length) throw Error('Couldn\'t find your IP');
		return ips;
	}

	async list(cookie, ips) {
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
		if (!keys.length) {
			if (data.keys.length === 10) {
				throw Error('Maximum token limit reached!');
			}
			return this.create(cookie, ips);
		}

		for (const key of keys) {
			if (this.autoRevoke) await this.revoke(key, cookie);
		}

		return this.create(cookie, ips);
	}

	async revoke(key, cookies) {
		return new Promise(() => {
			https.request('https://developer.clashofclans.com/api/apikey/revoke', {
				method: 'POST', headers: {
					'Content-Type': 'application/json',
					cookie: cookies
				}
			}, res => {
				if (res.statusCode !== 200) {
					throw Error('Something went wrong');
				}
			}).end(JSON.stringify({ id: key.id }));
		});
	}

	async create(cookies, ips) {
		return new Promise((resolve, reject) => {
			https.request('https://developer.clashofclans.com/api/apikey/create', {
				method: 'POST', headers: {
					'Content-Type': 'application/json',
					cookie: cookies
				}
			}, res => {
				let raw = '';
				res.on('data', chunk => {
					raw += chunk;
				});
				res.on('end', () => {
					if (res.statusCode === 200 && res.headers['content-type'].includes('application/json')) {
						const data = JSON.parse(raw);
						resolve(data.key.key);
					} else {
						reject(Error(raw));
					}
				});
			}).end(JSON.stringify({
				name: this.name,
				description: `CLASH-OF-CLANS-JS | ${new Date().toUTCString()}`,
				cidrRanges: ips
			}));
		});
	}
}

module.exports = Util;
