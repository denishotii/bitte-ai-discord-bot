const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear your recent chat history with the AI'),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            
            // Clear the user's conversation history
            db.clearConversationHistory(userId);
            
            // Send confirmation message
            await interaction.reply({
                content: '✅ Your chat history has been cleared successfully! Your next conversation will start fresh.',
                ephemeral: true // Only visible to the user who ran the command
            });

        } catch (error) {
            console.error('Error clearing chat history:', error);
            await interaction.reply({
                content: '❌ There was an error clearing your chat history. Please try again later.',
                ephemeral: true
            });
        }
    },
}; 