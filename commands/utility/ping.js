const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const darkRedEmbed = new EmbedBuilder()
	.setTitle('hello')
	.setColor('DarkRed');

const redEmbed = new EmbedBuilder()
	.setTitle('hello')
	.setColor('Red');
const darkBlueEmbed = new EmbedBuilder()
	.setTitle('hello')
	.setColor('DarkBlue');
const yellowEmbed = new EmbedBuilder()
	.setTitle('hello')
	.setColor('Yellow');
const greypleEmbed = new EmbedBuilder()
	.setTitle('hello')
	.setColor('Greyple');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply({ embeds: [darkRedEmbed, redEmbed, darkBlueEmbed, yellowEmbed, greypleEmbed] });
	},
};
