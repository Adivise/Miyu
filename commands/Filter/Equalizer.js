const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = { 
    name: ["equalizer"],
    description: 'Custom Equalizer!',
    category: "Filter",
    options: [
        {
            name: 'bands',
            description: 'Number of bands to use (max 14 bands.)',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
	run: async (client, interaction) => {
		const player = client.manager.players.get(interaction.guild.id);
		if(!player) return interaction.reply(`No playing in this guild!`);
		const { channel } = interaction.member.voice;
		if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);
			
		const value = interaction.options.getString('bands');

		if (!value) {
			const embed = new EmbedBuilder()
				.setAuthor({ name: `Custom Equalizer`, iconURL: client.user.displayAvatarURL() })
				.setColor(client.color)
				.setDescription(`There are 14 bands that can be set from -10 to 10. Not all bands have to be filled out.`)
				.addFields({ name: `Example:`, value: `${client.prefix}eq 2 3 0 8 0 5 0 -5 0 0`, inline: false })
				.setFooter({ text: `Reset equalizer type: ${client.prefix}eq reset` })

			return interaction.reply({ embeds: [embed] });
			
		} else if (value == 'off' || value == 'reset') {
			const data = {}
			return await player.shoukaku.setFilters(data);
		}

		const bands = args.join(' ').split(/[ ]+/);
		let bandsStr = '';
		for (let i = 0; i < bands.length; i++) {
			if (i > 13) break;
			if (isNaN(bands[i])) return interaction.reply(`Band #${i + 1} is not a valid number.`);
			if (bands[i] > 10) return interaction.reply(`Band #${i + 1} must be less than 10.`);
		}

		for (let i = 0; i < bands.length; i++) {
			if (i > 13) break;
			const data = {
                equalizer: [
					{ band: i, gain: (bands[i]) / 10 },
                ]
            }
			await player.shoukaku.setFilters(data);
			bandsStr += `${bands[i]} `;
		}
	
		await interaction.reply(`Setting **Equalizer** to... \`${bandsStr}\` This may take a few seconds...`);
		
		const embed = new EmbedBuilder()
			.setDescription(`\`🔩\` | *Equalizer set to:* \`${bandsStr}\``)
			.setColor(client.color);

		await delay(5000);
        return interaction.editReply({ content: " ", embeds: [embed] });
	}
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}