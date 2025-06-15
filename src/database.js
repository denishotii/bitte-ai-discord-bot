const Database = require('better-sqlite3');
const path = require('path');

class DatabaseManager {
    constructor() {
        this.db = new Database(path.join(__dirname, 'conversations.db'));
        this.initializeDatabase();
    }

    initializeDatabase() {
        // Create conversations table if it doesn't exist
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS user_wallets (
                discord_id TEXT PRIMARY KEY,
                wallet_address TEXT NOT NULL,
                public_key TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS chat_histories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                discord_id TEXT NOT NULL,
                agent_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (discord_id) REFERENCES user_wallets(discord_id)
            );
        `);
    }

    // Wallet connection methods
    connectWallet(discordId, walletAddress, publicKey = null) {
        const stmt = this.db.prepare(
            'INSERT OR REPLACE INTO user_wallets (discord_id, wallet_address, public_key) VALUES (?, ?, ?)'
        );
        return stmt.run(discordId, walletAddress, publicKey);
    }

    getWallet(discordId) {
        const stmt = this.db.prepare('SELECT * FROM user_wallets WHERE discord_id = ?');
        return stmt.get(discordId);
    }

    disconnectWallet(discordId) {
        const stmt = this.db.prepare('DELETE FROM user_wallets WHERE discord_id = ?');
        return stmt.run(discordId);
    }

    // Chat history methods
    addChatMessage(discordId, agentId, role, content) {
        const stmt = this.db.prepare(
            'INSERT INTO chat_histories (discord_id, agent_id, role, content) VALUES (?, ?, ?, ?)'
        );
        return stmt.run(discordId, agentId, role, content);
    }

    getChatHistory(discordId, agentId, limit = 10) {
        const stmt = this.db.prepare(`
            SELECT role, content 
            FROM chat_histories 
            WHERE discord_id = ? AND agent_id = ?
            ORDER BY created_at DESC 
            LIMIT ?
        `);
        return stmt.all(discordId, agentId, limit).reverse();
    }

    clearChatHistory(discordId, agentId) {
        const stmt = this.db.prepare('DELETE FROM chat_histories WHERE discord_id = ? AND agent_id = ?');
        return stmt.run(discordId, agentId);
    }

    // Legacy conversation methods (for backward compatibility)
    addMessage(userId, role, content) {
        const stmt = this.db.prepare(
            'INSERT INTO conversations (user_id, role, content) VALUES (?, ?, ?)'
        );
        return stmt.run(userId, role, content);
    }

    getLastMessages(userId, count = 5) {
        const stmt = this.db.prepare(`
            SELECT role, content 
            FROM conversations 
            WHERE user_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        `);
        return stmt.all(userId, count).reverse();
    }

    clearConversationHistory(userId) {
        const stmt = this.db.prepare('DELETE FROM conversations WHERE user_id = ?');
        return stmt.run(userId);
    }
}

module.exports = new DatabaseManager(); 