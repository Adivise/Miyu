const lyricsfinder = require('lyrics-finder');
const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "lyrics",
        description: "Display lyrics of a song",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

        let song = args.join(" ");
        let CurrentSong = player.queue.current;
        if (!song && CurrentSong) song = CurrentSong.title;

        let lyrics = null;

        try {
            lyrics = await lyricsfinder(song, "");
            if (!lyrics) return message.reply(`No lyrics found for ${song}`);
        } catch (err) {
            console.log(err);
            return message.reply(`No lyrics found for ${song}`);
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
        message.reply({ content: ' ', embeds: [lyricsEmbed] });
    }
};