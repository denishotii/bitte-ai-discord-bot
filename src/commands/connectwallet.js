const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('connectwallet')
        .setDescription('Connect your NEAR wallet to your Discord account'),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            
            // Check if user already has a connected wallet
            const existingWallet = db.getWallet(userId);
            if (existingWallet) {
                await interaction.reply({
                    content: `You already have a wallet connected: \`${existingWallet.wallet_address}\`\nUse \`/disconnectwallet\` to remove it first.`,
                    ephemeral: true
                });
                return;
            }

            // Check if WALLET_CONNECT_URL is configured
            if (!process.env.WALLET_CONNECT_URL) {
                console.error('WALLET_CONNECT_URL environment variable is not set');
                await interaction.reply({
                    content: '❌ Wallet connection service is not configured. Please contact the administrator.',
                    ephemeral: true
                });
                return;
            }

            // Generate connection link
            const connectionUrl = new URL('/connect', process.env.WALLET_CONNECT_URL);
            connectionUrl.searchParams.append('discord_id', userId);
            
            // Create a button for the user to click
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Connect Wallet')
                        .setStyle(ButtonStyle.Link)
                        .setURL(connectionUrl.toString())
                );

            await interaction.reply({
                content: 'Click the button below to connect your NEAR wallet:',
                components: [row],
                ephemeral: true
            });

        } catch (error) {
            console.error('Error in connectwallet command:', error);
            await interaction.reply({
                content: '❌ There was an error processing your request. Please try again later.',
                ephemeral: true
            });
        }
    },
}; 