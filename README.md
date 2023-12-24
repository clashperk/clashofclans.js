<div align="center">

[![Logo](https://i.imgur.com/RHkfYVm.png.png)](https://clashofclans.js.org/)

### JavaScript library for interacting with the Clash of Clans API

[![ESLint](https://github.com/clashperk/clashofclans.js/actions/workflows/eslint.yml/badge.svg)](https://github.com/clashperk/clashofclans.js/actions/workflows/node.js.yml)
[![Logo](https://img.shields.io/npm/v/clashofclans.js.svg?maxAge=3600)](https://www.npmjs.com/package/clashofclans.js)

</div>

### Installation

- **`npm i clashofclans.js`**
- **Node.js v16 or newer is required.**

### Links

- [Documentation](https://clashofclans.js.org/docs/)
- [Clash of Clans Developer Website](https://developer.clashofclans.com/)
- [Clash of Clans API Community Discord](https://discord.gg/Eaja7gJ)

### Examples

```js
const { Client } = require('clashofclans.js');
```

#### Login with Email Password

```js
const client = new Client();

(async function () {
  // This method should be called once when application starts.
  await client.login({ email: 'developer@email.com', password: '***' });

  const clan = await client.getClan('#2PP');
  console.log(`${clan.name} (${clan.tag})`);
})();
```

#### Login with API Keys

```js
const client = new Client({ keys: ['api_key_goes_here'] });

(async function () {
  const clan = await client.getClan('#2PP');
  console.log(`${clan.name} (${clan.tag})`);
})();
```

### Events

The API lacks socket-based real-time events. It is recommended to implement your own custom polling system.
Pull data at specified intervals, compare with previous values, and emit events on change.
Consider using Node.js clusters and threads for efficient parallel processing.

### Disclaimer

> This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see [Supercell's Fan Content Policy](https://supercell.com/en/fan-content-policy/).
