const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnectwallet')
        .setDescription('Disconnect your NEAR wallet from your Discord account'),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            
            // Check if user has a connected wallet
            const existingWallet = db.getWallet(userId);
            if (!existingWallet) {
                await interaction.reply({
                    content: 'You don\'t have any wallet connected.',
                    ephemeral: true
                });
                return;
            }

            // Disconnect the wallet
            db.disconnectWallet(userId);
            
            await interaction.reply({
                content: '✅ Your wallet has been disconnected successfully.',
                ephemeral: true
            });

        } catch (error) {
            console.error('Error in disconnectwallet command:', error);
            await interaction.reply({
                content: '❌ There was an error processing your request. Please try again later.',
                ephemeral: true
            });
        }
    },
}; 