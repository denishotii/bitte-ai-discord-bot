const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Get an introduction to Bitte.ai Discord Bot and learn about its features'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🤖 Welcome to Bitte.ai Discord Bot!')
      .setDescription('Your AI-powered assistant for crypto, DeFi, and memecoin information!')
      .addFields(
        {
          name: '📊 Available Commands',
          value: `
**/ask** - General purpose AI assistant
• Select from different AI agents (CoinGecko, Bitte Assistant)
• Ask any question about crypto, DeFi, or general topics
• Use \`clear\` option to reset conversation history

**/ask_cg** - CoinGecko AI Assistant
• Get real-time crypto prices and market data
• Track your favorite cryptocurrencies
• Access detailed market analysis and charts

**/ask_bitte** - Bitte DeFi Assistant
• Generate EVM and NEAR swaps
• Get DeFi market information
• Access comprehensive DeFi analytics

**/ask_meme** - Meme.cooking Assistant
• Create and track memecoins
• Get Meme.cooking stats
• Access memecoin market information

**/ask_risk** - Risk Analysis Assistant
• Evaluate smart contracts and DeFi protocols
• Analyze liquidity pools and market risks
• Get comprehensive security assessments
• Review governance and operational risks`
        },
        {
          name: '👛 Wallet Connection',
          value: `
• Connect your wallet to access personalized features
• Supported networks: EVM chains and NEAR
• Your wallet data is securely stored and encrypted
• Use \`/connect\` to link your wallet
• Use \`/disconnect\` to remove wallet connection
• View your connected wallets with \`/wallets\``
        },
        {
          name: '💡 Tips & Features',
          value: `
• Use \`clear\` option in any command to reset your conversation history
• Each command maintains separate conversation history
• Responses are formatted for easy reading
• Get detailed market data and analytics
• Access real-time price information
• Track your portfolio across multiple chains
• Get personalized DeFi recommendations
• Set up price alerts for your favorite tokens
• Get risk analysis for your DeFi positions`
        },
        {
          name: '🔒 Security & Privacy',
          value: `
• Your wallet connections are encrypted
• Private keys are never stored
• All API calls are secure and authenticated
• Regular security audits
• Data is stored according to privacy regulations`
        },
        {
          name: '🔗 Useful Links',
          value: `
• [Bitte.ai Website](https://bitte.ai)
• [Documentation](https://docs.bitte.ai)
• [Support Server](https://discord.gg/bitte)
• [GitHub Repository](https://github.com/bitte-ai)
• [Security Guide](https://docs.bitte.ai/security)
• [Wallet Connection Guide](https://docs.bitte.ai/wallet)
• [Risk Analysis Guide](https://docs.bitte.ai/risk)`
        }
      )
      .setFooter({ text: 'Bitte.ai - Your AI-powered crypto companion' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
}; 