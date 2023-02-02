const { convertTime } = require("../../structures/ConvertTime.js");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = { 
    config: {
        name: "play",
        description: "Play a song!",
        usage: "<results>",
        category: "Music",
        accessableby: "Member",
        aliases: ["p", "pplay"]
    },
    run: async (client, message, args) => {
        if(!args[0]) return message.reply("Please provide song name.");
        const { channel } = message.member.voice;
        if (!channel) return message.reply(`You are not in a voice channel`);
		if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Connect)) return message.reply(`I don't have permission to join your voice channel!`);
		if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Speak)) return message.reply(`I don't have permission to speak in your voice channel!`);

        const player = await client.manager.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: channel.id,
            volume: 100,
            deaf: true
        });

        let res = await player.search(args, { requester: message.author });
        if (!res.tracks.length) return message.reply("No results found!");

        if (res.type === "PLAYLIST") {
            for (let track of res.tracks) player.queue.add(track);

            if (!player.playing && !player.paused) player.play();

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Queued • [${res.playlistName}](${args})** \`${convertTime(res.tracks[0].length + player.queue.durationLength, true)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)

            return message.reply({ embeds: [embed] })
        } else {
            player.queue.add(res.tracks[0]);

            if (!player.playing && !player.paused) player.play();

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}`)

            return message.reply({ embeds: [embed] })
        }
    }
}