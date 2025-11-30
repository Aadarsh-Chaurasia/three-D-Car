// src/main.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import carURL from './assets/model.glb?url';
import { ScrollManager } from './scroll.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);
// scene.fog = new THREE.FogExp2(0x0d0d0d, 0.04);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// WebGL Fallback
if (!renderer.getContext()) {
  document.body.innerHTML = `<div style="color:white; font-family:sans-serif; text-align:center; padding:10%; background:#000; height:100vh; display:grid; place-items:center;">
    <h1>This experience requires WebGL.</h1>
    <p>Please update your browser or device.</p>
  </div>`;
  throw new Error("WebGL not supported");
}

// Lights
const ambient = new THREE.AmbientLight(0x604040, 0.4);
scene.add(ambient);

const backLight = new THREE.DirectionalLight('red', 1.5);
backLight.position.set(0, 2, -5);
scene.add(backLight);

const frontLight = new THREE.DirectionalLight(0xfff0d0, 0);
frontLight.position.set(0, 2, 6);
scene.add(frontLight);

// Car reference
let carModel = null;

// Load car
const loader = new GLTFLoader();
loader.load(carURL, (gltf) => {
  carModel = gltf.scene;
  carModel.scale.set(1.2, 1.2, 1.2);
  carModel.position.y = -0.5;
  carModel.rotation.y = Math.PI / 6; // initially at 30 degree angle

  // enable shadow casting on all meshes
  carModel.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(carModel);
});

// Scroll manager
const scroll = new ScrollManager();

// Quote overlay
const quote = document.createElement('div');
quote.innerHTML = `
  <div style="position:fixed; 
              bottom:10%; 
              left:50%; 
              transform:translateX(-50%); 
              color:white; 
              font-size:2.5rem; 
              font-weight:300; 
              text-align:center;
              font-family:'Helvetica Neue', sans-serif; 
              letter-spacing:1px;
              opacity:0; 
              transition:opacity 1.5s ease;"
              >
    “Partnering with us should be a <strong>top-3 decision</strong> of your life.”
  </div>
`;
document.body.appendChild(quote);
const quoteEl = quote.querySelector('div');

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const progress = scroll.update(); // 0 → 1

  // 1. Camera orbit (smooth horizontal)
  const angle = progress * Math.PI * 2; // full circle
  const radius = 5;
  camera.position.x = Math.sin(angle) * radius;
  camera.position.z = Math.cos(angle) * radius;
  camera.position.y = 1 + progress * 0.8; // slight rise
  camera.lookAt(0, 0.2, 0);

  // 2. Front light reveal
  frontLight.intensity = THREE.MathUtils.lerp(0, 3.5, progress);
  frontLight.color.setHSL(0.12, 0.8, 0.5 + progress * 0.3);

  // 3. Car "comes alive"
  if (carModel) {
    carModel.rotation.y = Math.PI / 6 + progress * Math.PI * 0.8;
    carModel.position.y = THREE.MathUtils.lerp(-0.5, 0, progress);
    carModel.scale.setScalar(THREE.MathUtils.lerp(1.2, 1.4, progress ** 2));
  }

  // 4. Quote reveal at ~70%
  quoteEl.style.opacity = progress > 0.65 ? (progress - 0.65) * 3 : 0;

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});