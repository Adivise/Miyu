const { EmbedBuilder } = require("discord.js");

module.exports = { 
    name: ["filter", "3d"],
    description: "Turning on 3d filter",
    category: "Filter",
    run: async (client, interaction) => {
        await interaction.reply("Loading please wait...");

        const player = client.manager.players.get(interaction.guild.id);
        if(!player) return interaction.editReply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`I'm not in the same voice channel as you!`);

        const data = {
            rotation: { rotationHz: 0.2 }
        };

        await player.shoukaku.setFilters(data);

        const embed = new EmbedBuilder()
            .setDescription("`💠` | *Turned on:* `3d`")
            .setColor(client.color);

        await delay(5000);
        return interaction.editReply({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}