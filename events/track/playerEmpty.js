const { EmbedBuilder } = require("discord.js")

module.exports = async (client, player) => {
    const channel = client.channels.cache.get(player.textId);
    if (!channel) return;
    
    if (player.data.get("stay")) return;

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription("`📛` | *Song has been:* `Ended`");
    
    channel.send({ embeds: [embed] });
    return player.destroy();
}