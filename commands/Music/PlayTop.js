const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = {
    name: ["music", "playtop"],
    description: "Queue song to the top!",
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
                        .setDescription(`**Shifted • [${res.playlistName}](${string})** \`${convertTime(player.queue.durationLength, true)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)
        
                    return interaction.editReply({ content: " ", embeds: [embed] })
                } else {
                    player.queue.add(res.tracks[0]);
        
                    Normal(player);
        
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`**Shifted • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}`)
        
                    return interaction.editReply({ content: " ", embeds: [embed] })
                }
            }
        } catch {
            //
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