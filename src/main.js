// main.js - your original behavior, just cleanly composed
import { WebGLCheck } from './webglCheck.js';
import { createScene } from './SceneSetup.js';
import { ScrollManager } from './ScrollManager.js';
import * as THREE from 'three';

WebGLCheck();

const { scene, camera, renderer, frontLight, carModel, quoteEl } = createScene();
const scroll = new ScrollManager();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// Animation loop - 100% your original logic
function animate() {
  requestAnimationFrame(animate);

  const progress = scroll.update();

  // Camera: 180° orbit only (your original intent)
  const angle = progress * Math.PI; // ← changed back to Math.PI (180°)
  const radius = 5;
  camera.position.x = Math.sin(angle) * radius;
  camera.position.z = Math.cos(angle) * radius;
  camera.position.y = 1 + progress * 0.8;
  camera.lookAt(0, 0.2, 0);

  // Your exact light + car + quote logic
  frontLight.intensity = THREE.MathUtils.lerp(0, 3.5, progress);
  frontLight.color.setHSL(0.12, 0.8, 0.5 + progress * 0.3);

  if (carModel) {
    carModel.rotation.y = Math.PI / 6 + progress * Math.PI * 0.8;
    carModel.position.y = THREE.MathUtils.lerp(-0.5, 0, progress);
    carModel.scale.setScalar(THREE.MathUtils.lerp(1.2, 1.4, progress ** 2));
  }

  quoteEl.style.opacity = progress > 0.65 ? (progress - 0.65) * 3 : 0;

  renderer.render(scene, camera);
}

animate();