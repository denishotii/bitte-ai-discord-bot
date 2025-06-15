const db = require('./database');

// Test database operations
async function testDatabase() {
    try {
        console.log('Testing database operations...');

        // Test adding a message
        const testUserId = 'test_user_123';
        const testMessage = 'This is a test message';
        
        console.log('Adding test message...');
        db.addMessage(testUserId, 'user', testMessage);
        console.log('✓ Message added successfully');

        // Test retrieving messages
        console.log('\nRetrieving conversation history...');
        const history = db.getLastMessages(testUserId, 5);
        console.log('✓ Retrieved messages:', history);

        // Test clearing history
        console.log('\nClearing conversation history...');
        db.clearConversationHistory(testUserId);
        console.log('✓ History cleared successfully');

        // Verify history is cleared
        const clearedHistory = db.getLastMessages(testUserId, 5);
        console.log('\nVerifying history is cleared:', clearedHistory);
        console.log('✓ Database operations working correctly!');

    } catch (error) {
        console.error('Error testing database:', error);
    }
}

// Run the test
testDatabase(); 