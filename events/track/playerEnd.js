const { EmbedBuilder } = require("discord.js")

module.exports = async (client, player) => {

    if (player.data.get("autoplay")) {
        const requester = player.data.get("requester");
        const identifier = player.data.get("identifier");
        const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
        const res = await player.search(search, { requester: requester });
        if (!res.tracks.length) return;
        await player.queue.add(res.tracks[2]);
    }
}