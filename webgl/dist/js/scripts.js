import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { Vector3 } from 'three';
import countries from './countries';

const Nx = 7;
const Ny = 4;
const mass = 1;
const clothSize = 0.30;
const dist = clothSize / Nx;


const flagTextures = [
    // new THREE.TextureLoader().load('./phflag.png'),
    // new THREE.TextureLoader().load('./usflag.png'),
    // new THREE.TextureLoader().load('./flags/ac.svg')
]

countries.forEach(country => {
    flagTextures.push(new THREE.TextureLoader().load('./flags/' + country.flag))
});

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor(0xA3A3A3);
renderer.setClearColor(0xF2F2CF);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    24,
    window.innerWidth / window.innerHeight,
    1,
    2000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const camX = -Nx * 0.5 * dist;
const camY = Ny * 0.5 * dist;

camera.position.set(4, 5, 6);
// camera.lookAt(Math.PI / 180 * 90, 0, Math.PI / 180 * 180);
camera.lookAt(0, 0, 0);
// camera.position.z = 1500;

orbit.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight)

const spotLight = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 8, 1);
spotLight.position.set(-3, 3, 10);
spotLight.target.position.set(0, 0, 0);

scene.add(spotLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, -10);
directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight);

const world = new CANNON.World({
    // gravity: new CANNON.Vec3(0, -19.81, 0)
    gravity: new CANNON.Vec3(0, -9.81, 0)
});


const shape = new CANNON.Particle();

const particles = [];

var toggleWind = false;
var toggleFlag = false;

const width = window.innerWidth;
const height = window.innerHeight;

const cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
cameraOrtho.position.z = 10;


sceneOrtho = new THREE.Scene();


for(let i = 0; i < Nx + 1; i++) {
    particles.push([]);
    for(let j = 0; j < Ny + 1; j++) {
        const particle = new CANNON.Body({
            mass: i === 0 ? 0 : mass,
            shape,
            position: new CANNON.Vec3((i - Nx * 0.5) * dist, (j - Ny * 0.5) * dist, 0),
            velocity: new CANNON.Vec3(0, 0, 0)
            // velocity: new CANNON.Vec3(0, 0, -0.1 * (Ny - j))
        });
        particles[i].push(particle);
        world.addBody(particle);
    }
}

function connect(i1, j1, i2, j2) {
    world.addConstraint(new CANNON.DistanceConstraint(
        particles[i1][j1],
        particles[i2][j2],
        dist
    ));
}

for(let i = 0; i < Nx + 1; i++) {
    for(let j = 0; j < Ny + 1; j++) {
        if(i < Nx)
            connect(i, j, i + 1, j);
        if(j < Ny)
            connect(i, j, i, j + 1);
    }
}

const clothGeometry = new THREE.PlaneGeometry(1, 1, Nx, Ny);

const clothMat = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  //wireframe: true,
  map: flagTextures[0]
});

const clothMesh = new THREE.Mesh(clothGeometry, clothMat);

const cloths = [
    new THREE.Mesh(clothGeometry, clothMat),
    new THREE.Mesh(clothGeometry, clothMat.clone()),
    new THREE.Mesh(clothGeometry, clothMat.clone()),
    new THREE.Mesh(clothGeometry, clothMat.clone())
];

// scene.add(clothMesh);

// const clothMesh2 = new THREE.Mesh(clothGeometry, clothMat);
// clothMesh2.position.set(0.5, 0.5, 0);
// scene.add(clothMesh2);

// const clothMesh3 = new THREE.Mesh(clothGeometry, clothMat);
// clothMesh3.position.set(0, 0.5, 0);
// scene.add(clothMesh3);

// const clothMesh4 = new THREE.Mesh(clothGeometry, clothMat);
// clothMesh4.position.set(-0.5, 0, 0);
// scene.add(clothMesh4);



