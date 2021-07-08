## Discord Bot Example

This is an example of a basic Discord bot and some commands.

```js
const Discord = require("discord.js");
const client = new Discord.Client();

const { Client } = require("clashofclans.js");
client.coc = new Client({ keys: [process.env.DEV_TOKEN] });

const prefix = "?";

client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "clan") {
        if (!args[0]) return;

        const data = await client.coc.clan(args[0]);
        if (!data.ok) return;

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${data.name} ${data.tag}`)
            .addField("Level", data.level)
            .setImage(data.badgeUrls.large);

        return message.channel.send({ embed });
    }
});

client.login(process.env.BOT_TOKEN);
```
