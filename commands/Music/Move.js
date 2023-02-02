const { EmbedBuilder } = require("discord.js");

module.exports = { 
    config: {
        name: "move",
        description: "Move position song in queue!",
        usage: "<3 1>",
        category: "Music",
        accessableby: "Member"
    },
    run: async (client, message, args) => {
		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

        const tracks = args[0];
        const position = args[1];

        if (isNaN(tracks) || isNaN(position)) return message.reply(`Please enter a valid number in the queue! ${client.prefix}move <from> <to>`);

        if (tracks == 0 && position == 0) return message.reply(`Cannot remove a song that is already playing`);
        if (tracks > player.queue.length || (tracks && !player.queue[tracks - 1])) return message.reply(`Song not found.`);
        if ((position > player.queue.length) || !player.queue[position - 1]) return message.reply(`Song not found.`);

        const song = player.queue[tracks - 1];

        await player.queue.splice(tracks - 1, 1);
        await player.queue.splice(position - 1, 0, song);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**Moved • [${song.title}](${song.uri})** to ${position}`)

        return message.reply({ embeds: [embed] });
    }
}