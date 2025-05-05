import { Application, Container, Renderer, Sprite } from "pixi.js";
import Hero from "./Entities/Hero";
import AsteroidManager from "./Managers/AsteroidManager";
import ResizeManager from "./Utils/ResizeManager";
import Utils from "./Utils/Utils";


export default class Game{
    private pixiApp: Application<Renderer>;
    private hero: Hero = null;
    private asteroidManager: AsteroidManager;
    public view: Container = new Container();

    constructor(app: Application<Renderer>) {
        this.pixiApp = app;
    }

    public initEntities() {
        this.hero = new Hero('Hero');
        this.view.addChild(this.hero);

        this.asteroidManager = new AsteroidManager(['Asteroid_grey', 'Asteroid_brown', 'Asteroid_grey_&_blue']);
        this.view.addChild(this.asteroidManager);

        ResizeManager.getInstance().onResize(() => {
            Utils.repositionAccordingToResize(this.hero.sprite);
        });
    }

    update() {
        this.asteroidManager.update();
        this.hero.update(this.asteroidManager.asteroids);
    }
}