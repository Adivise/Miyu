const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Connectors } = require("shoukaku");
const { Kazagumo, Plugins } = require("kazagumo");

const client = new Client({
    shards: "auto",
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ],
    allowedMentions: { parse: ["users", "roles"] },
});

client.config = require("./settings/config.js");
client.prefix = client.config.PREFIX;
client.owner = client.config.OWNER_ID;
client.color = client.config.EMBED_COLOR;
if(!client.token) client.token = client.config.TOKEN;

client.manager = new Kazagumo({
    defaultSearchEngine: client.config.SEARCH_ENGINE, // 'youtube' | 'soundcloud' | 'youtube_music'
    plugins: [new Plugins.PlayerMoved(client)],
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), client.config.NODES);

["commands"].forEach(x => client[x] = new Collection());
["loadCommand", "loadEvent", "loadPlayer", "loadTrack"].forEach(x => require(`./handlers/${x}`)(client));

client.login(client.token);