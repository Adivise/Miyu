const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["filter", "daycore"],
    description: "Turning on daycore filter",
    category: "Filter",
    run: async (client, interaction) => {
        await interaction.reply(`Loading please wait....`);

        const player = client.manager.players.get(interaction.guild.id);
        if(!player) return interaction.editReply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`I'm not in the same voice channel as you!`);

        const data = {
            equalizer: [
                { band: 0, gain: 0 },
                { band: 1, gain: 0 },
                { band: 2, gain: 0 },
                { band: 3, gain: 0 },
                { band: 4, gain: 0 },
                { band: 5, gain: 0 },
                { band: 6, gain: 0 },
                { band: 7, gain: 0 },
                { band: 8, gain: -0.25 },
                { band: 9, gain: -0.25 },
                { band: 10, gain: -0.25 },
                { band: 11, gain: -0.25 },
                { band: 12, gain: -0.25 },
                { band: 13, gain: -0.25 },
            ],
            timescale: {
                pitch: 0.63,
                rate: 1.05
            },
        }

        await player.shoukaku.setFilters(data);

        const daycored = new EmbedBuilder()
            .setDescription(`\`💠\` | *Turned on:* \`Daycore\``)
            .setColor(client.color);

        await delay(5000);
        interaction.editReply({ content: " ", embeds: [daycored] });
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}