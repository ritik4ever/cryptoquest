import * as THREE from 'three';
import { World } from './World';
import { Player } from './Player';
import { ethers } from 'ethers';

class GameEngine {
  constructor(canvas, contractAddresses) {
    this.canvas = canvas;
    this.contractAddresses = contractAddresses;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    this.world = null;
    this.player = null;
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }
  
  async initialize(providerOrSigner) {
    if (providerOrSigner) {
      if (providerOrSigner.provider) {
        this.provider = providerOrSigner.provider;
        this.signer = providerOrSigner;
      } else {
        this.provider = providerOrSigner;
        this.signer = providerOrSigner.getSigner();
      }
      
      // Initialize contracts
      await this.initializeContracts();
    }
    
    // Create world and player
    this.world = new World(this.scene);
    this.player = new Player(this.scene, this.camera, this.contracts);
    
    // Position camera
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(directionalLight);
    
    // Start animation loop
    this.animate();
  }
  
  async initializeContracts() {
    const GameItems = await import('../contracts/GameItems.json');
    const GameToken = await import('../contracts/GameToken.json');
    const GameWorld = await import('../contracts/GameWorld.json');
    const GameLogic = await import('../contracts/GameLogic.json');
    
    this.contracts.items = new ethers.Contract(
      this.contractAddresses.items,
      GameItems.abi,
      this.signer
    );
    
    this.contracts.token = new ethers.Contract(
      this.contractAddresses.token,
      GameToken.abi,
      this.signer
    );
    
    this.contracts.world = new ethers.Contract(
      this.contractAddresses.world,
      GameWorld.abi,
      this.signer
    );
    
    this.contracts.logic = new ethers.Contract(
      this.contractAddresses.logic,
      GameLogic.abi,
      this.signer
    );
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    if (this.world) {
      this.world.update();
    }
    
    if (this.player) {
      this.player.update();
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default GameEngine;