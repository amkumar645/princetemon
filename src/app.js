/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { Scenes} from './components/scenes';

// Initialize core ThreeJS components
// const scene = new SeedScene();
// Create scenes
Scenes.create();

// Set up renderer, canvas, and minor CSS adjustments
Scenes.renderer.setPixelRatio(window.devicePixelRatio);
const canvas = Scenes.renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// // // Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 16;
// controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    Scenes.renderer.render(Scenes.currentScene, Scenes.currentScene.camera);
    Scenes.currentScene.update && Scenes.currentScene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

