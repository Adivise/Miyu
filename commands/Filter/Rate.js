const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = { 
    name: ["filter", "rate"],
    description: "Sets the rate of the song.",
    category: "Filter",
    options: [
        {
            name: "amount",
            description: "The amount of rate to set.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 0,
            max_value: 10
        }
    ],
	run: async (client, interaction) => {
		await interaction.reply(`Loading please wait....`);

		const player = client.manager.players.get(interaction.guild.id);
		if(!player) return interaction.editReply(`No playing in this guild!`);
		const { channel } = interaction.member.voice;
		if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`I'm not in the same voice channel as you!`);

		const value = interaction.options.getInteger('amount');

		const data = {
			op: 'filters',
			guildId: interaction.guild.id,
			timescale: { rate: value },
		}

		await player.send(data);
		
		const embed = new EmbedBuilder()
			.setDescription(`\`💠\` | *Rate set to:* \`${value}\``)
			.setColor(client.color);
		await delay(5000);
		interaction.editReply({ content: " ", embeds: [embed] });
	}
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}