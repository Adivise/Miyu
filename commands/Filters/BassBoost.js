const { EmbedBuilder } = require("discord.js");

module.exports = { 
    config: {
        name: "bassboost",
        description: "Turn on bass filter",
        category: "Filters",
        usage: "<integer>",
        accessableby: "Member",
        aliases: ["bb"]
    },
    run: async (client, message, args) => {
        const msg = await message.reply("Loading please wait...");

        const player = client.manager.players.get(message.guild.id);
        if(!player) return msg.edit(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`I'm not in the same voice channel as you!`);

        if(!args[0]) {
            const data = {
                op: 'filters',
                guildId: message.guild.id,
                equalizer: [
                    { band: 0, gain: 0.10 },
                    { band: 1, gain: 0.10 },
                    { band: 2, gain: 0.05 },
                    { band: 3, gain: 0.05 },
                    { band: 4, gain: -0.05 },
                    { band: 5, gain: -0.05 },
                    { band: 6, gain: 0 },
                    { band: 7, gain: -0.05 },
                    { band: 8, gain: -0.05 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0.05 },
                    { band: 11, gain: 0.05 },
                    { band: 12, gain: 0.10 },
                    { band: 13, gain: 0.10 },
                ]
            }

            await player.send(data);

            const embed = new EmbedBuilder()
                .setDescription("`💠` | *Turned on:* `BassBoost`")
                .setColor(client.color);

            await delay(5000);
            return msg.edit({ content: " ", embeds: [embed] });
        } else {
            if(isNaN(args[0])) return msg.edit(`Please enter a number!`);
            if(args[0] > 10 || args[0] < -10) return msg.edit(`Please enter a number between -10 - 10!`);

            const data = {
                op: 'filters',
                guildId: message.guild.id,
                equalizer: [
                    { band: 0, gain: args[0] / 10 },
                    { band: 1, gain: args[0] / 10 },
                    { band: 2, gain: args[0] / 10 },
                    { band: 3, gain: args[0] / 10 },
                    { band: 4, gain: args[0] / 10 },
                    { band: 5, gain: args[0] / 10 },
                    { band: 6, gain: args[0] / 10 },
                    { band: 7, gain: 0 },
                    { band: 8, gain: 0 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0 },
                    { band: 11, gain: 0 },
                    { band: 12, gain: 0 },
                    { band: 13, gain: 0 },
                ]
            }

            await player.send(data);

            const embed = new EmbedBuilder()
                .setDescription(`\`💠\` | *Turned on:* \`Bassboost\` | *Gain:* \`${args[0]}\``)
                .setColor(client.color);
            
            await delay(5000);
            return msg.edit({ content: " ", embeds: [embed] });
        }
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}