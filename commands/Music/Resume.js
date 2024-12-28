const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["music", "resume"],
    description: "Resume the music!",
    category: "Music",
    run: async (client, interaction) => {
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);
        
        await player.pause(player.playing);
        const uni = player.paused ? `Paused` : `Resumed`;

        const embed = new EmbedBuilder()
            .setDescription(`\`⏯\` | *Song has been:* \`${uni}\``)
            .setColor(client.color);

        return interaction.reply({ embeds: [embed] });
    }
}