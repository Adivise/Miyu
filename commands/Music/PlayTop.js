const { EmbedBuilder } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = {
    config: {
        name: "playtop",
        description: "Queue song to the top!",
        usage: "<results>",
        category: "Music",
        accessableby: "Member",
        aliases: ["tplay", "topplay"]
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
            
            // your have another tick? pls contributor
            Playlist(player, queues);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Shifted • [${res.playlistName}](${args})** \`${convertTime(player.queue.durationLength, true)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)

            return message.reply({ embeds: [embed] })
        } else {
            player.queue.add(res.tracks[0]);

            Normal(player);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Shifted • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}`)

            return message.reply({ embeds: [embed] })
        }
    }
}

function Normal(player) {
    const song = player.queue[player.queue.size - 1];
    player.queue.splice(player.queue.size - 1, 1);
    player.queue.splice(0, 0, song);
}

function Playlist(player, queues) {
    let num = 0;
    for (let i = queues; i < player.queue.size; i++) {
        const song = player.queue[i];
        player.queue.splice(i, 1);
        player.queue.splice(num++, 0, song);
    }
}