const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		console.log("Guild: " + interaction.guild);
		console.log("Channel: " + interaction.channel);
		await interaction.reply('Pong!');
	},
};
