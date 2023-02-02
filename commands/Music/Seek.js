const { EmbedBuilder } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js')

module.exports = { 
    config: {
        name: "seek",
        description: "Seek timestamp in the song!",
        accessableby: "Member",
        category: "Music",
        usage: "<seconds>"
    },
    run: async (client, message, args) => {
        if(isNaN(args[0])) return message.reply(`Please enter a number!`);
        
		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

		if(args[0] * 1000 >= player.queue.current.length || args[0] < 0) return message.reply(`You can't seek more than the duration of the song!`);
        
		await player.seek(args[0] * 1000);

        const Duration = formatDuration(player.position);
        const embed = new EmbedBuilder()
            .setDescription(`\`⏮\` | *Seek to:* \`${Duration}\``)
            .setColor(client.color);

        return message.reply({ embeds: [embed] });
    }
}