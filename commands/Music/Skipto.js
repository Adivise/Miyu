const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = { 
    name: ["music", "skipto"],
    description: "Skips to a certain song in the queue.",
    category: "Music",
    options: [
        {
            name: "position",
            description: "The position of the song in the queue.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1,
        }
    ],
    run: async (client, interaction) => {
        const value = interaction.options.getInteger("position");

		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

		if ((value > player.queue.size) || (value && !player.queue[value - 1])) return interaction.reply(`You can't skip to a song that doesn't exist!`);
		if (value == 1) player.skip();

		await player.queue.splice(0, value - 1);
        await player.skip();
        
        const embed = new EmbedBuilder()
            .setDescription(`\`⏭\` | *Skip to:* \`${value}\``)
            .setColor(client.color);

        return interaction.reply({ embeds: [embed] });
    }
}