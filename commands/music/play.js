const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song.')
		.addStringOption(option =>
			option
				.setName('search')
				.setDescription('Song to search for')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('position')
				.setDescription('Position in queue')),
	async execute(interaction) {
		try {
			let channelId = interaction.member.voice.channelId;
			if (!channelId){
				await interaction.reply('You are not in a voice channel.')
				return;
			}
			await interaction.deferReply()

			const searchString = interaction.options.getString('search');

			let queue = await interaction.client.distube.getQueue(interaction.member.guild);
			let songsInQueue = queue && queue.songs.length > 0;
			await interaction.client.distube.play(interaction.member.voice.channel, searchString);
			queue = await interaction.client.distube.getQueue(interaction.member.guild);

			const embed = new EmbedBuilder();
		
			let song;
			if (songsInQueue){
				song = queue.songs[queue.songs.length - 1]
				embed.setTitle('Added to queue: ' + song.name)
					.addFields({ name: 'Position in queue', value: queue.songs.length + '' });
			} else {
				song = queue.songs[0]
				embed.setTitle('Now playing: ' + song.name);
			}

			embed.setColor(0x0099FF)
				.setURL(song.url)
				.setAuthor({name: song.uploader.name, url: song.uploader.url})
				.setDescription('Length: ' + song.formattedDuration)
				.setThumbnail(song.thumbnail);

			interaction.editReply({ embeds: [embed] });
		}
		catch (exception){
			console.log(exception);
			interaction.editReply("A problem occurred while playing.")
		}
	},
};



