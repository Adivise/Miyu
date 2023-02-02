const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "skipto",
        aliases: ["jump", "st"],
        description: "Skips to a certain song in the queue.",
        accessableby: "Member",
        category: "Music",
        usage: "<positions>"
    },
    run: async (client, message, args) => {
        if (isNaN(args[0])) return message.reply(`Please enter a valid position!`);
		if (args[0] == 0) return message.reply(`You can't skip to the first song!`);

		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

		if ((args[0] > player.queue.size) || (args[0] && !player.queue[args[0] - 1])) return message.reply(`You can't skip to a song that doesn't exist!`);
		if (args[0] == 1) player.skip();

		await player.queue.splice(0, args[0] - 1);
        await player.skip();
        
        const embed = new EmbedBuilder()
            .setDescription(`\`⏭\` | *Skip to:* \`${args[0]}\``)
            .setColor(client.color);

        return message.reply({ embeds: [embed] });
    }
}