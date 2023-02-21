const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = { 
    name: ["filter", "speed"],
    description: "Sets the speed of the song.",
    category: "Filter",
    options: [
        {
            name: "amount",
            description: "The amount of speed to set the song to.",
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
			timescale: { speed: value },
		}

		await player.send(data);

		const embed = new EmbedBuilder()
			.setDescription(`\`💠\` | *Speed set to:* \`${value}\``)
			.setColor(client.color);
			
		await delay(5000);
		interaction.editReply({ content: " ", embeds: [embed] });
	}
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}