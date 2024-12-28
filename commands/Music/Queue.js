const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { NormalPage } = require('../../structures/PageQueue.js');
const formatDuration = require('../../structures/FormatDuration.js');

module.exports = { 
    name: ["queue"],
    description: "Show the queue of songs.",
    category: "Music",
    options: [
        {
            name: "page",
            description: "Page number to show.",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        }
    ],
    run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });

		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.editReply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`I'm not in the same voice channel as you!`);

		const args = interaction.options.getInteger("page");

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
                .setAuthor({ name: `Queue - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
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

		if (!args) {
			if (pages.length == pagesNum && player.queue.length > 10) NormalPage(client, interaction, pages, 60000, player.queue.length, qduration);
			else return interaction.editReply({ embeds: [pages[0]] });
		} else {
			if (isNaN(args)) return interaction.editReply(`Please enter a number!`);
			if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available!`);
			const pageNum = args == 0 ? 1 : args - 1;
			return interaction.editReply({ embeds: [pages[pageNum]] });
		}
	}
};