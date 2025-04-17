
import React, { useState, useEffect } from 'react';
import BlockchainService from '../services/BlockchainService';
import './CharacterSelection.css';

const CharacterSelection = ({ onCharacterSelected }) => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  
  useEffect(() => {
    // Fetch player's characters from blockchain
    const fetchCharacters = async () => {
      const address = await BlockchainService.signer.getAddress();
      const characterIds = await BlockchainService.contracts.logic.getPlayerCharacters(address);
      
      const fetchedCharacters = await Promise.all(
        characterIds.map(async (id) => {
          const data = await BlockchainService.contracts.logic.getCharacter(id);
          return {
            id: id.toString(),
            name: data.name,
            class: data.class,
            level: data.level.toNumber(),
            image: `https://cryptoquest.io/characters/${data.class}_${data.level}.png`
          };
        })
      );
      
      setCharacters(fetchedCharacters);
    };
    
    if (BlockchainService.signer) {
      fetchCharacters();
    }
  }, []);
  
  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };
  
  const handleContinue = () => {
    if (selectedCharacter) {
      onCharacterSelected(selectedCharacter);
    }
  };
  
  const handleCreateCharacter = () => {
    // Open character creation modal
    // For hackathon purposes, just add a new character directly
    setCharacters([
      ...characters,
      {
        id: 'new-character',
        name: 'New Adventurer',
        class: 'warrior',
        level: 1,
        image: 'https://cryptoquest.io/characters/warrior_1.png'
      }
    ]);
  };
  
  return (
    <div className="character-selection">
      <h2>Select Your Character</h2>
      
      <div className="character-grid">
        {characters.map(character => (
          <div 
            key={character.id} 
            className={`character-card ${selectedCharacter?.id === character.id ? 'selected' : ''}`}
            onClick={() => handleCharacterSelect(character)}
          >
            <div className="character-image">
              <img src={character.image} alt={character.name} />
            </div>
            <div className="character-info">
              <h3>{character.name}</h3>
              <p>Level {character.level} {character.class}</p>
            </div>
          </div>
        ))}
        
        <div className="character-card new-character" onClick={handleCreateCharacter}>
          <div className="character-image">
            <div className="new-character-plus">+</div>
          </div>
          <div className="character-info">
            <h3>Create New Character</h3>
          </div>
        </div>
      </div>
      
      <div className="selection-actions">
        <button 
          className="continue-button"
          disabled={!selectedCharacter}
          onClick={handleContinue}
        >
          Continue Adventure
        </button>
      </div>
    </div>
  );
};

export default CharacterSelection;