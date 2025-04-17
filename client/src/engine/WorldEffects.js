
import * as THREE from 'three';

export class WorldAnimator {
  constructor(scene) {
    this.scene = scene;
    this.animatedObjects = [];
    this.clock = new THREE.Clock();
  }
  
  addFloatingItem(object, amplitude = 0.1, frequency = 1) {
    const baseY = object.position.y;
    
    this.animatedObjects.push({
      object,
      update: (time) => {
        object.position.y = baseY + Math.sin(time * frequency) * amplitude;
        object.rotation.y += 0.01;
      }
    });
    
    return object;
  }
  
  addPulsatingLight(light, minIntensity = 0.5, maxIntensity = 1.5, frequency = 0.5) {
    const baseIntensity = light.intensity;
    
    this.animatedObjects.push({
      object: light,
      update: (time) => {
        const pulseFactor = (Math.sin(time * frequency) + 1) / 2; // 0 to 1
        light.intensity = baseIntensity * (minIntensity + pulseFactor * (maxIntensity - minIntensity));
      }
    });
    
    return light;
  }
  
  createWaterSurface(width = 100, height = 100, resolution = 64) {
    // Create a plane for water
    const geometry = new THREE.PlaneGeometry(width, height, resolution, resolution);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0077ff,
      transparent: true,
      opacity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    
    const water = new THREE.Mesh(geometry, material);
    water.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    
    // Store original vertex positions
    const originalPositions = [];
    const positions = geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      originalPositions.push({
        x: positions[i],
        y: positions[i + 1],
        z: positions[i + 2]
      });
    }
    
    // Animate water surface
    this.animatedObjects.push({
      object: water,
      update: (time) => {
        const positions = geometry.attributes.position.array;
        
        for (let i = 0, j = 0; i < positions.length; i += 3, j++) {
          const orig = originalPositions[j];
          positions[i + 1] = orig.y + 
            Math.sin(time * 2 + orig.x / 5) * 0.2 + 
            Math.cos(time * 1.5 + orig.z / 4) * 0.3;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
      }
    });
    
    this.scene.add(water);
    return water;
  }
  
  update() {
    const time = this.clock.getElapsedTime();
    
    this.animatedObjects.forEach(obj => {
      obj.update(time);
    });
  }
}