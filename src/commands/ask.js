const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask a question to Bitte.ai agent')
        .addStringOption(option =>
            option.setName('agent')
                .setDescription('Select AI agent')
                .setRequired(true)
                .addChoices(
                    { name: 'CoinGecko', value: 'coingecko-ai.vercel.app' },
                    { name: 'Bitte Assistant', value: 'bitte-defi' },
                ))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Your question for the AI agent')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('clear')
                .setDescription('Clear conversation history before asking')),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const userMessage = interaction.options.getString('message');
            const agentId = interaction.options.getString('agent');
            const clearHistory = interaction.options.getBoolean('clear') ?? false;
            const userId = interaction.user.id;

            // Clear history if requested
            if (clearHistory) {
                db.clearConversationHistory(userId);
                await interaction.editReply('Conversation history cleared!');
            }

            // Get conversation history
            const history = db.getLastMessages(userId, 5);
            const messages = history.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Add the current user message
            messages.push({ role: 'user', content: userMessage });

            // Store user message in database
            db.addMessage(userId, 'user', userMessage);

            // Make the API call to Bitte.ai
            const response = await axios.post('https://api.bitte.ai/v1/chat', {
                id: agentId,
                messages: messages
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.BITTE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            // Parse the streaming response
            const responseText = response.data;
            let fullResponse = '';
            
            // Split the response into lines and process each chunk
            const lines = responseText.split('\n');
            for (const line of lines) {
                if (line.startsWith('0:"')) {
                    // Extract the content between quotes
                    const content = line.slice(3, -1);
                    fullResponse += content;
                }
            }

            // Format the response
            const formattedResponse = this.formatResponse(fullResponse);

            // Store AI response in database
            db.addMessage(userId, 'assistant', fullResponse);

            // Send the response back to Discord
            await interaction.editReply({
                content: formattedResponse,
                allowedMentions: { parse: [] }
            });

        } catch (error) {
            console.error('Error calling Bitte.ai API:', error);
            
            let errorMessage = 'Sorry, I encountered an error while processing your request.';
            
            if (error.response) {
                errorMessage = `API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`;
            } else if (error.request) {
                errorMessage = 'No response received from Bitte.ai API. Please try again later.';
            }

            await interaction.editReply({
                content: `❌ ${errorMessage}`,
                ephemeral: true
            });
        }
    },

    formatResponse(text) {
        // Replace \n with actual line breaks
        let formatted = text.replace(/\\n/g, '\n');

        // Add proper formatting for lists
        formatted = formatted.replace(/(\d+\.\s)/g, '\n$1'); // Add line break before numbered lists
        formatted = formatted.replace(/([•-]\s)/g, '\n$1'); // Add line break before bullet points

        // Add proper formatting for sections
        formatted = formatted.replace(/([A-Z][^.!?]+:)/g, '\n$1'); // Add line break before sections

        // Clean up spacing
        formatted = formatted
            .replace(/\n{3,}/g, '\n\n') // Replace 3 or more newlines with 2
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();

        // Add the bot response header with minimal spacing
        return `🤖 **Bitte.ai Response:**\n${formatted}`;
    }
}; 