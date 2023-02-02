const { EmbedBuilder } = require('discord.js');

module.exports = {
    config: {
        name: "loop",
        aliases: ["repeat"],
        description: "Loop song in queue!",
        accessableby: "Member",
        category: "Music",
        usage: "<current, all>"
    },
    run: async (client, message, args) => {
		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

		if (!args[0] || args[0].toLowerCase() == 'current') {
			if (player.loop === "none") {
				player.setLoop("track");

				const embed = new EmbedBuilder()
					.setDescription(`\`🔁\` | *Song has been:* \`Looped\``)
					.setColor(client.color);

				message.reply({ embeds: [embed] });
			} else {
				player.setLoop("none")

				const embed = new EmbedBuilder()
					.setDescription(`\`🔁\` | *Song has been:* \`Unlooped\``)
					.setColor(client.color);

				message.reply({ embeds: [embed] });
			}
		} else if (args[0] == 'all') {
			if (player.loop === "queue") {
				player.setLoop("none")

				const embed = new EmbedBuilder() //// this is unloop all in queue!
					.setDescription(`\`🔁\` | *Loop all has been:* \`Disabled\``)
					.setColor(client.color);

				message.reply({ embeds: [embed] });
			} else {
				player.setLoop("queue")

				const embed = new EmbedBuilder() // this is loop all in queue!
					.setDescription(`\`🔁\` | *Loop all has been:* \`Enabled\``)
					.setColor(client.color);

				message.reply({ embeds: [embed] });
			}
		}
	}
};