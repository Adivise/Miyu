const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = { 
    name: ["music", "remove"],
    description: "Remove song from queue!",
    category: "Music",
    options: [
        {
            name: "position",
            description: "The position in queue want to remove.",
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

        const tracks = interaction.options.getInteger("position");
        if (tracks > player.queue.size) return interaction.reply(`Song not found.`);

        const song = player.queue[tracks - 1];
        await player.queue.splice(tracks - 1, 1);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**Removed • [${song.title}](${song.uri})** \`${convertTime(song.length, true)}\` • ${song.requester}`)

        return interaction.reply({ embeds: [embed] });
    }
}