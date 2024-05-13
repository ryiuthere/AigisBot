const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Move a song in the queue.')
        .addIntegerOption(option =>
            option
                .setName('from')
                .setDescription('Song position in the queue to move from.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('to')
                .setDescription('Song position in the queue to move to.')
                .setRequired(true)),
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



