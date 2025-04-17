
import * as THREE from 'three';

export function createItemPickupEffect(scene, position, color = 0xffff00) {
  // Create particles
  const particleCount = 15;
  const particles = new THREE.Group();
  
  for (let i = 0; i < particleCount; i++) {
    const geometry = new THREE.SphereGeometry(0.05, 8, 8);
    const material = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 1
    });
    
    const particle = new THREE.Mesh(geometry, material);
    particle.position.copy(position);
    particle.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.3,
      Math.random() * 0.5,
      (Math.random() - 0.5) * 0.3
    );
    particle.userData.lifespan = 1 + Math.random();
    particle.userData.age = 0;
    
    particles.add(particle);
  }
  
  scene.add(particles);
  
  // Animation loop
  function animateParticles() {
    let allDead = true;
    
    particles.children.forEach(particle => {
      particle.position.add(particle.userData.velocity);
      particle.userData.velocity.y -= 0.01; // Gravity
      
      particle.userData.age += 0.016;
      const lifeRatio = particle.userData.age / particle.userData.lifespan;
      
      if (lifeRatio < 1) {
        allDead = false;
        particle.material.opacity = 1 - lifeRatio;
        particle.scale.setScalar(1 - lifeRatio * 0.5);
      } else {
        particle.visible = false;
      }
    });
    
    if (!allDead) {
      requestAnimationFrame(animateParticles);
    } else {
      scene.remove(particles);
    }
  }
  
  animateParticles();
}