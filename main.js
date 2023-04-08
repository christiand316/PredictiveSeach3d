import './style.css';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import CannonDebugger from 'cannon-es-debugger';
import {TTFLoader} from 'three/examples/jsm/loaders/TTFLoader'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'
// staging logic
const searchInput = document.getElementById('searchBar');

// staging visual world
const scene = new THREE.Scene();
const winWidth = window.innerWidth
const winHeight = window.innerHeight
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 45, 45);
  
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg')});
renderer.setClearColor(0xA3A3A3);
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer.domElement);
 ///////////////////////////////////////
document.querySelector('#sub').appendChild(renderer.domElement)
const pointLight = new THREE.PointLight(0xa7713b);
pointLight.position.set(5, 5, 5);


const ambientLight = new THREE.AmbientLight('lightblue');
scene.add(pointLight, ambientLight);


const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    side: THREE.DoubleSide,
 });

// stage physics world 
const world = new CANNON.World();
world.gravity.set(0, -8.82, 0);
world.broadphase = new CANNON.NaiveBroadphase();
  
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);
const groundPhysMat = new CANNON.Material();
groundPhysMat.restitution =1;
  
const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(15, 15, 1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat,
    position: new CANNON.Vec3(0, -1, 0)
    
});

world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
groundMesh.position.copy(groundBody.position);
groundMesh.quaternion.copy(groundBody.quaternion);


// tools 
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const cannonDebugger = new CannonDebugger(scene, world)


// create box for bubbles
const leftWall = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(10, 25, 1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat,
    position: new CANNON.Vec3(-10, 20, 0)
});
leftWall.quaternion.setFromEuler(0, -Math.PI / 2, 0);

const rightWall = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(10, 25, 1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat,
    position: new CANNON.Vec3(10, 20, 0)
});
rightWall.quaternion.setFromEuler(0, -Math.PI / 2, 0);

const backWall = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(25, 10, 1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat,
    position: new CANNON.Vec3(0, 20, -10)
});
backWall.quaternion.setFromEuler(0, 0, -Math.PI / 2);

const frontWall = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(25, 10, 1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat,
    position: new CANNON.Vec3(0, 20, 10)
});
frontWall.quaternion.setFromEuler(0, 0, -Math.PI / 2);
world.addBody(leftWall)
world.addBody(rightWall)
world.addBody(backWall)
world.addBody(frontWall)

const boxSlopePhysMat = new CANNON.Material();
boxSlopePhysMat.restitution =0;
boxSlopePhysMat.friction = 0;
const boxSlope = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(8, 10, 1)),
    type: CANNON.Body.STATIC,
    material: boxSlopePhysMat,
    position: new CANNON.Vec3(0,25,-5)
})
boxSlope.quaternion.setFromEuler(-20,0,0)
const boxInsideWall = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(10, 10, 1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat,
    position: new CANNON.Vec3(0, 10, 4.5)
});
const boxCeiling =  new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(15, 15, 1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat,
    position: new CANNON.Vec3(0, 45, 0)
});
boxCeiling.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(boxCeiling)
world.addBody(boxInsideWall)
world.addBody(boxSlope)

