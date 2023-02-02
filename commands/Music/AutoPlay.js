const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "autoplay",
        description: "Auto play music in voice channel.",
        accessableby: "Member",
        category: "Music"
    },
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);
        
        if (player.data.get("autoplay")) { // get undifined = turn on + set data
            await player.data.set("autoplay", false);
            await player.queue.clear();

            const embed = new EmbedBuilder()
                .setDescription("`📻` | *Autoplay has been:* `Deactivated`")
                .setColor(client.color);

            return message.reply({ embeds: [embed] });
        } else {
            const identifier = player.queue.current.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = await player.search(search, { requester: message.author });
            if (!res.tracks.length) return message.reply(`Engine \`${player.queue.current.sourceName}\` not support!`);

            await player.data.set("autoplay", true);
            await player.data.set("requester", message.author);
            await player.data.set("identifier", identifier);
            await player.queue.add(res.tracks[1]);

            const embed = new EmbedBuilder()
                .setDescription("`📻` | *Autoplay has been:* `Activated`")
                .setColor(client.color);

            return message.reply({ embeds: [embed] });
        }
    }
};