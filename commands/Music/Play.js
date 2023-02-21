const { convertTime } = require("../../structures/ConvertTime.js");
const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");

module.exports = { 
    name: ["play"],
    description: "Plays a song from the source.",
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
                const { channel } = interaction.member.voice;
                if (!channel) return interaction.reply(`You are not in a voice channel`);
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) return interaction.reply(`I don't have permission to join your voice channel!`);
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.reply(`I don't have permission to speak in your voice channel!`);
        
                await interaction.reply(`🔍 **Searching...** \`${interaction.options.getString("search")}\``);

                const player = await client.manager.createPlayer({
                    guildId: interaction.guild.id,
                    textId: interaction.channel.id,
                    voiceId: channel.id,
                    volume: 100,
                    deaf: true
                });
                const string = interaction.options.getString("search");

                const res = await player.search(string, { requester: interaction.user });
                if (!res.tracks.length) return interaction.editReply("No results found!");
        
                if (res.type === "PLAYLIST") {
                    for (let track of res.tracks) player.queue.add(track);
        
                    if (!player.playing && !player.paused) player.play();
        
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`**Queued • [${res.playlistName}](${string})** \`${convertTime(res.tracks[0].length + player.queue.durationLength, true)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)
        
                    return interaction.editReply({ content: " ", embeds: [embed] })
                } else {
                    player.queue.add(res.tracks[0]);
        
                    if (!player.playing && !player.paused) player.play();
        
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}`)
        
                    return interaction.editReply({ content: " ", embeds: [embed] })
                }
            }
        } catch {
            ///
        }
    }
}