import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import carURL from './assets/model.glb?url';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);

  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 1, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lights - exactly as you had
  scene.add(new THREE.AmbientLight(0x604040, 0.4));

  const backLight = new THREE.DirectionalLight('red', 1.5);
  backLight.position.set(0, 2, -5);
  scene.add(backLight);

  const frontLight = new THREE.DirectionalLight(0xfff0d0, 0);
  frontLight.position.set(0, 2, 6);
  scene.add(frontLight);

  // Car model - your exact setup
  let carModel = null;
  new GLTFLoader().load(carURL, (gltf) => {
    carModel = gltf.scene;
    carModel.scale.set(1.2, 1.2, 1.2);
    carModel.position.y = -0.5;
    carModel.rotation.y = Math.PI / 6;

    carModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(carModel);
  });

  // Quote overlay - your exact HTML + style
  const quoteWrapper = document.createElement('div');
  quoteWrapper.innerHTML = `
    <div style="position:fixed;bottom:10%;left:50%;transform:translateX(-50%);
                color:white;font-size:2.5rem;font-weight:300;text-align:center;
                font-family:'Helvetica Neue',sans-serif;letter-spacing:1px;
                opacity:0;transition:opacity 1.5s ease;">
      “Partnering with us should be a <strong>top-3 decision</strong> of your life.”
    </div>`;
  document.body.appendChild(quoteWrapper);
  const quoteEl = quoteWrapper.querySelector('div');

  return { scene, camera, renderer, frontLight, carModel, quoteEl };
}