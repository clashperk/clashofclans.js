<div align="center">

[![Logo](https://i.imgur.com/RHkfYVm.png.png)](https://clashofclans.js.org/)

### JavaScript library for interacting with the Clash of Clans API

[![ESLint](https://github.com/clashperk/clashofclans.js/actions/workflows/eslint.yml/badge.svg)](https://github.com/clashperk/clashofclans.js/actions/workflows/node.js.yml)
[![Logo](https://img.shields.io/npm/v/clashofclans.js.svg?maxAge=3600)](https://www.npmjs.com/package/clashofclans.js)

</div>

### Installation

-   **`npm i clashofclans.js`**
-   **Node.js v14 or newer is required.**

### Links

-   [Documentation](https://clashofclans.js.org/docs/)
-   [Clash of Clans Developer Website](https://developer.clashofclans.com/)
-   [Clash of Clans API Community Discord](https://discord.gg/Eaja7gJ)

### Examples

```js
const { Client } = require('clashofclans.js');
const client = new Client();
// const client = new Client({ keys: [], cache: true, retryLimit: 2, restRequestTimeout: 5000 });

(async function () {
    await client.login({ email: 'developer@email.com', password: '***' });

    const clan = await client.getClan('#2PP');
    console.log(`${clan.name} (${clan.tag})`);
})();
```

### Custom Polling Event

> **Warning** <br />
> Events are neither real-time nor supported by the API. They are polled frequently and compared with the cached data. If there is a difference, the event is emitted.

```js
const { PollingClient, BatchThrottler } = require('clashofclans.js');
const pollingClient = new PollingClient({
    cache: true,
    retryLimit: 1,
    restRequestTimeout: 5000,
    throttler: new BatchThrottler(20)
});

pollingClient.addClans(['#8QU8J9LP', '#8P2QG08P']);
pollingClient.setClanEvent({
    name: 'clanDescriptionChange',
    filter: (oldClan, newClan) => {
        return oldClan.description !== newClan.description;
    }
});

pollingClient.on('clanDescriptionChange', (oldClan, newClan) => {
    console.log(oldClan.description, newClan.description);
});

(async function () {
    await pollingClient.login({ email: 'developer@email.com', password: '***' });
    await pollingClient.init();
})();
```

### Disclaimer

> This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see [Supercell's Fan Content Policy](https://supercell.com/en/fan-content-policy/).
