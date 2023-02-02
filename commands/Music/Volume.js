const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "volume",
        aliases: ["vol", "v"],
        description: "Adjusts the volume of the bot.",
        accessableby: "Member",
        category: "Music",
        usage: "<integer>"
    },
    run: async (client, message, args) => {
		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

        if (!args[0]) return message.reply(`*Current volume:* ${player.volume}%`);
        if (Number(args[0]) <= 0 || Number(args[0]) > 100) return message.reply(`Please provide a volume between 1 and 100.`);

        await player.setVolume(Number(args[0]));

        const embed = new EmbedBuilder()
            .setDescription(`\`🔈\` | *Volume set to:* \`${args[0]}%\``)
            .setColor(client.color);
        
        return message.reply({ embeds: [embed] });
    }
}