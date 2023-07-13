import './style.css'
import * as itowns from 'itowns';
import { Vector3, WebGLRenderer, PMREMGenerator, Scene, PerspectiveCamera, Vector2 } from 'three';

const viewerDiv = document.getElementById('map');

var scene = new Scene();

function createRenderer() {
    const renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
        logarithmicDepthBuffer: true
    });
    renderer.setSize(viewerDiv.clientWidth, viewerDiv.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.info.autoReset = false;

    // Improve color rendering
    renderer.localClippingEnabled = true;
    renderer.setClearColor(0x000000, 0);

    // Increase start-up time to render
    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    viewerDiv.appendChild(renderer.domElement);

    return renderer;
}

const potreeLayer = new itowns.PotreeLayer('Lion', {
    source: new itowns.PotreeSource({
        file: 'eglise_saint_blaise_arles.js',
        url: 'https://raw.githubusercontent.com/iTowns/iTowns2-sample-data/master/pointclouds/eglise_saint_blaise_arles',
        crs: '',
    }),
});

var customRenderer = createRenderer();
var rendererSize = customRenderer.getSize(new Vector2());
var customCamera = new PerspectiveCamera(60, rendererSize.width / rendererSize.height, 1, 10000);
scene.add(customCamera);
const view = new itowns.View('EPSG:3946', viewerDiv, { camera: { cameraThree: customCamera }, renderer: customRenderer });
view.mainLoop.gfxEngine.renderer.setClearColor(0xcccccc);

view.addLayer(potreeLayer).then(() => {
    var ratio;
    var position;
    var lookAt = new Vector3();
    var size = new Vector3();

    potreeLayer.root.bbox.getSize(size);
    potreeLayer.root.bbox.getCenter(lookAt);

    customCamera.far = 2.0 * size.length();

    ratio = size.x / size.z;
    position = potreeLayer.root.bbox.min.clone().add(
        size.multiply({ x: 0, y: 0, z: ratio * 0.5 }));
    lookAt.z = potreeLayer.root.bbox.min.z;

    view.camera.camera3D.position.copy(position);
    view.camera.camera3D.lookAt(lookAt);
    // create controls
    const controls = new itowns.FirstPersonControls(view, { focusOnClick: true });

    view.notifyChange(view.camera.camera3D);
});
