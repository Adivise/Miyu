const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["music", "leave"],
    description: "Disconnect the bot from your voice channel",
    category: "Music",
    run: async (client, interaction) => {
        const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

        await player.destroy();

        const embed = new EmbedBuilder()
            .setDescription(`\`🚫\` | *Left:* | \`${channel.name}\``)
            .setColor(client.color);

        return interaction.reply({ embeds: [embed] })
    }
}
