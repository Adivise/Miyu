const { EmbedBuilder } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");
const { KazagumoTrack } = require("kazagumo");

module.exports = {
    config: {
        name: "playskip",
        description: "Play and skip to the song!",
        usage: "<results>",
        category: "Music",
        accessableby: "Member",
        aliases: ["pskip", "skipplay"]
    },
    run: async (client, message, args) => {
        if(!args[0]) return message.reply("Please provide song name.");

		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

        const res = await player.search(args, { requester: message.author });
        if (!res.tracks.length) return message.reply("No results found!");

        if (res.type === "PLAYLIST") {
            const queues = player.queue.size;
            for (let track of res.tracks) player.queue.add(track);
            
            Playlist(player, queues);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Skipped • [${res.playlistName}](${args})** \`${convertTime(player.queue.durationLength, true)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)

            return message.reply({ embeds: [embed] })
        } else {
            player.play(new KazagumoTrack(res.tracks[0].getRaw(), message.author));

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Skipped • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}`)

            return message.reply({ embeds: [embed] })
        }
    }
}

function Playlist(player, queues) {
    let num = 0;
    for (let i = queues + 1; i < player.queue.size + 1; i++) {
        const song = player.queue[i - 1];
        player.queue.splice(i - 1, 1);
        player.queue.splice(num++, 0, song);
    }
    player.skip();
}