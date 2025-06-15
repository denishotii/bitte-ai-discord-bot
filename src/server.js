const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST /connect-wallet: Save wallet info to the database
app.post('/connect-wallet', (req, res) => {
  const { discord_id, wallet_address, public_key } = req.body;
  if (!discord_id || !wallet_address || !public_key) {
    return res.status(400).send('Missing required fields');
  }
  try {
    db.connectWallet(discord_id, wallet_address, public_key);
    res.json({ success: true, wallet_address });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save wallet');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`)); 