const { EmbedBuilder } = require('discord.js');
const { NormalPage } = require('../../structures/PageQueue.js');
const formatDuration = require('../../structures/FormatDuration.js');

module.exports = { 
    config: {
        name: "queue",
        aliases: ["q"],
        description: "Displays what the current queue is.",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args) => {
		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

		const song = player.queue.current;
		const qduration = formatDuration(player.queue.durationLength + song.length);

		let pagesNum = Math.ceil(player.queue.length / 10);
		if(pagesNum === 0) pagesNum = 1;

		const songStrings = [];
		for (let i = 0; i < player.queue.length; i++) {
			const song = player.queue[i];
			songStrings.push(
				`**${i + 1}.** [${song.title}](${song.uri}) \`[${formatDuration(song.length)}]\` • ${song.requester}
				`);
		}

		const pages = [];
		for (let i = 0; i < pagesNum; i++) {
			const str = songStrings.slice(i * 10, i * 10 + 10).join('');

			const embed = new EmbedBuilder()
                .setAuthor({ name: `Queue - ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
				.setColor(client.color) //**Currently Playing:**\n**[${song.title}](${song.uri})** \`[${formatDuration(song.duration)}]\` • ${song.requester}\n\n**Rest of queue**:${str == '' ? '  Nothing' : '\n' + str}
				.setDescription(`**Currently Playing**\n[${song.title}](${song.uri}) \`[${formatDuration(song.length)}]\` • ${song.requester}\n\n**Rest of queue**:${str == '' ? '  Nothing' : '\n' + str}`) //Page • ${i + 1}/${pagesNum} | ${player.queue.length} • Song | ${qduration} • Total duration
				.setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${player.queue.length} • Song/s | ${qduration} • Total Duration` });

			if (song.thumbnail) {
				embed.setThumbnail(song.thumbnail);
			} else {
				embed.setThumbnail(client.user.displayAvatarURL());
			}

			pages.push(embed);
		}

		if (!args[0]) {
			if (pages.length == pagesNum && player.queue.length > 10) NormalPage(client, message, pages, 60000, player.queue.length, qduration);
			else return message.reply({ embeds: [pages[0]] });
		} else {
			if (isNaN(args[0])) return message.reply(`Please enter a number!`);
			if (args[0] > pagesNum) return message.reply(`There are only ${pagesNum} pages available!`);
			const pageNum = args[0] == 0 ? 1 : args[0] - 1;
			return message.reply({ embeds: [pages[pageNum]] });
		}
	}
};