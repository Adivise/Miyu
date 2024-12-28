const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["filter", "china"],
    description: "Turning on china filter",
    category: "Filter",
    run: async (client, interaction) => {
        await interaction.reply(`Loading please wait....`);

        const player = client.manager.players.get(interaction.guild.id);
        if(!player) return interaction.editReply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`I'm not in the same voice channel as you!`);

        const data = {
            timescale: { 
                speed: 0.75, 
                pitch: 1.25, 
                rate: 1.25 
            }
        }

        await player.shoukaku.setFilters(data);

        const embed = new EmbedBuilder()
            .setDescription("`💠` | *Turned on:* `China`")
            .setColor(client.color);

        await delay(5000);
        interaction.editReply({ content: " ", embeds: [embed] });
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}