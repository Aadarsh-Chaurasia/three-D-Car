import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// IMPORTANT: Vite asset import
import islandURL from './assets/model.glb?url';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 4);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambient = new THREE.AmbientLight(0x222233, 0.5);
scene.add(ambient);

// back light (behind car, near camera)
const backLight = new THREE.DirectionalLight(0xffffff, 1.2);
backLight.position.set(0, 3, -6);
scene.add(backLight);

// front light (in front of car - starts dim)
const frontLight = new THREE.DirectionalLight(0xfff4d0, 0.0);
frontLight.position.set(0, 3, 6);
scene.add(frontLight);

// Load GLB
const loader = new GLTFLoader();

loader.load(
  islandURL,
  (gltf) => {
    const model = gltf.scene;

    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    scene.add(model);

    console.log("Model loaded:", model);

    // Auto-fit camera to model
    fitCameraToObject(camera, model, 1.2);
  },
  (progress) => {
    console.log(`Loaded: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
  },
  (error) => {
    console.error("GLB Load Error:", error);
  }
);

// Auto fit camera helper
function fitCameraToObject(camera, object, offset = 1.25) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = offset * Math.max(fitHeightDistance, fitWidthDistance);

  camera.position.set(center.x, center.y + maxSize * 0.2, center.z + distance);
  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();
}

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

