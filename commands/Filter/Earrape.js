const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["filter", "earrape"],
    description: "Turning on earrape filter",
    category: "Filter",
    run: async (client, interaction) => {
        await interaction.reply(`Loading please wait....`);

        const player = client.manager.players.get(interaction.guild.id);
        if(!player) return interaction.editReply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`I'm not in the same voice channel as you!`);

		await player.setVolume(500);
        const data = {
            op: 'filters',
            guildId: interaction.guild.id,
        }
        await player.send(data);

        const earrapped = new EmbedBuilder()
            .setDescription(`\`💠\` | *Turned on:* \`Earrape\``)
            .setColor(client.color);

        await delay(3000);
        interaction.editReply({ content: " ", embeds: [earrapped] });
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}