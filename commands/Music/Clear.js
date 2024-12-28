const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["music", "clear"],
    description: "Clear song in queue!",
    category: "Music",
    run: async (client, interaction) => {
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

        await player.queue.clear();
        
        const embed = new EmbedBuilder()
            .setDescription("`📛` | *Queue has been:* `Cleared`")
            .setColor(client.color);

        return interaction.reply({ embeds: [embed] });
    }
}