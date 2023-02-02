const { EmbedBuilder } = require('discord.js');

module.exports = {
    config: {
        name: "loopqueue",
        aliases: ["repeatall", 'lq', 'loopall'],
        description: "Loop all songs in queue!",
        accessableby: "Member",
        category: "Music"
    },
    run: async (client, message, args) => {
		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

		if (player.loop === "queue") {
            player.setLoop("none")
            
            const embed = new EmbedBuilder()
                .setDescription(`\`🔁\` | *Loop all has been:* \`Disabled\``)
                .setColor(client.color);

            message.reply({ embeds: [embed] });
		} else {
            player.setLoop("queue")
            
            const embed = new EmbedBuilder()
                .setDescription(`\`🔁\` | *Loop all has been:* \`Enabled\``)
                .setColor(client.color);

            message.reply({ embeds: [embed] });
		}
	}
};