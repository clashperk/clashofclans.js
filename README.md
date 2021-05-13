# Powerful JavaScript library for interacting with the Clash of Clans API

## Installation
- **Node.js v14.0.0 or newer is required.**
- **NPM Version `npm i clashofclans.js`**

## Example

```js
const { Client } = require('clashofclans.js');
const client = new Client({ token: '', timeout: 5000 });

(async function() {
	// Search Clan
	const data = await client.clan('#8QU8J9LP');
	console.log(data);

	// Verify Player API Token
	const token = await client.verifyPlayerToken('#9Q92C8R20', 'pd3NN9x2');
	if (token.status === 'ok') console.log('Verified!');
})();
```

## Links

- [GitHub Repository](https://github.com/clashperk/clashofclans.js)
- [Full Documentation](https://github.com/clashperk/clashofclans.js#readme)

## License
**MIT License**

**Copyright (c) 2020 - 2021 ClashPerk**