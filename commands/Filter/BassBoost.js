const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = { 
    name: ["filter", "bassboost"],
    description: 'Turning on bassboost filter',
    category: "Filter",
    options: [
        {
            name: 'amount',
            description: 'The amount of the bassboost',
            type: ApplicationCommandOptionType.Integer,
            required: false,
            min_value: -10,
            max_value: 10
        }
    ],
    run: async (client, interaction) => {
        await interaction.reply("Loading please wait...");

        const player = client.manager.players.get(interaction.guild.id);
        if(!player) return interaction.editReply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`I'm not in the same voice channel as you!`);

        const value = interaction.options.getInteger('amount');
        if(!value) {
            const data = {
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

            await player.shoukaku.setFilters(data);

            const embed = new EmbedBuilder()
                .setDescription("`💠` | *Turned on:* `BassBoost`")
                .setColor(client.color);

            await delay(5000);
            return interaction.editReply({ content: " ", embeds: [embed] });
        } else {
            const data = {
                equalizer: [
                    { band: 0, gain: value / 10 },
                    { band: 1, gain: value / 10 },
                    { band: 2, gain: value / 10 },
                    { band: 3, gain: value / 10 },
                    { band: 4, gain: value / 10 },
                    { band: 5, gain: value / 10 },
                    { band: 6, gain: value / 10 },
                    { band: 7, gain: 0 },
                    { band: 8, gain: 0 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0 },
                    { band: 11, gain: 0 },
                    { band: 12, gain: 0 },
                    { band: 13, gain: 0 },
                ]
            }

            await player.shoukaku.setFilters(data);

            const embed = new EmbedBuilder()
                .setDescription(`\`💠\` | *Turned on:* \`Bassboost\` | *Gain:* \`${value}\``)
                .setColor(client.color);
            
            await delay(5000);
            return interaction.editReply({ content: " ", embeds: [embed] });
        }
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}