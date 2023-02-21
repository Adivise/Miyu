const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["music", "autoplay"],
    description: "Autoplay music (Random play songs)",
    category: "Music",
    run: async (client, interaction) => {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);
        
        if (player.data.get("autoplay")) { // get undifined = turn on + set data
            await player.data.set("autoplay", false);
            await player.queue.clear();

            const embed = new EmbedBuilder()
                .setDescription("`📻` | *Autoplay has been:* `Deactivated`")
                .setColor(client.color);

            return interaction.reply({ embeds: [embed] });
        } else {
            const identifier = player.queue.current.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = await player.search(search, { requester: interaction.user });
            if (!res.tracks.length) return interaction.reply(`Engine \`${player.queue.current.sourceName}\` not support!`);

            await player.data.set("autoplay", true);
            await player.data.set("requester", interaction.user);
            await player.data.set("identifier", identifier);
            await player.queue.add(res.tracks[1]);

            const embed = new EmbedBuilder()
                .setDescription("`📻` | *Autoplay has been:* `Activated`")
                .setColor(client.color);

            return interaction.reply({ embeds: [embed] });
        }
    }
};