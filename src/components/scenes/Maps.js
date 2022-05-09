import { PerspectiveCamera, Scene, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { MapFrist, MapGardens, MapNassau, MapPoe, MapProspect } from "../images";


class Maps extends Scene {
    constructor(location) {
        // Call parent Scene() constructor
        super();

        // Store location map called from
        this.location = location;

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        this.camera.position.set(0, 0, 2.5);
        this.camera.lookAt(new Vector3(0, 0, 0));

        // Set background to background image
        const bgLoader = new TextureLoader();
        if (location === 'frist') {
            var bgTexture = bgLoader.load(MapFrist);
        }
        else if (location === 'poe') {
            var bgTexture = bgLoader.load(MapPoe);
        }
        else if (location === 'prospect') {
            var bgTexture = bgLoader.load(MapProspect);
        }
        else if (location === 'garden') {
            var bgTexture = bgLoader.load(MapGardens);
        }
        else if (location === 'nassau') {
            var bgTexture = bgLoader.load(MapNassau);
        }
        this.background = bgTexture;


        // Window resize handler for scene
        this.windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            Scenes.renderer.setSize(innerWidth, innerHeight);
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        };

        this.pressKey = (event) => {
            if (event.key === 'm' || event.code === 'KeyM') {
                Scenes.switchScene(this.location);
            }
        };
    }


    addEvents() {
        this.windowResizeHandler();
        // Window resize event
        window.addEventListener('resize', this.windowResizeHandler, false);
        // Space to switch scene
        window.addEventListener('keydown', this.pressKey, false);
    }

    removeEvents() {
        window.removeEventListener('resize', this.windowResizeHandler, false);
        window.removeEventListener('keydown', this.pressKey, false);
    }
}

export default Maps;