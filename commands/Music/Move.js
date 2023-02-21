const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = { 
    name: ["music", "move"],
    description: "Change a songs position in a queue.",
    category: "Music",
    options: [
        {
            name: "from",
            description: "The queue number of the song",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
        },
        {
            name: "to",
            description: "The position in queue you want to move",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
        }
    ],
    run: async (client, interaction) => {
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

        const tracks = interaction.options.getInteger("from");
        const position = interaction.options.getInteger("to");

        if (tracks > player.queue.length || (tracks && !player.queue[tracks - 1])) return interaction.reply(`Song not found.`);
        if ((position > player.queue.length) || !player.queue[position - 1]) return interaction.reply(`Song not found.`);

        const song = player.queue[tracks - 1];

        await player.queue.splice(tracks - 1, 1);
        await player.queue.splice(position - 1, 0, song);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**Moved • [${song.title}](${song.uri})** to ${position}`)

        return interaction.reply({ embeds: [embed] });
    }
}