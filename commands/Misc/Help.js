const { EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: ["help"],
    description: "Display all commands bot has.",
    category: "Misc",
    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${interaction.guild.members.me.displayName} Help Command!`, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setDescription(`The bot prefix is: **/**`)
            .setFooter({ text: `© ${interaction.guild.members.me.displayName} | Total Commands: ${client.commands.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})

        const categories = readdirSync("./commands/");
        categories.forEach(category => {
            const dir = client.commands.filter(c => c.category === category);
            const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

            try {
                embed.addFields({ name: `❯ ${capitalise} [${dir.size}]:`, value: `${dir.map(c => `\`${c.name.at(-1)}\``).join(", ")}`, inline: false })
            } catch(e) {
                console.log(e)
            }
        })
        return interaction.reply({ embeds: [embed] })
    }
}