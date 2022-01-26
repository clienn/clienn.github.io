const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas, true);
const hexTiles = [];
const tileAnimations = [];

const directions = {
    NE: 150, SE: 210, E: 90, NW: 30, W: 270, SW: 330
};

directions[directions.NE] = [-1, 1, 'NE'];
directions[directions.SE] = [1, 1, 'SE'];
directions[directions.E] = [0, 1, 'E'];
directions[directions.NW] = [-1, -1, 'NW'];
directions[directions.W] = [0, -1, 'W'];
directions[directions.SW] = [1, -1, 'SW'];

const directionList = [directions.NE, directions.E, directions.SE, directions.SW, directions.W, directions.NW];

const GRID_SIZE = 1;
const HEX_SIZE = 0.53;
const HEX_W = Math.sqrt(3) * HEX_SIZE;
const HEX_H = (2 * HEX_SIZE);
const ROW_LEN = 0;
const FACE_COLORS = {
    FRONT: [],
    BACK: [],
};

var NOW = 0;
var DELTA = 0;
var THEN = 0;
const FRAME_RATE = 4;
const Q = [];

const usedCoordinates = {};
const animatingTiles = [];

const ANIMATION = {
    HEX: {
        ROTATE_X: new BABYLON.Animation("rotateX", "rotation.x", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
    }
}

const HEX = {
    tiles: {}
}

const MAX_GENERATIONS = 20;
const RANDOM = {
    THRESHOLD: {
        TILES: 0,
        DIRECTIONS: 0,
    }
}


const availableTiles = {};
var animateFlag = 0;

var material = null;


function createScene() {
    // create a scene
    const scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(45), BABYLON.Tools.ToRadians(45), 20, BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = 5;

    camera.radius = 4 * 4;
    camera.upperRadiusLimit = camera.radius + 5;

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // create light
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    material = new BABYLON.StandardMaterial(scene);
    material.alpha = 1;
    material.diffuseColor = new BABYLON.Color3(0.4, 0.835, 0.968);

    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 0.1 }, scene);
    sphere.position.y = 0.2;

    let url = location.href;

    let match = url.match(/\?val=(\d)/);

    if (match && match[1] == 1) {
        RANDOM.THRESHOLD.TILES = 50;
        RANDOM.THRESHOLD.DIRECTIONS = 50;

        let animElem = document.getElementById('animStyle');
        animElem.value = 1;
    }

    createHexAt(0, 0, scene);

    const keyFrames = [];

    keyFrames.push({
        frame: 0,
        value: Math.PI / 180 * -180
    });

    keyFrames.push({
        frame: FRAME_RATE,
        value: 0
    });

    keyFrames.push({
        frame: FRAME_RATE * 2,
        value: Math.PI / 180 * 180,
    });

    ANIMATION.HEX.ROTATE_X.setKeys(keyFrames);

    scene.onPointerDown = function (evt, pickResult) {
        if (pickResult.pickedMesh){

            let name = pickResult.pickedMesh.name;

            let from = HEX.tiles[name].animation.from;
            let to = HEX.tiles[name].animation.to;

            scene.beginAnimation(pickResult.pickedMesh, from, to, false).onAnimationEnd = function() {
                HEX.tiles[name].animation.to = to;
                HEX.tiles[name].animation.from = from;
            }
        }

        // generateRandomHex();
        animateFlag = (animateFlag + 1);
        // console.log(animateFlag, animatingTiles.length, Q.length);
    };

    FACE_COLORS.FRONT = getHexFaceIndices(9, scene);

    // hexTiles[0].setVerticesData(BABYLON.VertexBuffer.ColorKind, FACE_COLORS.FRONT);
    // hexTiles[1].setVerticesData(BABYLON.VertexBuffer.ColorKind, FACE_COLORS.FRONT);

    updateDelta();

    let t = 0, speed = 50, addDelay = true, delay = 1;
    let generations = 0;

    scene.registerBeforeRender(function() {
        updateDelta();

        if (Math.floor(t) >= delay) {
            while (Q.length > 0) {
                let name = Q.pop();

                let from = HEX.tiles[name].animation.from;
                let to = HEX.tiles[name].animation.to;

                let tile = scene.getMeshByName(name);
                animatingTiles.push(name);
                
                scene.beginAnimation(tile, from, to, false).onAnimationEnd = function() {
                    resetPivot(name, scene);
                    animatingTiles.pop();
                }

                if (addDelay) {
                    break;
                }
            }

            t = 0;
        }

        if (generations < MAX_GENERATIONS) {
            if (Q.length == 0 && animateFlag > 1 && animatingTiles.length == 0) {
                generateRandomHex(RANDOM.THRESHOLD.TILES, RANDOM.THRESHOLD.DIRECTIONS);
                ++generations;
            }
        }

        t = t + speed * DELTA;
    });
    
    return scene;
}

