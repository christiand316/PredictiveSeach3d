import "./style.css";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";

// staging logic
const searchInput = document.getElementById("searchBar");

// staging visual world
const scene = new THREE.Scene();
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 50);
camera.rotation.w = Math.PI / 2;
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setClearColor(0xa3a3a3);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#sub").appendChild(renderer.domElement);
const pointLight = new THREE.PointLight(0xa7713b);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight("lightblue");
scene.add(pointLight, ambientLight);

const groundGeo = new THREE.PlaneGeometry(300, 300);
const groundMat = new THREE.MeshStandardMaterial({
  color: "light blue",
});
const background = new THREE.Mesh(groundGeo, groundMat);
background.quaternion.setFromEuler(0, 0, -Math.PI / 2);
scene.add(background);

const borderTexture = new THREE.TextureLoader().load("assets/border.png");
const borderMat = new THREE.MeshBasicMaterial({
  map: borderTexture,
  transparent: true,
});
const borderGeo = new THREE.PlaneGeometry(30, 30);
const borderMesh = new THREE.Mesh(borderGeo, borderMat);
borderMesh.position.set(0, 10.5, 20);
borderMesh.scale.set(1.1, 0.73);
scene.add(borderMesh);

const searchBorderTexture = new THREE.TextureLoader().load(
  "assets/searchborder.png"
);
const searchBorderMat = new THREE.MeshBasicMaterial({
  map: searchBorderTexture,
  transparent: true,
});
const searchBorderGeo = new THREE.PlaneGeometry(30, 30);
const searchBoarderMesh = new THREE.Mesh(searchBorderGeo, searchBorderMat);
searchBoarderMesh.position.set(0, 19.5, 7.2);
searchBoarderMesh.scale.set(0.45, 0.4);

scene.add(searchBoarderMesh);
// stage physics world
const world = new CANNON.World();
world.gravity.set(0, -0.6, 0);
world.broadphase = new CANNON.NaiveBroadphase();

const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);
const groundPhysMat = new CANNON.Material();
groundPhysMat.restitution = 3;
groundPhysMat.friction = 0;

const boxPhysMat = new CANNON.Material();
boxPhysMat.restitution = 0;
boxPhysMat.friction = 0;

const groundBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(25, 25, 1)),
  type: CANNON.Body.STATIC,
  material: groundPhysMat,
  position: new CANNON.Vec3(0, -1, 0),
});

world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
groundMesh.position.copy(groundBody.position);
groundMesh.quaternion.copy(groundBody.quaternion);

// tools
//const orbit = new OrbitControls(camera, renderer.domElement);
//orbit.update();

const cannonDebugger = new CannonDebugger(scene, world);

// create box for bubbles
const leftWall = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(10, 25, 1)),
  type: CANNON.Body.STATIC,
  material: boxPhysMat,
  position: new CANNON.Vec3(-20, 20, 0),
});
leftWall.quaternion.setFromEuler(0, -Math.PI / 2, 0);

const rightWall = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(10, 25, 1)),
  type: CANNON.Body.STATIC,
  material: boxPhysMat,
  position: new CANNON.Vec3(20, 20, 0),
});
rightWall.quaternion.setFromEuler(0, -Math.PI / 2, 0);

const backWall = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(25, 25, 1)),
  type: CANNON.Body.STATIC,
  material: boxPhysMat,
  position: new CANNON.Vec3(0, 20, -10),
});
backWall.quaternion.setFromEuler(0, 0, -Math.PI / 2);

const frontWall = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(25, 25, 1)),
  type: CANNON.Body.STATIC,
  material: boxPhysMat,
  position: new CANNON.Vec3(0, 20, 10),
});
frontWall.quaternion.setFromEuler(0, 0, -Math.PI / 2);
world.addBody(leftWall);
world.addBody(rightWall);
world.addBody(backWall);
world.addBody(frontWall);

const boxSlope = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(28, 11, 1)),
  type: CANNON.Body.STATIC,
  material: boxPhysMat,
  position: new CANNON.Vec3(0, 25, -5),
});
boxSlope.quaternion.setFromEuler(-20, 0, 0);
const boxInsideWall = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(20, 10, 1)),
  type: CANNON.Body.STATIC,
  material: boxPhysMat,
  position: new CANNON.Vec3(0, 10, 4.5),
});
const boxCeiling = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(25, 25, 1)),
  type: CANNON.Body.STATIC,
  material: groundPhysMat,
  position: new CANNON.Vec3(0, 45, 0),
});
boxCeiling.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(boxCeiling);
world.addBody(boxInsideWall);
world.addBody(boxSlope);

