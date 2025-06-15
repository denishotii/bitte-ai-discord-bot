# Discord Bot

A Discord bot built with Discord.js v14.

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_client_id_here
   GUILD_ID=your_guild_id_here
   ```
4. Get your bot token from the [Discord Developer Portal](https://discord.com/developers/applications)
5. Invite the bot to your server using the OAuth2 URL generator in the Developer Portal

## Running the Bot

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Available Commands

- `/ping` - Check the bot's latency

## Adding New Commands

1. Create a new file in the `src/commands` directory
2. Follow the structure of the existing commands
3. The bot will automatically load the new command on startup

## Project Structure

```
├── src/
│   ├── commands/     # Command files
│   └── index.js      # Main bot file
├── .env             # Environment variables
├── .gitignore
├── package.json
└── README.md
``` 