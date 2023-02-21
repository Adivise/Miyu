const { EmbedBuilder } = require('discord.js');
const { KazagumoTrack } = require('kazagumo');

module.exports = { 
    name: ["music", "previous"],
    description: "Play the previous song in the queue.",
    category: "Music",
    run: async (client, interaction) => {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

        if (!player.queue.previous) return interaction.reply(`No previous song/s not found`);

        await player.play(new KazagumoTrack(player.queue.previous.getRaw(), interaction.user));

        const embed = new EmbedBuilder()
            .setDescription("`⏮` | *Song has been:* `Previous`")
            .setColor(client.color);

        return interaction.reply({ embeds: [embed] });
    }
}