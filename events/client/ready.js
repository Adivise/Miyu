const { Client } = require("discord.js");

module.exports = async (client) => {
    console.log(`[INFO] - ${client.user.username} (${client.user.id}) is Ready!`);

    const activity = {
        name: `${client.prefix}play <songs>`,
        type: 5,
    };

    client.user.setPresence({ 
        activities: [activity], 
        status: 'dnd', 
        afk: true,
    });
};
