const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["music", "twentyfourseven"],
    description: "24/7 in voice channel",
    category: "Music",
    run: async (client, interaction) => {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

        if (player.data.get("stay")) { // get undefined = turn on + set data
            await player.data.set("stay", false);

            const embed = new EmbedBuilder()
                .setDescription("`🌙` | *Mode 24/7 has been:* `Deactivated`")
                .setColor(client.color);

            return interaction.reply({ embeds: [embed] });
        } else {
            await player.data.set("stay", true);

            const embed = new EmbedBuilder()
                .setDescription("`🌕` | *Mode 24/7 has been:* `Activated`")
                .setColor(client.color);

            return interaction.reply({ embeds: [embed] });
        }
    }
};