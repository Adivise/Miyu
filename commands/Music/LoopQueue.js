const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["music", "loopqueue"],
    description: "Loops all songs in queue!",
    category: "Music",
    run: async (client, interaction) => {
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

		if (player.loop === "queue") {
            player.setLoop("none")
            
            const embed = new EmbedBuilder()
                .setDescription(`\`🔁\` | *Loop all has been:* \`Disabled\``)
                .setColor(client.color);

            interaction.reply({ embeds: [embed] });
		} else {
            player.setLoop("queue")
            
            const embed = new EmbedBuilder()
                .setDescription(`\`🔁\` | *Loop all has been:* \`Enabled\``)
                .setColor(client.color);

            interaction.reply({ embeds: [embed] });
		}
	}
};