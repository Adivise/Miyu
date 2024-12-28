const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["music", "replay"],
    description: "Replay the current song!",
    category: "Music",
    run: async (client, interaction) => {
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

        await player.seek(0);

        const embed = new EmbedBuilder()
            .setDescription("`⏮` | *Song has been:* `Replayed`")
            .setColor(client.color);

        return interaction.reply({ embeds: [embed] });
    }
}