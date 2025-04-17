
import React, { useEffect, useRef } from 'react';
import GameEngine from '../engine/GameEngine';
import BlockchainService from '../services/BlockchainService';
import './GameInterface.css';

const GameInterface = () => {
  const canvasRef = useRef(null);
  const gameEngineRef = useRef(null);
  
  useEffect(() => {
    // Initialize game engine when component mounts
    if (canvasRef.current && !gameEngineRef.current) {
      const contractAddresses = require('../contractAddresses.json');
      gameEngineRef.current = new GameEngine(canvasRef.current, contractAddresses);
      
      BlockchainService.connect().then(connected => {
        if (connected) {
          gameEngineRef.current.initialize(BlockchainService.signer);
        }
      });
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  return (
    <div className="game-container">
      <div className="game-overlay">
        <div className="player-stats">
          <div className="player-health">HP: 100/100</div>
          <div className="player-energy">MP: 75/100</div>
          <div className="player-xp">XP: 245/500</div>
        </div>
        <div className="game-inventory-button">
          <button>Inventory</button>
        </div>
        <div className="game-minimap">
          {/* Minimap will be rendered here */}
        </div>
      </div>
      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  );
};

export default GameInterface;