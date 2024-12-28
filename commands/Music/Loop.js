const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["music", "loop"],
    description: "Loops the current song!",
    category: "Music",
    options: [
        {
            name: "mode",
            description: "What mode do you want to loop?",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Current 🔂",
                    value: "current"
                },
                {
                    name: "Queue 🔁",
                    value: "queue"
                }
            ]
        }
    ],
    run: async (client, interaction) => {
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

		const choice = interaction.options.getString("mode");

		if (choice == 'current') {
			if (player.loop === "none") {
				player.setLoop("track");

				const embed = new EmbedBuilder()
					.setDescription(`\`🔁\` | *Song has been:* \`Looped\``)
					.setColor(client.color);

				interaction.reply({ embeds: [embed] });
			} else {
				player.setLoop("none")

				const embed = new EmbedBuilder()
					.setDescription(`\`🔁\` | *Song has been:* \`Unlooped\``)
					.setColor(client.color);

				interaction.reply({ embeds: [embed] });
			}
		} else if (choice == 'queue') {
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
	}
};