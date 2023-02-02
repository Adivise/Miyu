const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = { 
    config: {
        name: "join",
        aliases: ["summon"],
        description: "Make the bot join the voice channel.",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args) => {
        const { channel } = message.member.voice;
        if (!channel) return message.reply(`You are not in a voice channel`);
		if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Connect)) return message.reply(`I don't have permission to join your voice channel!`);
		if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Speak)) return message.reply(`I don't have permission to speak in your voice channel!`);

        client.manager.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: channel.id,
            volume: 100,
            deaf: true
        });

        const embed = new EmbedBuilder()
            .setDescription(`\`🔊\` | *Joined:* \`${channel.name}\``)
            .setColor(client.color)

        return message.reply({ embeds: [embed] })
    }
}
