import { createScene } from './SceneSetup.js';
import { ScrollController } from './ScrollController.js';
import { initWebGLCheck } from './webglCheck.js';

// Check WebGL compatibility
initWebGLCheck();

const { scene, camera, renderer, frontLight, car } = createScene();
const scroll = new ScrollController();

// Quote overlay
const quote = document.createElement('div');
quote.textContent = '“Partnering with us should be a top-3 decision of your life.”';
quote.style.cssText = `
  position:fixed;bottom:10%;left:50%;transform:translateX(-50%);
  color:#fff;font:300 clamp(1.8rem,4vw,3rem)/1.4 "Helvetica Neue",sans-serif;
  text-align:center;opacity:0;pointer-events:none;
`;
document.body.appendChild(quote);


// Resize
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});


// Animation loop
const animate = () => {
  requestAnimationFrame(animate);
  const t = scroll.update();

  // Camera orbit
  const angle = t * Math.PI * 2;
  camera.position.x = Math.sin(angle) * 5;
  camera.position.z = Math.cos(angle) * 5;
  camera.position.y = 1 + t * 0.8;
  camera.lookAt(0, 0.2, 0);

  // Light + car 
  frontLight.intensity = t * 3.8;
  if (car) {
    car.rotation.y = Math.PI / 6 + t * Math.PI * 0.9;
    car.position.y = THREE.MathUtils.lerp(-0.5, 0, t);
    car.scale.setScalar(THREE.MathUtils.lerp(1.3, 1.45, t ** 1.4));
  }
  quote.style.opacity = t > 0.65 ? (t - 0.65) * 3 : 0;

  renderer.render(scene, camera);
};

animate();