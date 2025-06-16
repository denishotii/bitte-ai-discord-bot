# 🤖 Bitte.ai Discord Bot

A powerful Discord bot that integrates multiple AI agents to provide comprehensive crypto, DeFi, and memecoin information, along with risk analysis and wallet connectivity.

[![Discord](https://img.shields.io/discord/your-server-id?color=7289DA&label=Discord&logo=discord&logoColor=white)](https://discord.gg/bitte)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)

## 🚀 Overview

Bitte.ai Discord Bot brings the power of Bitte.ai agents directly into Discord servers, allowing any community to interact with AI agents in a familiar, accessible way without leaving their chat platform.

## 🌐 The Problem

Most AI platforms operate as standalone web apps. This creates friction for web3, gaming, and DeFi communities who primarily communicate inside Discord. Users rarely visit external AI platforms, limiting real-world adoption.

## 🎯 Our Solution

We developed a fully integrated Discord bot that directly connects to Bitte.ai agents, enabling:

- 🔹 Access to multiple Bitte.ai agents inside Discord
- 🔹 Per-user conversation memory to maintain context across chats
- 🔹 Wallet-based user linking (NEAR wallets) for agents requiring on-chain functionality
- 🔹 Agent-specific logic to support complex actions such as swaps or minting
- 🔹 A highly extensible system to onboard any future Bitte.ai agents

## 🔬 Technical Approach

As Bitte.ai currently does not expose a fully documented external API for third-party integrations, we reverse-engineered their agent interaction system by analyzing their frontend code, specifically:

- ✅ Extracting internal API routes and payload structures
- ✅ Rebuilding the message formatting expected by their agent inference backend
- ✅ Handling streaming responses and reassembling AI-generated text in Discord
- ✅ Parsing multi-part streamed responses (SSE-like format) into complete assistant replies

For agents requiring wallet integration, we developed:

- ✅ A NEAR Wallet Selector web interface for Discord users to connect wallets
- ✅ A backend system mapping Discord users to their wallet addresses
- ✅ Logic to inject wallet context into agent requests for agents requiring wallet-based on-chain actions

## 🏗️ Architecture

| Layer | Technology |
|-------|------------|
| Discord Bot | Node.js + Discord.js |
| AI Backend | Bitte.ai agents (reverse-engineered API integration) |
| Streaming Parser | SSE-style stream parsing and reconstruction |
| Storage | SQLite (chat memory + wallet mapping) |
| Wallet Connect | React + Vite + NEAR Wallet Selector SDK |

## 🌟 Features

### 🤖 AI-Powered Commands
- **General Assistant** (`/ask`): Multi-agent system for crypto and DeFi queries
- **CoinGecko Integration** (`/ask_cg`): Real-time crypto prices and market data
- **DeFi Assistant** (`/ask_bitte`): Generate EVM and NEAR swaps, market analytics
- **Meme.cooking** (`/ask_meme`): Create and track memecoins
- **Risk Analysis** (`/ask_risk`): Smart contract and DeFi protocol risk assessment

### 💼 Wallet Integration
- Connect multiple wallets (EVM chains and NEAR)
- Secure wallet management
- Portfolio tracking
- Transaction history

### 🔒 Security Features
- Encrypted wallet connections
- Secure API handling
- Regular security audits
- Privacy-focused design

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- Docker and Docker Compose (optional)
- Discord Bot Token
- Bitte.ai API Key
- WalletConnect Project ID

### Environment Setup
Create a `.env` file in the root directory:
```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
GUILD_ID=your_discord_guild_id

# Bitte.ai Configuration
BITTE_API_KEY=your_bitte_api_key

# Wallet Connect Configuration
WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

### Installation

#### Using Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/your-username/bitte-ai-discord-bot.git
cd bitte-ai-discord-bot

# Start the services
docker-compose up --build
```

#### Manual Installation
```bash
# Clone the repository
git clone https://github.com/your-username/bitte-ai-discord-bot.git
cd bitte-ai-discord-bot

# Install dependencies
npm install

# Deploy commands
npm run deploy

# Start the bot
npm start
```

## 📚 Available Commands

### AI Commands
- `/ask` - General purpose AI assistant
  - Select from different AI agents
  - Ask any crypto/DeFi related questions
  - Clear conversation history option

- `/ask_cg` - CoinGecko AI Assistant
  - Real-time crypto prices
  - Market data and analysis
  - Price tracking

- `/ask_bitte` - Bitte DeFi Assistant
  - Generate EVM and NEAR swaps
  - DeFi market information
  - Comprehensive analytics

- `/ask_meme` - Meme.cooking Assistant
  - Create and track memecoins
  - Get Meme.cooking stats
  - Memecoin market information

- `/ask_risk` - Risk Analysis Assistant
  - Smart contract evaluation
  - Liquidity pool analysis
  - Security assessments
  - Governance risk review

### Wallet Commands
- `/connect` - Link your wallet
- `/disconnect` - Remove wallet connection
- `/wallets` - View connected wallets

## 🔧 Development

### Adding New Commands
1. Create a new file in `src/commands/`
2. Follow the existing command structure
3. The bot will automatically load new commands on startup

### Database
- SQLite database for conversation history
- Automatic initialization on startup
- Health checks for reliability

### Testing
```bash
# Run database tests
node src/init-db.js

# Run the bot in development mode
npm run dev
```

## ⚙️ Next Steps

- Expand multi-agent support to additional Bitte.ai agents
- Extend full wallet functionality into agents requiring real-time on-chain execution
- Explore community-governed agent usage inside Discord servers

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/)
- [Bitte.ai](https://bitte.ai)
- [WalletConnect](https://walletconnect.com/)
- [CoinGecko](https://www.coingecko.com/)