function setHexPivot(name, direction, scene) {
    let tile = scene.getMeshByName(name);

    let deg = direction;
    let rad = (Math.PI / 180 * deg);
    let hw = HEX_W;

    if (deg == directions.W) {
        hw /= 2;
    } else if (deg == directions.E) {
        hw /= -2;
    }

    let s = 1;
    if (deg == directions.NW || deg ==directions.W || deg ==directions.SE) {
        s = -1;
    }

    var pilotStart = new BABYLON.Vector3(tile.position.x, tile.position.y, tile.position.z);

    let px = hw * Math.cos(rad) * s;
    let pz = hw * Math.sin(rad) * s;
    
    var pivotAt = new BABYLON.Vector3(pilotStart.x + px, pilotStart.y, pilotStart.z + pz);
    var theta = Math.PI / 180 * (360 - deg - 90);

    let pivotResult = pilotStart.subtract(pivotAt);

    if (deg == directions.SW || deg == directions.SE || deg == directions.W || deg == directions.E) {
        tile.position.x = pilotStart.x;
        tile.position.z = pilotStart.z + pivotResult.z * 2;

        if (deg == directions.W) {
            tile.rotation.x = Math.PI / 180 * 180;
            HEX.tiles[name].animation.from = FRAME_RATE * 2;
            HEX.tiles[name].animation.to = FRAME_RATE;
        }

        if (deg == directions.SE) {
            HEX.tiles[name].animation.from = FRAME_RATE;
            HEX.tiles[name].animation.to = FRAME_RATE * 2;
        }
    } else {
        tile.position.x = pilotStart.x + pivotResult.x;
        tile.position.z = pilotStart.z - pivotResult.z;

        if (deg == directions.NE) {
            HEX.tiles[name].animation.from = FRAME_RATE * 2;
            HEX.tiles[name].animation.to = FRAME_RATE;
        } else {
            HEX.tiles[name].animation.from = 0;
            HEX.tiles[name].animation.to = FRAME_RATE;
        }

        tile.rotation.x = Math.PI / 180 * 180;
    }

    HEX.tiles[name].animation.direction = direction;
    HEX.tiles[name].animation.active = 1;

    tile.setPivotMatrix(BABYLON.Matrix.Translation(pivotResult.x, pivotResult.y, pivotResult.z));

    tile.rotation.y = theta;
}

function resetPivot(name, scene) {
    let tile = scene.getMeshByName(name);

    tile.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 0));
    tile.rotation.y = 0;
    tile.rotation.x = 0;

    let dk = HEX.tiles[name].animation.direction;

    switch(dk) {
        case directions.NE:
        case directions.NW:
            tile.position.x -= (HEX_H * 0.75) * 2;
            break;

        case directions.SE:
            tile.position.x += (HEX_H * 0.75);
            tile.position.z += HEX_W + HEX_W / 2;
            break;

        case directions.SW:
            tile.position.x += (HEX_H * 0.75);
            tile.position.z -= HEX_W + HEX_W / 2;
            break;
    }
}

