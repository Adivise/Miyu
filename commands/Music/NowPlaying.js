const formatDuration = require("../../structures/FormatDuration.js");
const { convertQueue } = require("../../structures/ConvertTime.js");
const { EmbedBuilder } = require("discord.js");

module.exports = { 
    config: {
        name: "nowplaying",
        aliases: ["np", "now"],
        description: "Display the song currently playing.",
        accessableby: "Member",
        category: "Music",
    },

    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply(`No playing in this guild!`);

        const song = player.queue.current;
        const CurrentDuration = formatDuration(player.position);
        const TotalDuration = formatDuration(song.length);

        console.log(song.sourceName)

        const Part = Math.floor(player.position / song.length * 30);
        const Emoji = player.playing ? "🔴 |" : "⏸ |";

        const embed = new EmbedBuilder()
            .setAuthor({ name: player.playing ? `Now playing...` : `Song pause...`, iconURL: `https://cdn.discordapp.com/emojis/741605543046807626.gif` })
            .setColor(client.color)
            .setDescription(`**[${song.title}](${song.uri})**`)
            .addFields({ name: `Author:`, value: `${song.author || "Unknow"}`, inline: true })
            .addFields({ name: `Requester:`, value: `${song.requester}`, inline: true })
            .addFields({ name: `Volume:`, value: `${player.options.volume}%`, inline: true })
            .addFields({ name: `Queue Length:`, value: `${player.queue.length}`, inline: true })
            .addFields({ name: `Total Duration:`, value: `${convertQueue(player, true)}`, inline: true })
            .addFields({ name: `Download:`, value: `**[Click Here](https://www.mp3fromlink.com/watch?v=${song.identifier})**`, inline: true })
            .addFields({ name: `Current Duration: \`[${CurrentDuration} / ${TotalDuration}]\``, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\``, inline: false })
            .setTimestamp();

        if (song.thumbnail) {
            embed.setThumbnail(song.thumbnail);
        } else {
            embed.setThumbnail(client.user.displayAvatarURL());
        }
      
        return message.reply({ content: " ", embeds: [embed] });
    }
}