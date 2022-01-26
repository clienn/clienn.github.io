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
    box.position.y = 0.5;

    const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;

    const hexagon = BABYLON.MeshBuilder.CreateCylinder("hexagon", { tessellation: 6 }, scene);
    hexagon.position.x = 1.5;
    hexagon.position.y = 0.2;
    hexagon.scaling.y = 0.2;

    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
    
    return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
})

window.addEventListener("resize", function () {
    engine.resize();
});