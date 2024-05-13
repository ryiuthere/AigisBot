const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autoplay')
		.setDescription('Set autoplay on or off.')
        .addBooleanOption(option => 
            option
                .setName('status')
                .setDescription('If autoplay should be on or off')),
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
			interaction.reply("A problem occurred while setting autoplay.")
		}
	},
};



