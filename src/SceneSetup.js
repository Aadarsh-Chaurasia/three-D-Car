// SceneSetup.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import carURL from './assets/model.glb?url';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0d0d);

  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 1, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x404060, 0.4));

  const backLight = new THREE.DirectionalLight(0x4488ff, 1.8);
  backLight.position.set(0, 2, -6);
  scene.add(backLight);

  const frontLight = new THREE.DirectionalLight(0xfff0d0, 0);
  frontLight.position.set(0, 2, 6);
  scene.add(frontLight);

  let car = null;
  new GLTFLoader().load(carURL, (gltf) => {
    car = gltf.scene;
    car.scale.setScalar(1.3);
    car.position.set(0, -0.5, 0);
    car.rotation.y = Math.PI / 6;
    scene.add(car);
  });

  return { scene, camera, renderer, frontLight, car };
}