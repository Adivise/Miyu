const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "leave",
        aliases: ["lev", "stop", "dc"],
        description: "Makes the bot leave the voice channel.",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

        await player.destroy();

        const embed = new EmbedBuilder()
            .setDescription(`\`🚫\` | *Left:* | \`${channel.name}\``)
            .setColor(client.color);

        return message.reply({ embeds: [embed] })
    }
}
