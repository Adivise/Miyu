const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = { 
    name: ["music", "join"],
    description: "Summon the bot to your voice channel.",
    category: "Music",
    run: async (client, interaction) => {
        const { channel } = interaction.member.voice;
        if (!channel) return interaction.reply(`You are not in a voice channel`);
		if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) return interaction.reply(`I don't have permission to join your voice channel!`);
		if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.reply(`I don't have permission to speak in your voice channel!`);

        client.manager.createPlayer({
            guildId: interaction.guild.id,
            textId: interaction.channel.id,
            voiceId: channel.id,
            volume: 100,
            deaf: true
        });

        const embed = new EmbedBuilder()
            .setDescription(`\`🔊\` | *Joined:* \`${channel.name}\``)
            .setColor(client.color)

        return interaction.reply({ embeds: [embed] })
    }
}
