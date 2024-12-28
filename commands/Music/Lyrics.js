const lyricsfinder = require('lyrics-finder');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = { 
    name: ["music", "lyric"],
    description: "Display lyrics of a song.",
    category: "Music",
    options: [
        {
            name: "result",
            description: "Song name to return lyrics for.",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    run: async (client, interaction) => {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

        const song = interaction.options.getString("result");
        let CurrentSong = player.queue.current;
        if (!song && CurrentSong) song = CurrentSong.title;

        let lyrics = null;

        try {
            lyrics = await lyricsfinder(song, "");
            if (!lyrics) return interaction.reply(`No lyrics found for ${song}`);
        } catch (err) {
            console.log(err);
            return interaction.reply(`No lyrics found for ${song}`);
        }
        let lyricsEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Lyrics for ${song}`)
            .setDescription(`${lyrics}`)
            .setFooter({ text: `Powered By: lyrics-finder`})
            .setTimestamp();

        if (lyrics.length > 2048) {
            lyricsEmbed.setDescription(`Lyrics are too long to display!`);
        }
        interaction.reply({ content: ' ', embeds: [lyricsEmbed] });
    }
};