function getHexFaceIndices(face, scene) {
    let tile = scene.getMeshByName(0);

    var indices = tile.getIndices();
    var positions = tile.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var colors = tile.getVerticesData(BABYLON.VertexBuffer.ColorKind);        
    var nbVertices = positions.length / 3;

    if (!colors) {
        var colors = new Array(4 * nbVertices);
        colors = colors.fill(1);
    }

    var facet = 2 * Math.floor(face);

    var clr = new BABYLON.Color4((face + 1) / 6, (6 - face) / 6, 0, 1);
    var vertex;

    for (var i = 0; i < 18; i++) {
        vertex = indices[3 * facet + i];
        colors[4 * vertex] = clr.r;
        colors[4 * vertex + 1] = clr.g;
        colors[4 * vertex + 2] = clr.b;
        colors[4 * vertex + 3] = clr.a;
    }

    return colors;
}

function updateDelta() {
    NOW = Date.now();
    DELTA = (NOW - THEN) / 1000; // seconds since last frame
    THEN = NOW;
}

function createHexAt(x, z, scene) {
    let gridStart = new BABYLON.Vector3((HEX_W / 2) * (GRID_SIZE - 1), 0, (-HEX_H * 0.75) * (GRID_SIZE - 1));

    let idx = Object.keys(HEX.tiles).length;
    let hex = BABYLON.MeshBuilder.CreateCylinder(idx, { radius: 1, tessellation: 6, updatable: true }, scene);
    
    hex.scaling.y = 0.05;

    hex.position.copyFrom(gridStart);

    hex.position.x = x * (HEX_H * 0.75);
    hex.position.z = z * HEX_W;

    hex.animations.push(ANIMATION.HEX.ROTATE_X);
    hex.material = material;

    HEX.tiles[idx] = {
        pos: [x, z],
        animation: {
            from: FRAME_RATE,
            to: 0,
            direction: 0,
            active: false
        }
    }

    availableTiles[idx] = 1;
    usedCoordinates[`${x}_${z}`] = true;

    if (x & 1) {
        hex.position.z += HEX_W / 2;
    }

    return idx;
}

function setFlipHex(x, z, direction, scene) {
    let name = createHexAt(x, z, scene);

    let p = convertToFlipCoord(x, z, direction);
    let dx = p[0];
    let dz = p[1];

    HEX.tiles[name].pos[0] = dx;
    HEX.tiles[name].pos[1] = dz;

    usedCoordinates[`${dx}_${dz}`] = true;

    setHexPivot(name, direction, scene);
    Q.unshift(name);
}

function checkAvailableSpace(name) {
    let x = HEX.tiles[name].pos[0];
    let z = HEX.tiles[name].pos[1];
    let coords = [];

    for (let k in directionList) {
        let d = directionList[k];
        let p = convertToFlipCoord(x, z, d);
        let dx = p[0];
        let dz = p[1];
        
        let dn = directions[d][2];

        if (!usedCoordinates[`${dx}_${dz}`]) {
            coords.push(d);
        }
    }

    if (coords.length == 0) {
        delete availableTiles[name];
    }

    return coords;
}

function generateRandomHex(tileThresh, directionThresh) {
    for (let k in availableTiles) {
        let rng = Math.floor(Math.random() * 100);

        if (tileThresh == 0 || rng <= tileThresh) {
            let name = parseInt(k);
            let x = HEX.tiles[name].pos[0];
            let z = HEX.tiles[name].pos[1];

            let spaces = checkAvailableSpace(name);
            
            for (let d in spaces) {
                if (directionThresh == 0 || rng <= directionThresh) {
                    setFlipHex(x, z, spaces[d], scene);
                }
            }
        }
    }
}

function convertToFlipCoord(x, z, d) {
    let p = [x, z];
    let dx = directions[d][0];
    let dz = directions[d][1];

    switch(d) {
        case directions.NW:
        case directions.SW:
            if (x & 1) {
                p[0] += dx; 
            } else {
                p[0] += dx;
                p[1] += dz;
            }
            break;

        case directions.NE:
        case directions.SE:
            if (x & 1) {
                p[0] += dx; 
                p[1] += dz;
            } else {
                p[0] += dx;
            }
            break;

        default:
            p[0] += dx; 
            p[1] += dz;
            break
    }

    return p;
}

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
})

window.addEventListener("resize", function () {
    engine.resize();
});

window.addEventListener("load", function () {
    let animElem = document.getElementById('animStyle');

    animElem.addEventListener("change", function(e) {
        let val = this.value;
        location.href = '?val=' + val;
    });
});