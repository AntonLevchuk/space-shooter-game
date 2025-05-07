import { Application, Container, Renderer, Ticker } from 'pixi.js';
import Hero from './Entities/Hero';
import AsteroidManager from './Managers/AsteroidManager';
import ResizeManager from './Managers/ResizeManager';
import Utils from './Utils/Utils';
import LevelManager from './Managers/LevelManager';
import UIButton from './UI/Elements/UIButton';
import GameStateManager, { GameState } from './Managers/GameStateManager';
import ScreenUtil from './Utils/ScreenUtil';
import GameStorage from './Utils/GameStorage';

export default class Game extends Container {
    private pixiApp: Application<Renderer>;
    private hero: Hero;
    private asteroidManager: AsteroidManager;
    private levelManager: LevelManager;
    private pauseButton: UIButton;

    private boundUpdate: (ticker: Ticker) => void;
    private boundHeroUpdate: () => void;
    private boundAsteroidUpdate: () => void;
    private resizeCallback: () => void;
    private boundLevelUpdate: (deltaMS: number) => void;

    constructor(app: Application<Renderer>) {
        super();
        this.pixiApp = app;
        this.initEntities();
    }

    private initEntities() {
        this.hero = new Hero('Hero');
        this.addChild(this.hero);

        this.asteroidManager = new AsteroidManager(['Asteroid_grey', 'Asteroid_brown', 'Asteroid_grey_&_blue']);
        this.addChild(this.asteroidManager);

        this.levelManager = new LevelManager(GameStorage.missionIndex);
        this.addChild(this.levelManager.getTimerText());

        this.createPauseButton();

        this.resizeCallback = () => {
            Utils.repositionAccordingToResize(this.hero.sprite);
            this.pauseButton.position.set(ScreenUtil.width - 60, 10);
        };
        ResizeManager.getInstance().onResize(this.resizeCallback);

        this.boundHeroUpdate = this.hero.update.bind(this.hero, this.asteroidManager.asteroids);
        this.boundAsteroidUpdate = this.asteroidManager.update.bind(this.asteroidManager);
        this.boundUpdate = this.update.bind(this);
        this.boundLevelUpdate = this.levelManager.update;

        this.pixiApp.ticker.add(this.boundUpdate);

        this.levelManager.startLevel();
    }

    private createPauseButton(): void {
        this.pauseButton = new UIButton({
            label: '⏸',
            width: 50,
            height: 50,
            fontSize: 24,
            onClick: this.togglePause.bind(this),
        });
        this.pauseButton.position.set(ScreenUtil.width - 60, 10);
        this.addChild(this.pauseButton);
    }

    private togglePause(): void {
        GameStateManager.getInstance().changeState(GameState.Paused);
    }

    private update(ticker: Ticker): void {
        if (GameStateManager.getInstance().getState() === GameState.Playing) {
            this.boundAsteroidUpdate();
            this.boundHeroUpdate();
            this.boundLevelUpdate(ticker.elapsedMS);
        }
    }

    public destroy(options?: { children?: boolean }): void {
        this.pixiApp.ticker.remove(this.boundUpdate);
        this.pixiApp.ticker.remove(this.boundAsteroidUpdate);
        this.pixiApp.ticker.remove(this.boundHeroUpdate);
        ResizeManager.getInstance().offResize(this.resizeCallback);

        this.hero.destroy();
        this.asteroidManager.destroy();
        this.levelManager.destroy();
        this.pauseButton.destroy();

        super.destroy(options);
    }
}
