const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "pause",
        aliases: ["pa"],
        description: "Pause song in queue!",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args) => {
		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);
        
        await player.pause(player.playing);
        const uni = player.paused ? `Paused` : `Resumed`;

        const embed = new EmbedBuilder()
            .setDescription(`\`⏯\` | *Song has been:* \`${uni}\``)
            .setColor(client.color);

        return message.reply({ embeds: [embed] });
    }
}