const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = { 
    name: ["music", "volume"],
    description: "Adjusts the volume of the bot.",
    category: "Music",
    options: [
        {
            name: "amount",
            description: "The amount of volume to set the bot to.",
            type: ApplicationCommandOptionType.Integer,
            required: false,
            min_value: 1,
            max_value: 100
        }
    ],
    run: async (client, interaction) => {
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

        const value = interaction.options.getInteger("amount");
        if (!value) return interaction.reply(`*Current volume:* ${player.volume}%`);

        await player.setVolume(Number(value));

        const embed = new EmbedBuilder()
            .setDescription(`\`🔈\` | *Volume set to:* \`${value}%\``)
            .setColor(client.color);
        
        return interaction.reply({ embeds: [embed] });
    }
}