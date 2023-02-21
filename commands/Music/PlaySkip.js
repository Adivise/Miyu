const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");
const { KazagumoTrack } = require("kazagumo");

module.exports = {
    name: ["music", "playskip"],
    description: "Play and skip to a song!",
    category: "Music",
    options: [
        {
            name: "search",
            type: ApplicationCommandOptionType.String,
            description: "The song to play.",
            required: true,
            autocomplete: true
        }
    ],
    run: async (client, interaction) => {
        try {
            if (interaction.options.getString("search")) {
                const player = client.manager.players.get(interaction.guild.id);
                if (!player) return interaction.reply(`No playing in this guild!`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);
        
                await interaction.reply(`🔍 **Searching...** \`${interaction.options.getString("search")}\``);

                const string = interaction.options.getString("search");
                const res = await player.search(string, { requester: interaction.user });
                if (!res.tracks.length) return interaction.editReply("No results found!");
        
                if (res.type === "PLAYLIST") {
                    const queues = player.queue.size;
                    for (let track of res.tracks) player.queue.add(track);
                    
                    Playlist(player, queues);
        
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`**Skipped • [${res.playlistName}](${string})** \`${convertTime(player.queue.durationLength, true)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)
        
                    return interaction.editReply({ content: " ", embeds: [embed] })
                } else {
                    player.play(new KazagumoTrack(res.tracks[0].getRaw(), interaction.user));
        
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`**Skipped • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}`)
        
                    return interaction.editReply({ content: " ", embeds: [embed] })
                }
            }
        } catch {
            //
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