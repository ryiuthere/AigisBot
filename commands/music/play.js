const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song.')
		.addStringOption(option =>
			option
				.setName('search')
				.setDescription('Song to search for'))
		.addStringOption(option =>
			option
				.setName('link')
				.setDescription('Link to the song')),
	async execute(interaction) {
		try {
			let channelId = interaction.member.voice.channelId;
			if (!channelId){
				await interaction.reply('You are not in a voice channel.')
				return;
			}

			let queue = await interaction.client.distube.getQueue(interaction.member.guild);
			if (queue && queue.songs.length > 0){
				interaction.reply("Already playing: " + queue.songs[0].name);
			} else {
				await interaction.client.distube.play(interaction.member.voice.channel, 'hatsune miku');
				queue = await interaction.client.distube.getQueue(interaction.member.guild);
				interaction.reply('Now playing: ' + queue.songs[0].name)
			}
		}
		catch (exception){
			console.log(exception);
			interaction.reply("A problem occurred while playing.")
		}
	},
};



