import "./style.css";
import * as THREE from "three";
import vShader from "./shaders/vertex.glsl";
import fShader from "./shaders/fragment.glsl";

const loader = new THREE.TextureLoader();
const texture = loader.load("./images/background.jpg");


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
  75,
  aspect.width / aspect.height,
  0.1,
  1000
);
camera.position.z = 800;
scene.add(camera);

const geo = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
const material = new THREE.ShaderMaterial({
  uniforms: {
    u_texture: {
      value: texture
    },
    u_time: {
      value: 0
    },
    u_resolution: { // Add this uniform for resolution
      value: new THREE.Vector2(window.innerWidth, window.innerHeight) // Assuming you're using window dimensions
    }
  },
  vertexShader: vShader,
  fragmentShader: fShader
});
const mesh = new THREE.Mesh(geo, material);
scene.add(mesh);

//Renderer
const canvas = document.querySelector(".draw");
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(aspect.width, aspect.height);

//Clock Class
const clock = new THREE.Clock();

const animate = () => {
  //getElapsedTime
  const elapsedTime = clock.getElapsedTime();

  //Renderer
  renderer.render(scene, camera);

  material.uniforms.u_time.value = elapsedTime;

  //RequestAnimationFrame
  window.requestAnimationFrame(animate);
};
animate();
