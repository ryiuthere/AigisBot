const { ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Get the current queue.'),
		async execute(interaction) {
			try {
				let page = 0;
				let channelId = interaction.member.voice.channelId;
				if (!channelId){
					await interaction.reply('You are not in a voice channel.')
					return;
				}
				const response = await interaction.deferReply()
	
				let queue = await interaction.client.distube.getQueue(interaction.member.guild);
				let songsInQueue = queue && queue.songs.length > 0;
				if (!songsInQueue){
					interaction.editReply("No songs in queue.");
					return;
				}

				while (true){
					const pageSize = 10;
					let startSong = 1 + pageSize * page;
					let queueString = '';
					for (let i = startSong;i < queue.songs.length && i - startSong < pageSize;i ++){
						let song = queue.songs[i];
						queueString += `\n${i}: ${song.name} (${song.formattedDuration})`
					}

					let date = new Date(0);
					date.setSeconds(queue.duration - queue.currentTime);
					let formattedDuration = date.toISOString().substring(11,19);

					const embed = new EmbedBuilder()
						.setTitle(`Songs in queue: **${queue.songs.length}** (${formattedDuration})`)
						.setColor(0x0099FF)
						.setDescription(`Currently playing: **${queue.songs[0].name}**\n` + queueString)
						.setFooter({text: `Page ${page + 1} out of ${Math.floor((queue.songs.length - 2)/pageSize)}`});
		
					const prevButton = new ButtonBuilder()
						.setCustomId('previous')
						.setLabel('Previous')
						.setStyle(ButtonStyle.Primary)
						.setDisabled(startSong === 1);
					
					const nextButton = new ButtonBuilder()
						.setCustomId('next')
						.setLabel('Next')
						.setStyle(ButtonStyle.Primary)
						.setDisabled(startSong + pageSize > queue.songs.length);

					const row = new ActionRowBuilder()
						.addComponents(prevButton, nextButton);

					interaction.editReply({ embeds: [embed], components: [row] });

					const input = await response.awaitMessageComponent({time: 30_000});

					if (input.customId === 'previous') {
						page -= 1;
					} else if (input.customId === 'next') {
						page += 1;
					}

					await input.update({components: []});
				}
				
			}
			catch (exception){
				if (exception.code === 'InteractionCollectorError'){
					interaction.editReply({components: []});
					return;
				}

				console.log(exception);
				interaction.editReply("A problem occurred while getting the queue.")
			}
		},
};