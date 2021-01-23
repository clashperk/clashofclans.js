# Powerful JavaScript library for interacting with the Clash of Clans API

## Installation
- **Node.js v14.0.0 or newer is required.**
- **NPM `npm install clashofclans.js`**

## Example

```js
(async function() {
	// Search clan
	const data = await client.clan('#8QU8J9LP');
	console.log(data);

	// Verify Player API Token
	await client.verifyPlayer('#9Q92C8R20', 'pd3NN9x2');
})();
```

## Links

- [GitHub Repository](https://github.com/clashperk/clashofclans.js)
- [Full Documentation](https://github.com/clashperk/clashofclans.js#readme)

## License
**MIT License**

**Copyright (c) 2020 - 2021 ClashPerk**