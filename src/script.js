import "./style.css";
import * as THREE from "three";
import vShader from "./shaders/Lines/vertex.glsl";
import fShader from "./shaders/Lines/fragment.glsl";

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
    u_time: {
      value: 0
    },
    u_resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    }
  },
  vertexShader: vShader,
  fragmentShader: fShader
});
const mesh = new THREE.Mesh(geo, material);
scene.add(mesh);
// New plane for a stream embed
/*
const streamDimension = {
  width: 1500,
  height: 750
};
const streamGeo = new THREE.PlaneGeometry(streamDimension.width, streamDimension.height);
const streamMaterial = new THREE.MeshBasicMaterial({
  color: "#000000"
});
const streamMesh = new THREE.Mesh(streamGeo, streamMaterial);

streamMesh.position.z = 0;
streamMesh.position.x = -streamDimension.width / 4.2;
streamMesh.position.y = streamDimension.height / 12;

scene.add(streamMesh);
*/

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
