const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["filter", "nightcore"],
    description: "Turning on nightcore filter",
    category: "Filter",
    run: async (client, interaction) => {
        await interaction.reply(`Loading please wait....`);

        const player = client.manager.players.get(interaction.guild.id);
        if(!player) return interaction.editReply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`I'm not in the same voice channel as you!`);

        const data = {
            op: 'filters',
            guildId: interaction.guild.id,
            timescale: {
                speed: 1.165,
                pitch: 1.125,
                rate: 1.05
            },
        }

        await player.send(data);

        const nightcored = new EmbedBuilder()
            .setDescription(`\`💠\` | *Turned on:* \`Nightcore\``)
            .setColor(client.color);

        await delay(5000);
        interaction.editReply({ content: " ", embeds: [nightcored] });
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}