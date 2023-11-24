import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import vShader from "./shaders/vertex.glsl";
import fShader from "./shaders/fragment.glsl";
import gsap from 'gsap';

//elements
const buttons = document.getElementsByTagName("a");

//GLTFLoader
const gltfLoader = new GLTFLoader();
//DRACOLoader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

//Scene
const scene = new THREE.Scene();

//Resizing
window.addEventListener("resize", () => {
  //Update Size
  aspect.width = window.innerWidth;
  aspect.height = window.innerHeight;

  //New Aspect Ratio
  camera.aspect = aspect.width / aspect.height;
  camera.updateProjectionMatrix();

  //New RendererSize
  renderer.setSize(aspect.width, aspect.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Camera
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  30,
  aspect.width / aspect.height,
  0.01,
  100
);
camera.position.z = 10;
scene.add(camera);

//Renderer
const canvas = document.querySelector(".draw");
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setClearColor("#27282c", 1.0);
renderer.setSize(aspect.width, aspect.height);

const firstModelsColors = {
  red: "red",
  yellow: "yellow",
}
const secondModelsColors = {
  blue: "blue",
  white: "white",
}

const models = [];

// Loading Models
// 1st model
gltfLoader.load('/models/1/1.glb', (glb) => {
  glb.scene.traverse((child) => {
    if (child.isMesh) {
      const nonIndexedGeometry = child.geometry.toNonIndexed();
      child.geometry = nonIndexedGeometry;
    }
  });
  // Increase vertices
  const samplerMesh = new MeshSurfaceSampler(glb.scene.children[0]).build();
  const particlesNumber = 25000;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesArray = new Float32Array(particlesNumber * 3);
  for (let i = 0; i < particlesNumber; i++) {
    const particlesPosition = new THREE.Vector3();
    samplerMesh.sample(particlesPosition);
    particlesArray.set(
      [particlesPosition.x, particlesPosition.y, particlesPosition.z], 
      i * 3
    );
  }
  particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(particlesArray, 3)
  );
  // Changing model into particles
  glb.scene.children[0] = new THREE.Points(
    particlesGeometry, 
    new THREE.RawShaderMaterial({
      vertexShader: vShader,
      fragmentShader: fShader,
      uniforms: {
        u_firstColor: {value: new THREE.Color(firstModelsColors.red)},
        u_secondColor: {value: new THREE.Color(firstModelsColors.yellow)},
        u_scale: {value: 0.0},
      },
      depthTest: false,
      blending: THREE.AdditiveBlending
    }),
  );

  glb.scene.children[0].scale.set(0.7, 0.7, 0.7);
  glb.scene.children[0].position.x = 1.5;
  glb.scene.children[0].rotation.y = Math.PI * 0.5;
  models[0] = glb.scene;
});
// 2nd model
gltfLoader.load('/models/2/2.glb', (glb) => {
  glb.scene.traverse((child) => {
    if (child.isMesh) {
      const nonIndexedGeometry = child.geometry.toNonIndexed();
      child.geometry = nonIndexedGeometry;
    }
  });
  // Increase vertices
  const samplerMesh = new MeshSurfaceSampler(glb.scene.children[0]).build();
  const particlesNumber = 25000;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesArray = new Float32Array(particlesNumber * 3);
  for (let i = 0; i < particlesNumber; i++) {
    const particlesPosition = new THREE.Vector3();
    samplerMesh.sample(particlesPosition);
    particlesArray.set(
      [particlesPosition.x, particlesPosition.y, particlesPosition.z], 
      i * 3
    );
  }
  particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(particlesArray, 3)
  );
  // Changing model into particles
  glb.scene.children[0] = new THREE.Points(
    particlesGeometry, 
    new THREE.RawShaderMaterial({
      vertexShader: vShader,
      fragmentShader: fShader,
      uniforms: {
        u_firstColor: {value: new THREE.Color(secondModelsColors.blue)},
        u_secondColor: {value: new THREE.Color(secondModelsColors.white)},
        u_scale: {value: 0.0},
      },
      depthTest: false,
      blending: THREE.AdditiveBlending
    }),
  );

  glb.scene.children[0].scale.set(0.3, 0.3, 0.3);
  glb.scene.children[0].rotation.x = -Math.PI * 0.5;
  glb.scene.children[0].position.x = 0.7;
  glb.scene.children[0].rotation.z = -Math.PI * 0.5;
  models[1] = glb.scene;
});

// Button 1
buttons[0].addEventListener('click', () => {
  // Change scale
  gsap.to(models[0].children[0].material.uniforms.u_scale, {
    value: 1,
    duration: 1.5,
  });
  gsap.to(models[1].children[0].material.uniforms.u_scale, {
    value: 0,
    duration: 1.5,
    onComplete: () => {
      scene.remove(models[1]);
    }
  });

  scene.add(models[0]);
});

// Button 2
buttons[1].addEventListener('click', () => {
  // Change scale
  gsap.to(models[1].children[0].material.uniforms.u_scale, {
    value: 1,
    duration: 1.5
  });
  gsap.to(models[0].children[0].material.uniforms.u_scale, {
    value: 0,
    duration: 1.5,
    onComplete: () => {
      scene.remove(models[0]);
    }
  });

  scene.add(models[1]);
});

//OrbitControl
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

//Clock Class
const clock = new THREE.Clock();

const animate = () => {
  //getElapsedTime
  const elapsedTime = clock.getElapsedTime();

  //Update Controls
  orbitControls.update();

  //Renderer
  renderer.render(scene, camera);

  //RequestAnimationFrame
  window.requestAnimationFrame(animate);
};
animate();
