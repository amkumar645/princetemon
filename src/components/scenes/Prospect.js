import { BoxGeometry, FontLoader, LinearFilter, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, Sprite, SpriteMaterial, TextGeometry, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import {    Street, 
                Tower, TowerLogo,
                Cannon, CannonLogo,
                Quad, QuadLogo,
                Colonial, ColonialLogo,
                Ivy, IvyLogo, 
                TigerInn, TigerInnLogo,
                Cottage, CottageLogo,
                Cap, CapLogo,
                Charter, CharterLogo,
            Serene, Dirt, Vehicles, RealCannon,
            Sprites
        } from "../images";
import Player from "../player/player";
import Car from "../player/car";
import Maps from "./Maps";
import { PixelFont } from "../fonts";
import Rewards from "./Rewards";

class Prospect extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Dialogue checker
        this.dialogueHappened = false;

        // Adding in tiles
        this.tileset = new Map(); // hashmap for tiles
        this.backgrounds = new Object(); // dictionary for backgrounds 
        this.walkable = new Set(); // set for walkable tiles
        this.sceneChangers = new Set(); // set for scene-changing tiles

        // Sign for game
        this.createTile(-1, Serene, 5, -20);
        
        // --- Street tiles --- 
        this.countX = 29;
        this.countY = 29;
        // Intersection
        this.createTile(0, Street, 14, -28)
        this.createTile(1, Street, 15, -28);
        this.createTile(2, Street, 16, -28);
        this.createTile(3, Street, 17, -28);
        this.createTile(4, Street, 14, -27);
        this.createTile(5, Street, 15, -27);
        this.createTile(6, Street, 16, -27);
        this.createTile(7, Street, 17, -27);
        this.createTile(8, Street, 14, -26);
        this.createTile(9, Street, 15, -26);
        this.createTile(10, Street, 16, -26);
        this.createTile(11, Street, 17, -26);
        this.createTile(12, Street, 14, -22);
        this.createTile(13, Street, 15, -22);
        this.createTile(14, Street, 16, -22);
        this.createTile(15, Street, 17, -22);
        this.createTile(16, Street, 12, -26);
        this.createTile(17, Street, 13, -26);
        this.createTile(18, Street, 12, -25);
        this.createTile(19, Street, 13, -25);
        this.createTile(20, Street, 12, -24);
        this.createTile(21, Street, 13, -24);
        this.createTile(22, Street, 12, -23);
        this.createTile(23, Street, 13, -23);
        this.createTile(24, Street, 18, -26);
        this.createTile(25, Street, 19, -26);
        this.createTile(26, Street, 18, -25);
        this.createTile(27, Street, 19, -25);
        this.createTile(28, Street, 18, -24);
        this.createTile(29, Street, 19, -24);
        this.createTile(30, Street, 18, -23);
        this.createTile(31, Street, 19, -23);
        // Sidewalk
        // this.createTile(32, Street, 23, -24);
        this.createTile(32, Street, 20, -24);
        // Road - horizontal
        this.createTile(33, Street, 16, -19);
        this.createTile(34, Street, 16, -14);
        this.createTile(35, Street, 16, -20);
        this.createTile(36, Street, 16, -13);
        // Road - vertical
        this.createTile(37, Street, 14, -17);
        this.createTile(38, Street, 13, -17);
        this.createTile(39, Street, 12, -17);
        this.createTile(40, Street, 19, -17);
        // Bush
        this.createTile(41, Street, 10, -19);
        // Grass
        this.createTile(42, Street, 8, -19);
        // Traffic light facing left 
        // stem from bottom to top
        this.createTile(50, Street, 26, -18);
        this.createTile(51, Street, 26, -19);
        this.createTile(52, Street, 26, -20);
        this.createTile(53, Street, 26, -21);
        // sidewalk background
        for (let i = 50; i <= 53; i++) {
            this.backgrounds[i] = 32;
        }
        // Traffic light facing back
        // stem from bottom to top 
        this.createTile(54, Street, 23, -18); 
        this.createTile(55, Street, 23, -19);
        this.createTile(56, Street, 23, -20);
        this.createTile(57, Street, 23, -21);
        // crosswalk background
        this.backgrounds[54] = 32;
        this.backgrounds[55] = 23;
        this.backgrounds[56] = 21;
        this.backgrounds[57] = 19;
        // arm from left to right (all 2 height)
        this.createTile(58, Street, 24, -20); 
        this.createTile(59, Street, 24, -21); 
        this.createTile(60, Street, 25, -20);
        this.createTile(61, Street, 25, -21);
        // intersection background
        this.backgrounds[58] = this.backgrounds[59] = 8;
        this.backgrounds[60] = this.backgrounds[61] = 9;
        // Traffic light facing front
        // stem from bottom to top
        this.createTile(62, Street, 22, -18); 
        this.createTile(63, Street, 22, -19); 
        this.createTile(64, Street, 22, -20); 
        this.createTile(65, Street, 22, -21); 
        // sidewalk background
        for (let i = 62; i <= 65; i++) {
            this.backgrounds[i] = 32;
        }
        // arm from right to left (all 2 height)
        this.createTile(66, Street, 21, -20);
        this.createTile(67, Street, 21, -21);
        this.createTile(68, Street, 20, -20);
        this.createTile(69, Street, 20, -21);
        // intersection background
        this.backgrounds[66] = this.backgrounds[67] = 40;
        this.backgrounds[68] = this.backgrounds[69] = 37;

        // --- Dirt tiles ---
        this.countX = 3; 
        this.countY = 3;
        // Gravel
        this.createTile(70, Dirt, 1, -2);
        // Grey
        this.createTile(98, Dirt, 2, -1);
        // Red
        this.createTile(99, Dirt, 2, 0);

        //  --- Street tiles (cont) --- 
        // Convention: bottom to top, left to right
        this.countX = 29;
        this.countY = 29;
        // Light
        this.createTile(71, Street, 26, -15);
        this.createTile(72, Street, 26, -16);
        this.createTile(73, Street, 26, -17);
        // Small tree 
        this.createTile(74, Street, 9, -18);
        this.createTile(75, Street, 9, -19);
        // Big tree
        this.createTile(76, Street, 8, -11);
        this.createTile(77, Street, 9, -11);
        this.createTile(78, Street, 8, -12);
        this.createTile(79, Street, 9, -12);
        this.createTile(80, Street, 8, -13);
        this.createTile(81, Street, 9, -13);
        // Wall 
        this.createTile(82, Street, 10, -11);
        this.createTile(83, Street, 11, -11);
        this.createTile(84, Street, 12, -11);
        // Wall with bushes
        this.createTile(85, Street, 13, -11);
        this.createTile(86, Street, 14, -11);
        this.createTile(87, Street, 15, -11);
        this.createTile(88, Street, 13, -12); // bushes
        this.createTile(89, Street, 14, -12);
        this.createTile(90, Street, 15, -12);
        // Bench facing left
        this.createTile(91, Street, 24, -22);
        this.createTile(92, Street, 24, -23);
        // Bench facing right
        this.createTile(93, Street, 23, -22);
        this.createTile(94, Street, 23, -23);
        // Bench aerial
        this.createTile(95, Street, 21, -22);
        this.createTile(96, Street, 22, -22);
        // Flowers

        // --- Eating clubs tile sets ---
        // From right to left of the Street
        var currentIndex = 100; // 100s-200s
        this.countX = 5;
        this.countY = 4;
        currentIndex = this.createTileSet(currentIndex, Tower, this.countX, this.countY);        // 100-119
        currentIndex = this.createTileSet(currentIndex, Cannon, this.countX, this.countY);          // 120-139
        currentIndex = this.createTileSet(currentIndex, Quad, this.countX, this.countY);            // 140-159
        currentIndex = this.createTileSet(currentIndex, Colonial, this.countX, this.countY);        // 160-179
        currentIndex = this.createTileSet(currentIndex, Ivy, this.countX, this.countY);             // 180-199
        currentIndex = this.createTileSet(currentIndex, TigerInn, this.countX, this.countY);        // 200-219
        currentIndex = this.createTileSet(currentIndex, Cottage, this.countX, this.countY);         // 220-239
        currentIndex = this.createTileSet(currentIndex, Cap, this.countX, this.countY);             // 240-259
        currentIndex = this.createTileSet(currentIndex, Charter, this.countX, this.countY);         // 260-279
        
        // ----- Eating club logo tile sets ----- // NOTE: NEED TO PIXELATE AND WHITE BACKGROUNDS IF NEEDED
        var currentIndex = 300; // 300s
        this.countX = 3;
        this.countY = 2;
        currentIndex = this.createTileSet(currentIndex, TowerLogo, this.countX, this.countY);       // 300-305
        currentIndex = this.createTileSet(currentIndex, CannonLogo, this.countX, this.countY);      // 306-311
        currentIndex = this.createTileSet(currentIndex, QuadLogo, this.countX, this.countY);        // 312-317
        currentIndex = this.createTileSet(currentIndex, ColonialLogo, this.countX, this.countY);    // 318-323
        currentIndex = this.createTileSet(currentIndex, IvyLogo, this.countX, this.countY);         // 324-329
        currentIndex = this.createTileSet(currentIndex, TigerInnLogo, this.countX, this.countY);    // 330-335
        currentIndex = this.createTileSet(currentIndex, CottageLogo, this.countX, this.countY);     // 336-341
        currentIndex = this.createTileSet(currentIndex, CapLogo, this.countX, this.countY);         // 342-347
        currentIndex = this.createTileSet(currentIndex, CharterLogo, this.countX, this.countY);     // 348-353
        for (let i = 300; i <= 353; i++) { // white backgrounds
            this.backgrounds[i] = -2;
        }

        // --- Vehicle tiles ---
        // Cars
        this.countX = 22;
        this.countY = 19;
        this.createTile(400, Vehicles, 0, -17); // 400s
        this.createTile(401, Vehicles, 0, -18);
        this.createTile(402, Vehicles, 1, -17);
        this.createTile(403, Vehicles, 1, -18);
        this.createTile(404, Vehicles, 2, -17);
        this.createTile(405, Vehicles, 2, -18);
        for (let i = 400; i <= 405; i++) {
            this.backgrounds[i] = 35; // road background
        }
        this.backgrounds[401] = this.backgrounds[403] = this.backgrounds[405] = 70; // gravel background
        // this.createTile(106, Vehicles, 3, -17);
        // this.createTile(107, Vehicles, 3, -18);

        // --- Misc ---
        // Cannon
        this.countX = 1;
        this.countY = 1;
        this.createTile(406, RealCannon, 0, 0);
        this.backgrounds[406] = 32;
        // Bouncer sprite
        this.countX = 15;
        this.countY = 8;
        this.createTile(407, Sprites, 4, -3);
        this.backgrounds[407] = 8;


        // ----- Identifying walkable tiles -----
        for (let i = 0; i <= 40; i++) { // intersection, sidewalk, road
            this.walkable.add(i);
        }
        this.walkable.add(42); // grass
        this.walkable.add(70); // gravel
        this.walkable.add(98); // grey
        this.walkable.add(99); // red
        for (let i = 300; i <= 353; i++) { // eating club logos 
            this.walkable.add(i);
        }

        // ----- Identifying scene-changing tiles -----
        this.sceneChangers.add(32); // sidewalk

        // Actual tiles for level
        this.tiles = [
            [ 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 54, 12, 13, 14, 15, 50, 32],   
            [ 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 23, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 22, 55,  8,  9, 10, 11, 51, 32], 
            [ 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 23, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 20, 56, 58, 60, 10, 11, 52, 32],
            [ 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 23, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 18, 57, 59, 61, 10, 11, 53, 32],      
            [ 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 23, 35, 35, 35, 35, 35, 35, 35, 35,400,402,404, 16, 17,  8,  9, 10, 11, 32, 32],      // road
            [  8, 42, 42, 42, 42, 42, 70, 70, 70, 42, 42, 42, 42,  8, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 39, 40, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70,  8, 98, 98, 98, 98, 98, 98, 32, 98, 98, 98, 98, 98, 98,  8, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 32, 32, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 32, 32, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70,  8, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 32,  8, 70, 70, 70, 70, 70, 70, 70,401,403,405, 70, 70,  4,  5,  6,  7, 62, 32],
            [  8, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,  8, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 28, 28, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,  8, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,  8, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,  8, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,  8, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,  0,  1,  2,  3, 63, 32],      // sidewalk
            [  8, 41, 41, 41, 41,348,349,350, 41, 41, 41, 41, 41,  8, 41, 41, 41, 41,342,343,344, 41, 41, 41, 41, 39, 40, 82, 83, 83, 84,336,337,338, 82, 83, 83, 84,  8, 41, 82, 83, 83, 84,330,331,332, 82, 83, 83, 84, 41,  8, 82, 83, 83, 84,324,325,326, 82, 83, 83, 84, 41, 41, 41, 41, 41, 99,318,319,320, 99, 41, 41, 41, 41, 70, 82, 83, 83, 84,312,313,314, 82, 83, 83, 84,  8, 32, 82, 83, 83, 84,306,307,308, 82, 83, 83, 84, 32,  8, 85, 86, 86, 87,300,301,302, 85, 86, 86, 87, 41, 39, 38, 68, 66, 64, 32],      // logo + bush
            [  8, 41, 42, 42, 42,351,352,353, 42, 42, 42, 41, 41,  8, 76, 77, 76, 77,345,346,347, 42, 95, 96, 42, 39, 40, 76, 77, 42, 42,339,340,341, 42, 42, 42, 71,  8, 41, 42, 42, 42, 42,333,334,335, 42, 42, 42, 42, 41,  8, 42, 42, 42, 42,327,328,329, 41, 41, 42, 42, 41, 41, 42, 42, 42, 99,321,322,323, 99, 42, 42, 42, 41, 70, 41, 42, 42, 71,315,316,317, 71, 42, 42, 41,  8, 32, 32, 42, 42, 42,309,310,311, 42, 42, 42, 32, 32,  8, 88, 89, 89, 90,303,304,305, 88, 89, 89, 90, 41, 39, 38, 69, 67, 65, 32],      // logo
            [  8, 41, 42, 42, 42, 42, 99, 42, 42, 42, 42, 41, 41,  8, 78, 79, 78, 79, 99, 42, 42, 42, 42, 42, 42, 39, 40, 78, 79, 42, 42, 42, 99, 42, 42, 42, 42, 72,  8, 41, 42, 42, 42, 42, 42, 32, 42, 42, 95, 96, 42, 41,  8, 42, 42, 42, 42, 42, 99, 42, 42, 42, 42, 42, 41, 41, 42, 93, 42, 99, 42, 42, 42, 99, 42, 91, 42, 41, 70, 41, 42, 42, 72, 41, 99, 41, 72, 42, 42, 41,  8, 41, 42, 32, 32, 42, 42,406, 42, 42, 32, 32, 42, 41,  8, 74, 76, 77, 42, 32, 32, 32, 42, 42, 91, 42, 41, 39, 38, 37, 40, 32, 32],      // path
            [  8, 41, 42, 42, 41, 41, 99, 41, 41, 42, 42, 41, 41,  8, 80, 81, 80, 81, 99, 41, 41, 41, 42, 42, 42, 39, 40, 80, 81, 42, 41, 41, 99, 41, 41, 42, 42, 73,  8, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 42, 41,  8, 99, 99, 99, 99, 99, 99, 42, 42, 42, 42, 42, 41, 41, 42, 94, 42, 99, 99, 99, 99, 99, 42, 92, 42, 41, 70, 41, 42, 42, 73, 41, 99, 41, 73, 42, 42, 41,  8, 41, 42, 76, 77, 32, 32, 32, 32, 32, 42, 42, 42, 41,  8, 75, 78, 79, 42, 32, 32, 32, 42, 42, 92, 42, 41, 39, 38, 37, 40, 32, 32],      // path
            [  8, 41, 76, 77,260,261,262,263,264, 76, 77, 41, 41,  8, 76, 77, 74,240,241,242,243,244, 42, 42, 42, 39, 40, 41, 42, 42,220,221,222,223,224, 42, 42, 41,407, 41, 42, 42, 42,200,201,202,203,204, 95, 96, 42, 41,  8, 42, 42, 41,180,181,182,183,184, 42, 42, 42, 41, 41, 42, 42, 42,160,161,162,163,164, 42, 42, 42, 41, 70, 41, 42, 42,140,141,142,143,144, 42, 42, 41,  8, 41, 42, 78, 79,120,121,122,123,124, 42, 42, 42, 41,  8, 41, 80, 81,100,101,102,103,104, 42, 74, 42, 41, 39, 38, 37, 40, 32, 32],      // club front
            [  8, 41, 78, 79,265,266,267,268,269, 78, 79, 41, 41,  8, 78, 79, 75,245,246,247,248,249, 42, 42, 42, 39, 40, 41, 42, 42,225,226,227,228,229, 42, 42, 41,  8, 41, 42, 42, 42,205,206,207,208,209, 76, 77, 42, 41,  8, 42, 42, 41,185,186,187,188,189, 42, 42, 42, 41, 41, 76, 77, 42,165,166,167,168,169, 42, 76, 77, 41, 70, 41, 42, 42,145,146,147,148,149, 42, 42, 41,  8, 41, 42, 80, 81,125,126,127,128,129, 42, 76, 77, 41,  8, 76, 77, 41,105,106,107,108,109, 42, 75, 42, 41, 39, 38, 37, 40, 32, 32],
            [  8, 41, 80, 81,270,271,272,273,274, 80, 81, 41, 41,  8, 80, 81, 41,250,251,252,253,254, 42, 42, 42, 39, 40, 41, 42, 42,230,231,232,233,234, 42, 42, 41,  8, 41, 42, 42, 42,210,211,212,213,214, 78, 79, 42, 41,  8, 42, 42, 42,190,191,192,193,194, 42, 42, 42, 41, 41, 78, 79, 42,170,171,172,173,174, 42, 78, 79, 41, 70, 41, 42, 42,150,151,152,153,154, 42, 42, 41,  8, 41, 42, 42, 42,130,131,132,133,134, 42, 78, 79, 41,  8, 78, 79, 74,110,111,112,113,114, 42, 42, 42, 41, 39, 38, 37, 40, 32, 32],
            [  8, 41, 42, 42,275,276,277,278,279, 42, 42, 41, 41,  8, 41, 41, 41,255,256,257,258,259, 42, 42, 42, 39, 40, 41, 42, 42,235,236,237,238,239, 42, 42, 41,  8, 41, 42, 42, 42,215,216,217,218,219, 80, 81, 42, 41,  8, 42, 42, 42,195,196,197,198,199, 42, 42, 42, 41, 41, 80, 81, 42,175,176,177,178,179, 42, 80, 81, 41, 70, 41, 42, 42,155,156,157,158,159, 42, 42, 41,  8, 41, 42, 42, 42,135,136,137,138,139, 42, 80, 81, 41,  8, 80, 81, 75,115,116,117,118,119, 42, 42, 42, 41, 39, 38, 37, 40, 32, 32],      // club back

            // to mark eating clubs
            // 0   0   0   0   C   C   C   C   C   0   0   0   0   0   0   0   0   C   C   C   C   C   0   0   0   0   0   0   0   0   C   C   C   C   C   0   0   0   0   0   0   0   0   T   T   T   T   T   0   0   0   0   0   0   0   0   I   I   I   I   I   0   0   0   0   0   0   0   0   C   C   C   C   C   0   0   0   0   0   0   0   0   Q   Q   Q   Q   Q   0   0   0   0   0   0   0   0   C   C   C   C   C   0   0   0   0   0   0   0   0   T   T   T   T   T   0   0   0   0   0   0   0   0   0   0     
        ];
        
        
        this.width = this.tiles.length;
        this.height = this.tiles[0].length;

        this.createScene();


        // Create player for scene
        this.player = new Player(Prospect);
        this.add(this.player.sprite);
        this.player.setPosition(this.height - 1, 4, 0)

        // Car
        // this.car = new Car(Prospect);
        // this.add(this.car.getSprite());
        // this.car.setPosition(this.height - 3, 4, 0);

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        // this.camera.position.set(this.height - 13.5, 7, 1.6);
        // this.camera.lookAt(new Vector3(this.height - 13.5, 7, 0));
        this.camera.position.set(this.height - 1, 7, 1.6);
        this.camera.lookAt(new Vector3(this.height - 1, 7, 0));
        // this.camera.zoom = 0.08;
        this.camera.zoom = 0.1;

        // Window resize handler for scene
        this.windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            Scenes.renderer.setSize(innerWidth, innerHeight);
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        };
        // Arrow key handler
        this.move = (event) => {
            const speed = 0.5;
            if (event.code === 'ArrowUp') {
                const playerPos = this.player.sprite.position;
                // If past map, don't move
                if (Math.round(playerPos.y) >= this.width) {
                    return;
                }
                // Update player position and camera if tile is walkable
                if (this.walkable.has(this.tiles[Math.round(playerPos.y + 0.3 + speed)][Math.round(playerPos.x)])) {
                    this.remove(this.player.sprite);
                    this.player.setPosition(playerPos.x, playerPos.y + speed, playerPos.z, "up");
                    this.add(this.player.sprite);
                }
            }
            if (event.code === 'ArrowDown') {
                const playerPos = this.player.sprite.position;
                // If past map, don't move
                if (Math.round(playerPos.y) <= 0.8) {
                    return;
                }
                // Update player position and camera if tile is walkable
                if (this.walkable.has(this.tiles[Math.round(playerPos.y - 0.3 - speed)][Math.round(playerPos.x)])) {
                    this.remove(this.player.sprite);
                    this.player.setPosition(playerPos.x, playerPos.y - speed, playerPos.z, "down");
                    this.add(this.player.sprite);
                }
            }
            if (event.code === 'ArrowLeft') {
                const playerPos = this.player.sprite.position;
                // Update player position and camera if tile is walkable
                if (this.walkable.has(this.tiles[Math.round(playerPos.y)][Math.round(playerPos.x - speed - 0.3)])) {
                    this.remove(this.player.sprite);
                    this.player.setPosition(playerPos.x - speed, playerPos.y, playerPos.z, "left");
                    this.add(this.player.sprite);
                    // if (this.camera.position.x >= 13.5) {
                    //     this.camera.position.x -= speed;
                    // }
                    if (this.camera.position.x >= 0) {
                        this.camera.position.x -= speed;
                    }
                }
            }
            if (event.code === 'ArrowRight') {
                const playerPos = this.player.sprite.position;
                if (Math.round(playerPos.x) >= this.height - 1) {
                    if (this.sceneChangers.has(this.tiles[Math.round(playerPos.y)][Math.round(playerPos.x + 0.3 + speed)])) {
                        Scenes.switchScene('frist');
                    }
                    return;
                }
                // Update player position and camera if tile is walkable
                if (this.walkable.has(this.tiles[Math.round(playerPos.y)][Math.round(playerPos.x + 0.3 + speed)])) {
                    this.remove(this.player.sprite);
                    this.player.setPosition(playerPos.x + speed, playerPos.y, playerPos.z, "right");
                    this.add(this.player.sprite);
                    // if (this.camera.position.x <= this.height - 14.5) {
                    //     this.camera.position.x += speed;
                    // }
                    if (this.camera.position.x <= this.height) {
                        this.camera.position.x += speed;
                    }
                }
            }
            // Map event
            if (event.code === 'KeyM' || event.key === 'm') {
                const map = new Maps('prospect');
                console.log(map);
                Scenes.scenes['map'] = map;
                Scenes.switchScene('map');
            }
            // Zoom out
            if (event.code === 'KeyZ' || event.key === 'z') {
                this.camera.zoom = 0.03;
                this.windowResizeHandler();
            }
            // Zoom in
            if (event.code === 'KeyX' || event.key === 'x') {
                this.camera.zoom = 0.1;
                this.windowResizeHandler();
            }
            // Rewards event
            if (event.code === 'KeyR' || event.key === 'r') {
                const rewards = new Rewards('prospect');
                Scenes.scenes['rewards'] = rewards;
                Scenes.switchScene('rewards');
            }
            // Action button to get to minigame
            if (event.code === 'Space') {
                if (this.inActionSpace(407) && !this.dialogueHappened) {
                    this.startDialogue();
                }
                if (this.inActionSpace(407) && this.dialogueHappened) {
                    Scenes.switchScene('prospectgameinstructions');
                }
            }
            // Camera movement
            if (event.code === 'KeyA' || event.key === 'a') {
                if (this.camera.position.x >= 0) {
                    this.camera.position.x -= speed;
                }
            }
            if (event.code === 'KeyD' || event.key === 'd') {
                if (this.camera.position.x <= this.height) {
                    this.camera.position.x += speed;
                }
            }
        };
    }
    // Creates texture and material from spritesheet
    createTile(index, source, offsetX, offsetY) {
        // Sample smaller square to get rid of black borders
        const eps = 0.01;

        // Load in image
        const texture = new TextureLoader().load(source);
        texture.minFilter = LinearFilter;
        // Find tile
        texture.offset.x = (1 * offsetX + 0.03 ) / this.countX;
        texture.offset.y = (-1 *  offsetY + 0.05) / this.countY;
        texture.repeat.x = (1 - eps * 10) / this.countX;
        texture.repeat.y = (1 - eps * 10) / this.countY;
        // texture.wrapS = texture.wrapT = RepeatWrapping;

        const material = new SpriteMaterial({map: texture});

        // Add tile to tileset
        this.tileset.set(index, material);
    }

    createTileSet(currentIndex, source, countX, countY) {
        for (let i = 0; i >= -(countY-1); i--) {
            for (let j = 0; j <= countX-1; j++) {
                this.createTile(currentIndex, source, j, i);
                currentIndex++;
            }
        }
        return currentIndex;
    }

    // Creates scene based on tiles and tile mapping
    createScene() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                // Set tile and set grass background
                const index = this.tiles[j][i];
                let background = new Sprite(this.tileset.get(42));

                // Apply backgrounds
                if (index in this.backgrounds) { // check for key 
                    background = new Sprite(this.tileset.get(this.backgrounds[index]));
                }

                const sprite = new Sprite(this.tileset.get(index));
                // Set positions based on tile mapping
                const xPosition = i;
                const yPosition = j;
                background.position.set(xPosition, yPosition, 0);
                this.add(background);
                sprite.position.set(xPosition, yPosition, 0);
                this.add(sprite);
            }
        }
    }

    // Check if right under action space
    inActionSpace(tile) {
        const playerPos = this.player.sprite.position;
        console.log(this.tiles[Math.round(playerPos.y + 1)][Math.round(playerPos.x)]);
        if (this.tiles[Math.round(playerPos.y + 1)][Math.round(playerPos.x)] === tile) {
            return true;
        }
        return false;
    }


    startDialogue() {
        // Dialogue event handlers 
        const playerPos = this.player.sprite.position;
        this.camera.position.x = playerPos.x;
        this.camera.position.y = playerPos.y - 3;
        // Add cube to back
        const boxGeometry = new BoxGeometry(16, 8, 0.001);
        // const boxMaterial = new MeshBasicMaterial({color: 0x9b673c});
        const boxMaterial = new MeshBasicMaterial({color: 0xffffff});
        var cube = new Mesh(boxGeometry, boxMaterial);
        cube.position.set(playerPos.x, playerPos.y - 5, 0.001);
        this.add(cube);
        var count = 0;
        this.textMesh;
        const fontLoader = new FontLoader();
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "You:\n\nHey, do you know where I could get\nsome non-alcoholic water?",
                    {
                        font: font,
                        size: 0.5,
                        height: 0
                    }
                );
                Scenes.scenes['prospect'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                Scenes.scenes['prospect'].textMesh.position.set(playerPos.x - 7, playerPos.y - 2.5, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['prospect'].add(Scenes.scenes['prospect'].textMesh);
            }
        );  
        this.dialogueContinue = (event) => {
            if (event.key !== ' ') return;
            if (count >= 9) {
                this.remove(Scenes.scenes['prospect'].textMesh);  
                this.remove(cube);
                window.addEventListener('keydown', this.move, false);
                window.removeEventListener('keydown', this.dialogueContinue, false); 
                this.dialogueHappened = true;
                Scenes.switchScene('prospectgameinstructions');
            }
            else if (count === 0){
                Scenes.scenes['prospect'].remove(Scenes.scenes['prospect'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Guy Who Drank Too Much Water:\n\nYOU WANT SOME?!?!?!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['prospect'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['prospect'].textMesh.position.set(playerPos.x - 7, playerPos.y - 2.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['prospect'].add(Scenes.scenes['prospect'].textMesh);
                    }
                );  
            }
            else if (count === 1){
                Scenes.scenes['prospect'].remove(Scenes.scenes['prospect'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nWell, I did, but then you started talking\nand now I'm not so sure.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['prospect'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['prospect'].textMesh.position.set(playerPos.x - 7, playerPos.y - 2.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['prospect'].add(Scenes.scenes['prospect'].textMesh);
                    }
                );  
            }
            else if (count === 2){
                Scenes.scenes['prospect'].remove(Scenes.scenes['prospect'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Very Hydrated Guy:\n\nIF YOU WANT IT, YOU'RE GONNA HAVE\nTO BEAT ME FOR IT!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['prospect'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['prospect'].textMesh.position.set(playerPos.x - 7, playerPos.y - 2.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['prospect'].add(Scenes.scenes['prospect'].textMesh);
                    }
                );  
            }
            else if (count === 3){
                Scenes.scenes['prospect'].remove(Scenes.scenes['prospect'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nUm, what?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['prospect'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['prospect'].textMesh.position.set(playerPos.x - 7, playerPos.y - 2.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['prospect'].add(Scenes.scenes['prospect'].textMesh);
                    }
                );  
            }
            else if (count === 4){
                Scenes.scenes['prospect'].remove(Scenes.scenes['prospect'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Very Hydrated Guy:\n\nYOU HEARD ME!!!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['prospect'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['prospect'].textMesh.position.set(playerPos.x - 7, playerPos.y - 2.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['prospect'].add(Scenes.scenes['prospect'].textMesh);
                    }
                );  
            }
            else if (count === 5){
                Scenes.scenes['prospect'].remove(Scenes.scenes['prospect'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nI think everyone east of the Mississippi\nheard you, but what?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['prospect'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['prospect'].textMesh.position.set(playerPos.x - 7, playerPos.y - 2.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['prospect'].add(Scenes.scenes['prospect'].textMesh);
                    }
                );  
            }
            else if (count === 6){
                Scenes.scenes['prospect'].remove(Scenes.scenes['prospect'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Very Hydrated Guy:\n\nDANCE COMPETITION!!! IF YOU WIN,\nYOU GET NON-ALCOHOLIC WATER!\nIF I WIN, YOU GET TO TRY AGAIN\nUNTIL YOU WIN!!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['prospect'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['prospect'].textMesh.position.set(playerPos.x - 7, playerPos.y - 2.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['prospect'].add(Scenes.scenes['prospect'].textMesh);
                    }
                );  
            }
            else if (count === 7){
                Scenes.scenes['prospect'].remove(Scenes.scenes['prospect'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nUm, okay. That's actually\nquite generous of you.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['prospect'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['prospect'].textMesh.position.set(playerPos.x - 7, playerPos.y - 2.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['prospect'].add(Scenes.scenes['prospect'].textMesh);
                    }
                );  
            }
            else if (count === 8){
                Scenes.scenes['prospect'].remove(Scenes.scenes['prospect'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                            "Very Hydrated Guy:\n\nANYWAYS, GOOD LUCK!!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['prospect'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['prospect'].textMesh.position.set(playerPos.x - 7, playerPos.y - 2.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['prospect'].add(Scenes.scenes['prospect'].textMesh);
                    }
                );  
            }
            count++;
        }
        window.removeEventListener('keydown', this.move, false);
        window.addEventListener('keydown', this.dialogueContinue, false); 
    }

    // Adds events specific to Frist scene
    addEvents() {
        this.windowResizeHandler();
        // Resize event
        window.addEventListener('resize', this.windowResizeHandler, false);
        // Movement with arrow key event
        window.addEventListener('keydown', this.move, false);
    }
    // Removes events specific to Frist scene
    removeEvents() {
        window.removeEventListener('resize', this.windowResizeHandler, false);
        window.removeEventListener('keydown', this.move, false);
    }
}

export default Prospect;
