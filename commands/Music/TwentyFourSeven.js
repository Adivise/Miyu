const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "twentyfourseven",
        description: "24/7 Music!",
        accessableby: "Member",
        category: "Music",
        aliases: ["247"],
    },
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

        if (player.data.get("stay")) { // get undefined = turn on + set data
            await player.data.set("stay", false);

            const embed = new EmbedBuilder()
                .setDescription("`🌙` | *Mode 24/7 has been:* `Deactivated`")
                .setColor(client.color);

            return message.reply({ embeds: [embed] });
        } else {
            await player.data.set("stay", true);

            const embed = new EmbedBuilder()
                .setDescription("`🌕` | *Mode 24/7 has been:* `Activated`")
                .setColor(client.color);

            return message.reply({ embeds: [embed] });
        }
    }
};