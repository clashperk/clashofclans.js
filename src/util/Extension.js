const fetch = require('node-fetch');

/**
 * Extension class for creating Clash of Clans API keys for the external IP the code is running on.
 * @class
 * @example
 * const { Extension } = require('clashofclans.js');
 */
class Extension {
	/**
	 * Extension
	 * @param {ExtensionOptions} options - Required extension options.
	 * @example
	 * (async () => {
	 *      const ext = new Extension({ email: '', password: '' });
	 *      await ext.login();
	 * 		// you would have to run the `login` method just for once.
	 *
	 *      console.log(ext.keys);
	 * })();
	 */
	constructor(options = {}) {
		this._keys = [];
		this.email = options.email;
		this.password = options.password;
		this.keyCount = Math.min(options.keyCount, 10) || 1;
		this.keyName = options.keyName || 'Created by clashofclans.js client';
		this.keyDescription = options.keyDescription || new Date().toUTCString();
		this.baseURL = options.baseURL || 'https://developer.clashofclans.com/api';
	}

	/**
	 * Created Keys
	 * @type {string[]}
	 */
	get keys() {
		return this._keys;
	}

	/**
	 * Initialize Login method.
	 * @returns {string[]}
	 * @throws {Error} Failed to create API Tokens!
	 */
	async login() {
		this._keys = []; // Clear Expired Keys

		const res = await fetch(`${this.baseURL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: this.email, password: this.password })
		});

		const data = await res.json();
		if (data.status && data.status.message === 'ok') {
			await this.getKeys(res.headers.get('set-cookie'));
			return this.keys;
		}
		throw Error(`[Login Failed] email: ${this.email}, password: ${this.password}`);
	}

	async getKeys(cookie) {
		const res = await fetch(`${this.baseURL}/apikey/list`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', cookie }
		});

		const data = await res.json();
		if (!res.ok) {
			throw Error(`Failed to Fetch Keys [${JSON.stringify(data)}]`);
		}
		const keys = data.keys?.filter(key => key.name === this.keyName);
		if (!keys.length) return this.createKey(cookie);

		if (this.keyCount > (10 - (data.keys.length - keys.length))) {
			throw Error(`Insufficient slot to create ${this.keyCount} key(s).`);
		}

		for (const key of keys) await this.revokeKey(key, cookie);
		return Promise.all(Array(this.keyCount).fill(0).map(() => this.createKey(cookie)));
	}

	async revokeKey(key, cookie) {
		const res = await fetch(`${this.baseURL}/apikey/revoke`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', cookie },
			body: JSON.stringify({ id: key.id })
		});

		return res.json().catch(() => null);
	}

	async createKey(cookie) {
		const IP = await this.getIP();
		const res = await fetch(`${this.baseURL}/apikey/create`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', cookie },
			body: JSON.stringify({
				name: this.keyName,
				description: this.keyDescription,
				cidrRanges: [IP]
			})
		});

		const data = await res.json();
		if (res.ok && data.key) {
			return this._keys.push(data.key.key);
		}
		throw Error(`Failed to create API Tokens. IP: ${IP} [${JSON.stringify(data)}]`);
	}

	async getIP() {
		const res = await fetch('https://api.ipify.org/');
		return res.text();
	}
}

module.exports = { Extension };

/**
 * Extension client options
 * @memberof core
 * @typedef {Object} ExtensionOptions
 * @param {string} email Developer account Email
 * @param {string} password Developer account Password
 * @param {number} [keyCount=1] Number of Key(s)
 * @param {string} [keyName='Created by clashofclans.js client'] Name of the Key(s)
 * @param {string} [keyDescription=new Date().toUTCString()] Description of the Key(s)
 * @param {string} [baseURL='https://developer.clashofclans.com/api'] Developer Site Base URL
 */
