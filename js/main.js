{/* <reference path='babylon.d.ts' /> */}

const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas, true);

function createScene() {
    // create a scene
    const scene = new BABYLON.Scene(engine);

    // create camera
    // const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, 0), scene);
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);

    // create light
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

    const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1 }, scene);
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {}, scene);
    sphere.position = new BABYLON.Vector3(3, 0, 0);

    const plane = BABYLON.MeshBuilder.CreatePlane('plane', {}, scene);
    plane.position = new BABYLON.Vector3(-3, 0, 0);

    const points = [
        new BABYLON.Vector3(2, 0, 0),
        new BABYLON.Vector3(2, 1, 0),
        new BABYLON.Vector3(2, 1, 1)
    ];

    const line = BABYLON.MeshBuilder.CreateLines('lines', {
        points,
    }, scene);

    sphere.scaling = new BABYLON.Vector3(0.2, 0.7, 0.2);

    const material = new BABYLON.StandardMaterial('material', scene);
    material.diffuseColor = new BABYLON.Color3(1, 0, 1);
    material.emissiveColor = new BABYLON.Color3(0, 0, 1);
    box.material = material;

    return scene;
}

function createHexGrid(gridSize, hexW, hexH, rowLen, camera, scene) {
    let gridStart = new BABYLON.Vector3((hexW / 2) * (gridSize - 1), 0, (-hexH * 0.75) * (gridSize - 1));
    let rows = gridSize * 2 - 1;
    let rotY = Math.PI / 180 * 90;

    console.log('called');

    for (let i = 0, idx = 0; i < rows; ++i) {
        for (let j = 0; j < gridSize + rowLen; ++j, ++idx) {
            hexTiles[idx] = BABYLON.MeshBuilder.CreateCylinder(idx, { radius: 1, tessellation: 6, updatable: true }, scene);
            hexTiles[idx].scaling.y = 0.05;
            hexTiles[idx].rotation.y = rotY;
            hexTiles[idx].position.copyFrom(gridStart);
            hexTiles[idx].position.x -= hexW * j;

            // var materialforbox = new BABYLON.StandardMaterial("texture1", scene);
            // hexTiles[idx].material = materialforbox;
            // materialforbox.wireframe = true;
            // hexagon.position.x = i * (hexH * 0.75);
            // hexagon.position.z = j * hexW;

            // if (i & 1) {
            //     hexagon.position.z += hexW / 2;
            // }
        }

        if (i >= gridSize - 1) {
            rowLen -= 1;
            gridStart.x -= hexW / 2;
            gridStart.z += hexH * 0.75;
        } else {
            rowLen += 1;
            gridStart.x += hexW / 2;
            gridStart.z += hexH * 0.75;
        }

        // break;
    }

    camera.radius = gridSize * 4;
    camera.upperRadiusLimit = camera.radius + 5;
}

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
})

window.addEventListener("resize", function () {
    engine.resize();
});