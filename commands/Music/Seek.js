const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js')

module.exports = { 
    name: ["music", "seek"],
    description: "Seek timestamp in the song!",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "The number of seconds to seek the timestamp by.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
        }
    ],
    run: async (client, interaction) => {
        const value = interaction.options.getInteger("seconds");
        
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

		if(value * 1000 >= player.queue.current.length || value < 0) return interaction.reply(`You can't seek more than the duration of the song!`);
        
		await player.seek(value * 1000);

        const Duration = formatDuration(player.position);
        const embed = new EmbedBuilder()
            .setDescription(`\`⏮\` | *Seek to:* \`${Duration}\``)
            .setColor(client.color);

        return interaction.reply({ embeds: [embed] });
    }
}