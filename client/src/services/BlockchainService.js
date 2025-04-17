import { ethers } from 'ethers';
import GameItemsABI from '../contracts/GameItems.json';
import GameTokenABI from '../contracts/GameToken.json';
import GameWorldABI from '../contracts/GameWorld.json';
import GameLogicABI from '../contracts/GameLogic.json';

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.contractAddresses = {
      items: '0x...',  // Replace with actual deployed contract addresses
      token: '0x...',
      world: '0x...',
      logic: '0x...'
    };
  }
  
  async connect() {
    // Connect to Monad network
    if (window.ethereum) {
      try {
        // Add Monad network if not already added
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x505', // 1285 in hex
            chainName: 'Monad Testnet',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://rpc.monad.xyz/testnet'],
            blockExplorerUrls: ['https://explorer.monad.xyz/']
          }]
        });
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        
        // Initialize contracts
        this.initializeContracts();
        
        return true;
      } catch (error) {
        console.error("User denied account access", error);
        return false;
      }
    } else {
      console.error("No Ethereum provider detected");
      return false;
    }
  }
  
  initializeContracts() {
    this.contracts.items = new ethers.Contract(
      this.contractAddresses.items,
      GameItemsABI.abi,
      this.signer
    );
    
    this.contracts.token = new ethers.Contract(
      this.contractAddresses.token,
      GameTokenABI.abi,
      this.signer
    );
    
    this.contracts.world = new ethers.Contract(
      this.contractAddresses.world,
      GameWorldABI.abi,
      this.signer
    );
    
    this.contracts.logic = new ethers.Contract(
      this.contractAddresses.logic,
      GameLogicABI.abi,
      this.signer
    );
  }
  
  async mintItem(itemType, rarity, power) {
    const tx = await this.contracts.logic.createItem(itemType, rarity, power);
    await tx.wait();
    
    // Get the item ID from event logs
    const receipt = await this.provider.getTransactionReceipt(tx.hash);
    const event = this.contracts.items.interface.parseLog(receipt.logs[0]);
    return event.args.tokenId;
  }
  
  async getPlayerItems(address) {
    const balance = await this.contracts.items.balanceOf(address);
    const items = [];
    
    for (let i = 0; i < balance; i++) {
      const tokenId = await this.contracts.items.tokenOfOwnerByIndex(address, i);
      const attributes = await this.contracts.items.itemAttributes(tokenId);
      items.push({
        id: tokenId.toString(),
        type: attributes.itemType,
        rarity: attributes.rarity,
        power: attributes.power,
        created: attributes.created
      });
    }
    
    return items;
  }
}

export default new BlockchainService();