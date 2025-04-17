
import * as THREE from 'three';

class CharacterAnimator {
  constructor(model, animations) {
    this.model = model;
    this.mixer = new THREE.AnimationMixer(model);
    this.animations = {};
    this.currentAction = null;
    
    // Process and store animations
    animations.forEach(clip => {
      this.animations[clip.name] = this.mixer.clipAction(clip);
    });
  }
  
  playAnimation(name, fadeTime = 0.2) {
    if (!this.animations[name]) {
      console.warn(`Animation ${name} not found`);
      return;
    }
    
    const newAction = this.animations[name];
    
    if (this.currentAction === newAction) return;
    
    if (this.currentAction) {
      this.currentAction.fadeOut(fadeTime);
    }
    
    newAction.reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(fadeTime)
      .play();
    
    this.currentAction = newAction;
  }
  
  update(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
  }
}

export default CharacterAnimator;