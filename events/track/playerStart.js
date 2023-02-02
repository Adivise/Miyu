const { EmbedBuilder } = require("discord.js");
const formatduration = require("../../structures/FormatDuration.js");

module.exports = async (client, player, track) => {
    const source = player.queue.current.sourceName || "unknow";
    let src = "";
    if(source === "youtube") {
        src = "https://media.discordapp.net/attachments/1010784573061349496/1070282974848888863/youtube.png"
    } else if (source === "spotify") {
        src = "https://media.discordapp.net/attachments/1010784573061349496/1070282974404300902/spotify.png"
    } else if (source === "soundcloud") {
        src = "https://media.discordapp.net/attachments/1010784573061349496/1070282974190383124/soundcloud.png"
    } else if (source === "twitch") {
        src = "https://media.discordapp.net/attachments/1010784573061349496/1070282974634975292/twitch.png"
    } else {
        src = "https://media.discordapp.net/attachments/1010784573061349496/1070283756100911184/question.png"
    }

    const embed = new EmbedBuilder()
        .setAuthor({ name: "Starting playing...", iconURL: "https://cdn.discordapp.com/emojis/741605543046807626.gif" })
        .setDescription(`**[${track.title || "Unknow"}](${track.uri})**`)
        .setColor(client.color)
        .addFields({ name: `Author:`, value: `${track.author || "Unknow"}`, inline: true })
        .addFields({ name: `Requester:`, value: `${track.requester}`, inline: true })
        .addFields({ name: `Volume:`, value: `${player.options.volume}%`, inline: true })
        .addFields({ name: `Queue Length:`, value: `${player.queue.size}`, inline: true })
        .addFields({ name: `Duration:`, value: `${formatduration(track.length, true)}`, inline: true })
        .addFields({ name: `Total Duration:`, value: `${formatduration(player.queue.durationLength + track.length, true)}`, inline: true })
        .addFields({ name: `Current Duration: [0:00 / ${formatduration(track.length, true)}]`, value: `\`\`\`🔴 | 🎶──────────────────────────────\`\`\``, inline: true })
        .setFooter({ text: `Engine: ${UpCase(source)}`, iconURL: src })
        .setTimestamp()

        if (track.thumbnail) {
            embed.setThumbnail(track.thumbnail);
        } else {
            embed.setThumbnail(client.user.displayAvatarURL());
        }

    client.channels.cache.get(player.textId)?.send({ embeds: [embed] });
}

function UpCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}