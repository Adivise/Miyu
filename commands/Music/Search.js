const { convertTime } = require("../../structures/ConvertTime.js")
const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType, ComponentType } = require("discord.js");

module.exports = { 
    name: ["search"],
    description: "Search for a song!",
    category: "Music",
    options: [
        {
            name: "song",
            description: "The input of the song",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getString("song");
        const { channel } = interaction.member.voice;
        if (!channel) return interaction.editReply(`You are not in a voice channel`);
		if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) return interaction.editReply(`I don't have permission to join your voice channel!`);
		if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply(`I don't have permission to speak in your voice channel!`);

        const msg = await interaction.editReply(` Searching for \`${args}\`...`);

        const player = await client.manager.createPlayer({
            guildId: interaction.guild.id,
            textId: interaction.channel.id,
            voiceId: channel.id,
            volume: 100,
            deaf: true
        });

        const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("one")
            .setEmoji("1️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("two")
            .setEmoji("2️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("three")
            .setEmoji("3️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("four")
            .setEmoji("4️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("five")
            .setEmoji("5️⃣")
            .setStyle(ButtonStyle.Secondary)
        )


        let res = await player.search(args, { requester: interaction.user });
        if (!res.tracks.length) return interaction.editReply("No results found!");

        if (res.type === "PLAYLIST") {
            for (let track of res.tracks) player.queue.add(track);

            if (!player.playing && !player.paused) player.play();

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Queued • [${res.playlistName}](${args})** \`${convertTime(player.queue.durationLength, true)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)

            return interaction.editReply({ embeds: [embed] })
        } else {
            let index = 1;
            const results = res.tracks.slice(0, 5).map(x => `**(${index++}.) [${x.title}](${x.uri})** \`${convertTime(x.length, true)}\` Author: ${x.author}`).join("\n")

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Song Selection...`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor(client.color)
                .setDescription(results)
                .setFooter({ text: `Please Respone in 30s` })

            await msg.edit({ embeds: [embed], components: [row], content: " " });
            const collector = msg.createMessageComponentCollector({ filter: (interaction) => interaction.user.id === interaction.user.id, max: 1, time: 30000 });

            collector.on('collect', async (interaction) => {
             //   if(!interaction.deferred) await interaction.deferUpdate();
                if(!player && !collector.ended) return collector.stop();
                const id = interaction.customId;

                if(id === "one") {
                    player.queue.add(res.tracks[0]);
                    if (!player.playing && !player.paused) player.play();

                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}`)
                        .setColor(client.color)
 
                    if(msg) msg.edit({ embeds: [embed], components: [], content: " " });
                } else if(id === "two") {
                    player.queue.add(res.tracks[1]);
                    if (!player.playing && !player.paused) player.play();

                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued • [${res.tracks[1].title}](${res.tracks[1].uri})** \`${convertTime(res.tracks[1].length, true)}\` • ${res.tracks[1].requester}`)
                        .setColor(client.color)

                    if(msg) msg.edit({ embeds: [embed], components: [], content: " " });
                } else if(id === "three") {
                    player.queue.add(res.tracks[2]);
                    if (!player.playing && !player.paused) player.play();

                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued • [${res.tracks[2].title}](${res.tracks[2].uri})** \`${convertTime(res.tracks[2].length, true)}\` • ${res.tracks[2].requester}`)
                        .setColor(client.color)

                    if(msg) msg.edit({ embeds: [embed], components: [], content: " " });
                } else if(id === "four") {
                    player.queue.add(res.tracks[3]);
                    if (!player.playing && !player.paused) player.play();

                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued • [${res.tracks[3].title}](${res.tracks[3].uri})** \`${convertTime(res.tracks[3].length, true)}\` • ${res.tracks[3].requester}`)
                        .setColor(client.color)

                    if(msg) msg.edit({ embeds: [embed], components: [], content: " " });
                } else if(id === "five") {
                    player.queue.add(res.tracks[4]);
                    if (!player.playing && !player.paused) player.play();

                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued • [${res.tracks[4].title}](${res.tracks[4].uri})** \`${convertTime(res.tracks[4].length, true)}\` • ${res.tracks[4].requester}`)
                        .setColor(client.color)

                    if(msg) msg.edit({ embeds: [embed], components: [], content: " " });
                }
            });

            collector.on('end', async (collected, reason) => {
                if(reason === "time") {
                    await msg.edit({ content: `No Interaction!`, embeds: [], components: [] });
                    if (!player.playing) player.destroy();
                }
            });
        }
    }
}