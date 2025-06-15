import "@near-wallet-selector/modal-ui/styles.css";
import { useEffect, useState, useCallback } from 'react';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { connect, keyStores } from 'near-api-js';


function App() {
  const [walletSelector, setWalletSelector] = useState(null);
  const [modal, setModal] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [discordId, setDiscordId] = useState(null);
  const [status, setStatus] = useState('initializing');
  const [error, setError] = useState(null);

  const connectWallet = useCallback(async (accountId) => {
    if (!walletSelector || !discordId) {
      console.error('Missing walletSelector or discordId:', { walletSelector, discordId });
      return;
    }

    try {
      console.log('Getting public key...');
      setStatus('connecting');

      // Get the public key from the wallet selector state
      const state = walletSelector.store.getState();
      const account = state.accounts.find(acc => acc.accountId === accountId);
      const publicKey = account?.publicKey;

      if (!publicKey) {
        throw new Error('No public key found for this account');
      }

      console.log('Got public key:', publicKey);

      console.log('Sending wallet info to backend...');
      // Send wallet info to backend
      const response = await fetch(`http://localhost:3001/connect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discord_id: discordId,
          wallet_address: accountId,
          public_key: publicKey
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error('Failed to connect wallet to Discord: ' + errorData);
      }

      console.log('Wallet connected successfully!');
      setStatus('connected');
      setAccountId(accountId);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet: ' + (error.message || 'Unknown error'));
      setStatus('error');
    }
  }, [walletSelector, discordId]);

  const initializeWallet = useCallback(async () => {
    try {
      console.log('Initializing wallet selector...');
      
      const selector = await setupWalletSelector({
        network: import.meta.env.VITE_NEAR_NETWORK || 'testnet',
        modules: [
          setupNearWallet({
            iconUrl: 'https://near.org/wp-content/themes/near-19/assets/img/logo.svg',
            deprecated: false,
          }),
          setupMyNearWallet({
            iconUrl: 'https://mynearwallet.com/assets/icon.svg',
            deprecated: false,
          })
        ],
        debug: true
      });
      console.log('Wallet selector initialized');

      console.log('Setting up modal...');
      const modal = setupModal(selector, {
        contractId: 'test.testnet',
        theme: {
          background: '#1a1a1a',
          color: '#ffffff',
          accent: '#00c6ff',
          borderRadius: '1rem',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        description: 'Connect your NEAR wallet to link it with your Discord account',
        onHide: () => {
          console.log('Modal hidden');
          const state = selector.store.getState();
          if (state.accounts.length > 0) {
            connectWallet(state.accounts[0].accountId);
          }
        }
      });
      console.log('Modal setup complete');

      setWalletSelector(selector);
      setModal(modal);

      const state = selector.store.getState();
      console.log('Initial wallet selector state:', state);
      
      if (state.accounts.length > 0) {
        console.log('Found existing account:', state.accounts[0].accountId);
        await connectWallet(state.accounts[0].accountId);
      } else {
        console.log('No existing account found, ready to connect');
        setStatus('ready');
      }
    } catch (error) {
      console.error('Error initializing wallet:', error);
      setError('Failed to initialize wallet: ' + (error.message || 'Unknown error'));
      setStatus('error');
    }
  }, [connectWallet]);

  useEffect(() => {
    // Get discord_id from URL
    const params = new URLSearchParams(window.location.search);
    const discordId = params.get('discord_id');
    
    console.log('Discord ID from URL:', discordId);
    
    if (!discordId) {
      setError('Missing Discord ID in URL');
      setStatus('error');
      return;
    }

    // Validate Discord ID format (should be a number)
    if (!/^\d+$/.test(discordId)) {
      setError('Invalid Discord ID format');
      setStatus('error');
      return;
    }

    setDiscordId(discordId);
    initializeWallet();
  }, [initializeWallet]);

  const handleConnect = async () => {
    if (!walletSelector || !modal) {
      console.error('Wallet selector or modal not initialized:', { walletSelector, modal });
      setError('Wallet connection not ready. Please refresh the page and try again.');
      setStatus('error');
      return;
    }
    
    try {
      console.log('Opening wallet modal...');
      setStatus('connecting');
      
      // Show the modal and wait for user interaction
      await modal.show({
        modalOptions: {
          style: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            background: '#1a1a1a',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      });
      
      // The onHide callback will handle the connection if an account is selected
      console.log('Modal shown, waiting for user interaction...');
    } catch (error) {
      console.error('Error in handleConnect:', error);
      setError('Failed to show wallet selection modal: ' + (error.message || 'Unknown error'));
      setStatus('error');
    }
  };

  const styles = {
    app: {
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      margin: 0,
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    container: {
      width: '100%',
      maxWidth: '800px',
      padding: '2rem',
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '1rem',
      backdropFilter: 'blur(10px)'
    },
    header: {
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5rem',
      marginBottom: '2rem',
      fontWeight: 'bold',
      color: 'white'
    },
    errorMessage: {
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      border: '1px solid #ff0000',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      color: '#ff6b6b'
    },
    statusMessage: {
      color: '#00c6ff',
      fontSize: '1.25rem',
      marginBottom: '1rem'
    },
    successMessage: {
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      border: '1px solid #00ff00',
      borderRadius: '8px',
      padding: '2rem',
      marginBottom: '1rem',
      color: '#4ade80'
    },
    successTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    connectButton: {
      background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
      color: 'white',
      fontWeight: 'bold',
      padding: '1rem 2rem',
      borderRadius: '9999px',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      fontSize: '1.1rem'
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Connect Your NEAR Wallet</h1>
          
          {status === 'error' && (
            <div style={styles.errorMessage}>
              {error || 'Error: Invalid or missing Discord ID'}
            </div>
          )}

          {status === 'initializing' && (
            <div style={styles.statusMessage}>
              Initializing wallet connection...
            </div>
          )}

          {status === 'connecting' && (
            <div style={styles.statusMessage}>
              Connecting wallet... Please complete the wallet connection in the popup window.
            </div>
          )}

          {status === 'connected' && (
            <div style={styles.successMessage}>
              <h2 style={styles.successTitle}>Wallet Connected Successfully!</h2>
              <p>Account: {accountId}</p>
              <p>You can now close this window and return to Discord.</p>
            </div>
          )}

          {status === 'ready' && (
            <div>
              <button
                onClick={handleConnect}
                style={styles.connectButton}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 198, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = 'scale(0.95)';
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
              >
                Connect NEAR Wallet
              </button>
              <p style={{ marginTop: '1rem', color: '#888' }}>
                Click the button above to connect your NEAR wallet. A popup window will appear.
              </p>
            </div>
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