//
//
//
//
// sets up css labels for bubbles
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '-45px'; // adjust based of fixed position of camera
labelRenderer.domElement.style.pointerEvents = 'none'
labelRenderer.domElement.style.scale = '95%'
//document.body.appendChild( labelRenderer.domElement );
//const canvasSelector = document.querySelector('#bg')
//document.querySelector('#bg').appendChild(labelRenderer.domElement)
//
//
//
// searchinput and creates array of valid results
const fruit = ['Apple', 'Apricot', 'Avocado 🥑', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Coconut', 'Cranberry', 'Cucumber', 'Custard apple', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Juniper berry', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Mangosteen', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Miracle fruit', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Plantain', 'Plum', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];
let searchResults = []; 
let objects = [];
let bodies = [];
let numObjects = 0;

let previousInput
let input;
let counter = 0
function timeOut() {
    console.log('timeout has run')
    
    console.log(previousInput)
    if (input !== previousInput){
        console.log('different input')
    }
    if (counter > 4 && input===previousInput){
        console.log('run despawn')
        counter = 0;
        for(let i = 0; i < bodies.length; i++) {
            bodies[i].collisionResponse = false;
        }
        setTimeout(clearBubbles, 2000)
    }
    //if (if input hasnt been changed in x amount of time despawn anyways) {
    //    //after despawn hits create more filler bubbles 
    //}
    //    bubbleGeneration(input)
    counter++;
    previousInput = input

}
setInterval(timeOut, 1000)

function clearBubbles() {
    for (let i = 0; i < objects.length;i++) {
        scene.remove(objects[i])
        objects[i].geometry.dispose();
        objects[i].material.dispose();
    }

    bodies = []
    objects = []
    const elements = document.querySelectorAll(".purge");
    elements.forEach(function(element) {
        element.remove();
    });

    bubbleGeneration(input)
}

searchInput.addEventListener('input', (e)=> {
	input = searchInput.value;
    console.log(input)
    //bubbleGeneration(input)
})



function bubbleGeneration(input) {
    console.log(input)    
    if (input === undefined){ // will allow for inital spawn of bubbles 
        input = 0
    }
	if (input.length === 0) {
		return
	}
	if (input.length > 0) { 	
		searchResults = filterFruit(fruit, input)
		console.log(searchResults)
	}
	renderSuggestions(searchResults)
}

function filterFruit(arrFromCheckFirstLetter, passedInput) {
	return arrFromCheckFirstLetter.filter(function(item) { 
		return item.toLowerCase().includes(passedInput);
	});
}

function renderSuggestions(arr) {
    let counter = 0

    // add labeled bubbles
    for (let i= 0; i < arr.length; i++){
        bubbleCreator(i)
        
        labelRenderer.scale=80% //
        labelRenderer.domElement.classList.add('purge')
        document.querySelector('#sub').appendChild(labelRenderer.domElement)
        //document.body.appendChild(renderer.domElement);
        /*
        document.body.appendChild(labelRenderer.domElement)
        document.body.appendChild(renderer.domElement);
        */
        const bubbleDomElement = document.createElement('p')
        bubbleDomElement.classList.add('purge')
        bubbleDomElement.textContent = arr[i]
        const bubbleLabel = new CSS2DObject(bubbleDomElement);
        
        objects[i].add(bubbleLabel)

    }
    //populate with empty bubbles
    for(let i=0; i < 10-arr.length; i++) {
    bubbleCreator(i)
    }
}
function bubbleCreator(i) {
    const texture = new THREE.TextureLoader().load( 'assets/bubble.png' );
    // prevents texture from looking even more blurry
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    const spriteMaterial = new THREE.SpriteMaterial( { map: texture,  transparent:true } );
    const sprite = new THREE.Sprite( spriteMaterial );

    const geometry = new THREE.BoxGeometry(0, 0, 0);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(Math.random() * 10 - 5, (Math.random() * 5)+30, Math.random() * 10 - 5);
    scene.add(mesh); objects.push(mesh);
  
    var material = new CANNON.Material();
    material.restitution = 1;

    const sphereBody = new CANNON.Sphere(1.5);
    const body = new CANNON.Body({ mass: .05, shape:sphereBody, material: material });
    body.position.set(objects[i].position.x, objects[i].position.y, objects[i].position.z);
    world.addBody(body); bodies.push(body);
    numObjects++;

    sprite.scale.set(8,6,8)
    objects[i].add(sprite)
}

bubbleGeneration();
let flipFlop = -8.82
//
// animation loop
function addRandomVelocity(){
    if (objects.length === 0) {
        return;
    }
    for (let i = 0; i < numObjects; i++) {
        const upwardVelocity = .005;

        const impulse = new CANNON.Vec3(0, upwardVelocity, 0);
        const offset = new CANNON.Vec3(0, 0, 0);
        bodies[i].applyImpulse(impulse, offset);
        //console.log(Math.random())
    }
    if (Math.random() >.95) {
        
        flipFlop = flipFlop === '-8.82' ? '-8' : '-8.82'
        world.gravity.set(0, flipFlop, 0);
        //console.log(flipFlop)
    }
}
function animate() {
    
    //cannonDebugger.update();
    requestAnimationFrame(animate);
    labelRenderer.render(scene, camera);
    // control world speed
    world.step(1 / 60);
    // Render the Three.js scene
    renderer.render(scene, camera);
    //console.log(flipFlop)
    if (objects.length > 0) {
    for (let i = 0; i < objects.length; i++) {
        let posx = bodies[i].position.x
        let posy = bodies[i].position.y
        let posz = bodies[i].position.z
    
        let quadx = bodies[i].quaternion.x
        let quady = bodies[i].quaternion.y
        let quadz = bodies[i].quaternion.z
        let quadw = bodies[i].quaternion.w
    
    //console.log('poshodl is '+bodies[i].position.x)
    objects[i].position.set(posx, posy, posz)
    objects[i].quaternion.set(quadx,quady,quadz,quadw)
  }
  //addRandomVelocity();
}

}

// Start the animation loop
animate();

window.addEventListener('resize', function() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    labelRenderer.setSize(window.innerWidth-2, window.innerHeight-2)
});