//
//
//
//
// sets up css labels for bubbles
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "-13px"; // adjust based of fixed position of camera
labelRenderer.domElement.style.textAlign = "center";
labelRenderer.domElement.style.pointerEvents = "none";
labelRenderer.domElement.style.scale = "95%";
//document.body.appendChild( labelRenderer.domElement );
//const canvasSelector = document.querySelector('#bg')
//document.querySelector('#bg').appendChild(labelRenderer.domElement)
//
//
//
// searchinput and creates array of valid results
const fruit = [
  "Apple",
  "Apricot",
  "Avocado 🥑",
  "Banana",
  "Bilberry",
  "Blackberry",
  "Blackcurrant",
  "Blueberry",
  "Boysenberry",
  "Currant",
  "Cherry",
  "Coconut",
  "Cranberry",
  "Cucumber",
  "Custard apple",
  "Damson",
  "Date",
  "Dragonfruit",
  "Durian",
  "Elderberry",
  "Feijoa",
  "Fig",
  "Gooseberry",
  "Grape",
  "Raisin",
  "Grapefruit",
  "Guava",
  "Honeyberry",
  "Huckleberry",
  "Jabuticaba",
  "Jackfruit",
  "Jambul",
  "Juniper berry",
  "Kiwifruit",
  "Kumquat",
  "Lemon",
  "Lime",
  "Loquat",
  "Longan",
  "Lychee",
  "Mango",
  "Mangosteen",
  "Marionberry",
  "Melon",
  "Cantaloupe",
  "Honeydew",
  "Watermelon",
  "Miracle fruit",
  "Mulberry",
  "Nectarine",
  "Nance",
  "Olive",
  "Orange",
  "Clementine",
  "Mandarine",
  "Tangerine",
  "Papaya",
  "Passionfruit",
  "Peach",
  "Pear",
  "Persimmon",
  "Plantain",
  "Plum",
  "Pineapple",
  "Pomegranate",
  "Pomelo",
  "Quince",
  "Raspberry",
  "Salmonberry",
  "Rambutan",
  "Redcurrant",
  "Salak",
  "Satsuma",
  "Soursop",
  "Star fruit",
  "Strawberry",
  "Tamarillo",
  "Tamarind",
  "Yuzu",
];
let searchResults = [];
let objects = [];
let bodies = [];
let numObjects = 0;

let previousInput;
let input = "";
let counter = 0;
function timeOut() {
  if (input.length === 0) {
    searchResults = [];
    renderSuggestions(searchResults);
  }
  if (counter > 4 && input === previousInput) {
    counter = 0;
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].collisionResponse = false;
      counter = 0;
    }
    setTimeout(clearBubbles, 2000);
  }
  counter++;
  previousInput = input;
}
setInterval(timeOut, 1500);

function clearBubbles() {
  for (let i = 0; i < objects.length; i++) {
    scene.remove(objects[i]);
    world.removeBody(bodies[i]);
    //objects[i].geometry.dispose();
    //objects[i].material.dispose();
  }

  bodies = [];
  objects = [];
  const elements = document.querySelectorAll(".purge");
  elements.forEach(function (element) {
    element.remove();
  });

  bubbleGeneration(input);
}

searchInput.addEventListener("input", (e) => {
  input = searchInput.value;
  console.log(input);
  //bubbleGeneration(input)
});

function bubbleGeneration(input) {
  if (input === undefined) {
    // will allow for inital spawn of bubbles
    input = 0;
  }
  if (input.length === 0) {
    return;
  }
  if (input.length > 0) {
    searchResults = filterFruit(fruit, input);
  }
  renderSuggestions(searchResults);
}

function filterFruit(arrFromCheckFirstLetter, passedInput) {
  return arrFromCheckFirstLetter.filter(function (item) {
    return item.toLowerCase().includes(passedInput);
  });
}

function renderSuggestions(arr) {
  let counter = 0;

  // add labeled bubbles
  for (let i = 0; i < arr.length; i++) {
    bubbleCreator(i);

    labelRenderer.scale = 80 % //
    labelRenderer.domElement.classList.add("purge");
    document.querySelector("#sub").appendChild(labelRenderer.domElement);

    const bubbleDomElement = document.createElement("p");
    bubbleDomElement.classList.add("purge");
    bubbleDomElement.textContent = arr[i];

    const bubbleLabel = new CSS2DObject(bubbleDomElement);

    objects[i].add(bubbleLabel);
  }
  //populate with empty bubbles
  for (let i = 0; i < 30 - arr.length; i++) {
    bubbleCreator(i);
  }
}
function bubbleCreator(i) {
  const texture = new THREE.TextureLoader().load("assets/bubble.png");
  // prevents texture from looking even more blurry
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  const material = new CANNON.Material();
  material.restitution = 0.5;
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const sprite = new THREE.Sprite(spriteMaterial);

  const geometry = new THREE.BoxGeometry(0, 0, 0);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(Math.random() * 13 - 5, Math.random() * 13 + 30, 7);

  scene.add(mesh);
  objects.push(mesh);

  const sphereBody = new CANNON.Sphere(1.5);
  const body = new CANNON.Body({
    mass: 0.05,
    shape: sphereBody,
    material: material,
  });
  body.position.set(
    objects[i].position.x,
    objects[i].position.y,
    objects[i].position.z
  );
  world.addBody(body);
  bodies.push(body);
  numObjects++;

  sprite.scale.set(6, 4, 6);
  objects[i].add(sprite);
}

bubbleGeneration();

//
// animation loop
//
function animate() {
  //cannonDebugger.update();
  requestAnimationFrame(animate);
  labelRenderer.render(scene, camera);
  // control world speed
  world.step(1 / 60);
  // Render the Three.js scene
  renderer.render(scene, camera);

  if (objects.length > 0) {
    for (let i = 0; i < objects.length; i++) {
      let posx = bodies[i].position.x;
      let posy = bodies[i].position.y;
      let posz = bodies[i].position.z;

      let quatx = bodies[i].quaternion.x;
      let quaty = bodies[i].quaternion.y;
      let quatz = bodies[i].quaternion.z;
      let quatw = bodies[i].quaternion.w;

      objects[i].position.set(posx, posy, posz);
      objects[i].quaternion.set(quatx, quaty, quatz, quatw);
    }
  }
}

// Start the animation loop
animate();

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth - 2, window.innerHeight - 2);
});
