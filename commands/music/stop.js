const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop playback.'),
	async execute(interaction) {
		try {
			let channelId = interaction.member.voice.channelId;
			if (!channelId){
				await interaction.reply('You are not in a voice channel.')
				return;
			}

			let queue = await interaction.client.distube.getQueue(interaction.member.guild);
		}
		catch (exception){
			console.log(exception);
			interaction.reply("A problem occurred while bringing up the queue.")
		}
	},
};



