const { EmbedBuilder } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js')

const fastForwardNum = 10;

module.exports = { 
    config: {
        name: "forward",
        description: "Forward timestamp in the song!",
        accessableby: "Member",
        category: "Music",
        usage: "<integer>"
    },
    run: async (client, message, args) => {
		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

        const song = player.queue.current;
        const CurrentDuration = formatDuration(player.position);

		if (args[0] && !isNaN(args[0])) {
			if((player.position + args[0] * 1000) < song.length) {
                await player.seek(player.position + args[0] * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`\`⏭\` | *Forward to:* \`${CurrentDuration}\``)
                    .setColor(client.color);

                message.reply({ content: " ", embeds: [embed] });
			} else { 
                return message.reply(`You can't forward more than the duration of the song!`);
            }
		} else if (args[0] && isNaN(args[0])) { 
            return message.reply(`Please enter a number!`);
        }

		if (!args[0]) {
			if((player.position + fastForwardNum * 1000) < song.length) {
                await player.seek(player.position + fastForwardNum * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`\`⏭\` | *Forward to:* \`${CurrentDuration}\``)
                    .setColor(client.color);

                message.reply({ content: " ", embeds: [embed] });
			} else {
				return message.reply(`You can't forward more than the duration of the song!`);
			}
		}
	}
};