const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask_bitte')
    .setDescription('General Bitte DEFI assistant, generate evm and near swaps and get market information')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('Your question')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName('clear')
        .setDescription('Clear conversation history before asking')),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const prompt = interaction.options.getString('prompt');
      const clearHistory = interaction.options.getBoolean('clear') ?? false;
      const agentId = 'bitte-defi';
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
      messages.push({ role: 'user', content: prompt });

      // Store user message in database
      db.addMessage(userId, 'user', prompt);

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
    // First, handle escaped newlines
    let formatted = text.replace(/\\n/g, '\n');
    
    // Handle any other escaped characters
    formatted = formatted.replace(/\\([^n])/g, '$1');
    
    // Fix numbered lists formatting
    formatted = formatted.replace(/(\d+\.)\s*\n\s*/g, '$1 '); // Remove newlines between number and content
    
    // Fix markdown formatting
    formatted = formatted.replace(/\*\*\s*\n\s*/g, '** '); // Fix bold markdown
    formatted = formatted.replace(/\s*\n\s*\*\*/g, ' **'); // Fix bold markdown
    
    // Add proper formatting for lists
    formatted = formatted.replace(/(\d+\.\s)/g, '\n$1'); // Add line break before numbered lists
    formatted = formatted.replace(/([•-]\s)/g, '\n$1'); // Add line break before bullet points
    
    // Add proper formatting for sections
    formatted = formatted.replace(/([A-Z][^.!?]+:)/g, '\n$1'); // Add line break before sections
    
    // Clean up spacing while preserving intentional line breaks
    formatted = formatted
      .replace(/\n{3,}/g, '\n\n') // Replace 3 or more newlines with 2
      .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
      .trim();
    
    // Add the bot response header with minimal spacing
    return `🤖 **Bitte DEFI Response:**\n${formatted}`;
  }
}; 