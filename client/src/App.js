import React, { useEffect, useState } from 'react';
import './App.css';
import GameInterface from './components/GameInterface';
import CharacterSelection from './components/CharacterSelection';
import Inventory from './components/Inventory';
import BlockchainService from './services/BlockchainService'; // Assuming this service handles blockchain interactions

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [playerAddress, setPlayerAddress] = useState(null);

  useEffect(() => {
    // Check if the user has a connected wallet (e.g., MetaMask) and set up the connection
    const checkConnection = async () => {
      const connectedAddress = await BlockchainService.getPlayerAddress();
      if (connectedAddress) {
        setIsConnected(true);
        setPlayerAddress(connectedAddress);
      } else {
        setIsConnected(false);
      }
    };
    
    checkConnection();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>CryptoQuest: The Web3 Game</h1>

        {!isConnected ? (
          <p>Please connect your wallet to play the game.</p>
        ) : (
          <>
            <p>Welcome, {playerAddress}</p>
            <CharacterSelection />
            <GameInterface />
            <Inventory />
          </>
        )}
      </header>
    </div>
  );
}

export default App;