function updateParticules() {
    let dt = 1 / 60;

    for(let i = 0; i < Nx + 1; i++) {
        for(let j = 0; j < Ny + 1; j++) {
            const index = j * (Nx + 1) + i;

            const positionAttribute = clothGeometry.attributes.position;

            if (toggleWind) {
                const topPoint = new CANNON.Vec3(0.5, 0.5, 0)
                const impulse = new CANNON.Vec3(16 * dt, 12 * dt, 0)

                particles[i][Ny - j].applyImpulse(impulse, topPoint)
            }

            const position = particles[i][Ny - j].position;

            positionAttribute.setXYZ(index, position.x, position.y, position.z);

            positionAttribute.needsUpdate = true;
        }
    }
}

var scoreContainer = new THREE.TextureLoader().load( "./score_container.png" );
var scoreContainerMaterial = new THREE.SpriteMaterial( { map: scoreContainer } );
var scoreSprite = new THREE.Sprite( scoreContainerMaterial );
// console.log(scoreContainerMaterial.map);
scoreSprite.scale.set(632 * 0.25, 206 * 0.25, 1);
scoreSprite.position.set(0, height / 2 - 30, 1);
sceneOrtho.add( scoreSprite );

const sphereSize = 0.025;
const movementRadius = 0.2;

const sphereGeometry = new THREE.SphereGeometry(sphereSize);
const sphereMat = new THREE.MeshPhongMaterial();

const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMat);
sphereMesh.position.set((-Nx * 0.5) * dist, 0.14, -0.03);
// scene.add(sphereMesh);

const geometry = new THREE.CylinderGeometry(0.01, 0.01, 0.60, 10, 10);
const material = new THREE.MeshPhongMaterial();
const flagpole = new THREE.Mesh( geometry, material );
flagpole.position.set((-Nx * 0.5) * dist, -0.18, -0.03);
// scene.add(cylinder);

const boxgeometry = new THREE.BoxGeometry( 0.1, 0.05, 0.1 );
const boxmaterial = new THREE.MeshPhongMaterial();
const flagpoleBase = new THREE.Mesh( boxgeometry, boxmaterial );
flagpoleBase.position.set((-Nx * 0.5) * dist, -0.50, -0.03);
// scene.add( cube );

// floor
const floorBox = new THREE.BoxGeometry( 0.5, 0.02, 0.5 );
const floorMaterial = new THREE.MeshPhongMaterial();
const floor = new THREE.Mesh( floorBox, floorMaterial );
floor.position.set((-Nx * 0.5) * dist, -0.50, -0.03);

const flagGroups = [];

const flagGroup = new THREE.Group();
// flagGroup.add(clothMesh);
flagGroup.add(sphereMesh);
flagGroup.add(flagpole);
flagGroup.add(flagpoleBase);
flagGroup.add(floor);

let sx = (-Nx * 0.5) * dist;
let sy = -0.50;
let sz = -0.03;

let floorDx = 0.42;
let floorDz = -0.42;
let counter = 0;

for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
        if (i != 1 && j != 1) {
            const grp = flagGroup.clone();
            grp.add(cloths[counter++]);

            grp.position.set(0.3 - j * floorDx, sy, sz + i * floorDz);
            flagGroups.push(grp);
            scene.add(grp);
        }
    }
}



const timeStep = 1 / 60;
function animate(time) {
    updateParticules();
    world.step(timeStep);

    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render( sceneOrtho, cameraOrtho );
    
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function nextRound() {
    toggleWind = !toggleWind;

    if (toggleWind) {
        toggleFlag = !toggleFlag;
        for(let i = 0; i < cloths.length; ++i) {
            cloths[i].material.map = flagTextures[Math.floor(Math.random() * flagTextures.length)]
            cloths[i].material.needsUpdate = true;
        }

    }
}

var touched = false;
window.addEventListener('touchstart', () => {
    touched = true;
});
window.addEventListener('touchend', () => {
    if (touched) {
        nextRound();
        touched = false;
    }
});

window.addEventListener('mouseup', function() {
    nextRound();
});