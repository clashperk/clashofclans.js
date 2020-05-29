const Util = require('./util/app');
module.exports = {
	Client: require('./client'),
	version: require('../package.json').version,
	async createToken({ email, password, name = null, autoRevoke = true } = {}) {
		return new Util({ email, password, name, autoRevoke }).login();
	}
};
