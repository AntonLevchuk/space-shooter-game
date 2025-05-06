import { Application, Container, Renderer, Sprite, Ticker } from 'pixi.js';
import Hero from './Entities/Hero';
import AsteroidManager from './Managers/AsteroidManager';
import ResizeManager from './Managers/ResizeManager';
import Utils from './Utils/Utils';
import LevelManager from './Managers/LevelManager';
import UIButton from './UI/Elements/UIButton';
import GameStateManager, { GameState } from './Managers/GameStateManager';
import ScreenUtil from './Utils/ScreenUtil';


export default class Game {
    private pixiApp: Application<Renderer>;
    private hero: Hero = null;
    private asteroidManager: AsteroidManager;
    public view: Container = new Container();
    private levelManager: LevelManager;
    private pauseButton: UIButton;
    private _resizeCallback: () => void;

    constructor(app: Application<Renderer>) {
        this.pixiApp = app;
        this.initEntities();
        this.pixiApp.ticker.add(this.update, this);
    }

    public initEntities() {
        this.hero = new Hero('Hero');
        this.view.addChild(this.hero);

        this.asteroidManager = new AsteroidManager(['Asteroid_grey', 'Asteroid_brown', 'Asteroid_grey_&_blue']);
        this.view.addChild(this.asteroidManager);

        this.createPauseButton();

        ResizeManager.getInstance().onResize(() => {
            Utils.repositionAccordingToResize(this.hero.sprite);
        });

        this.levelManager = new LevelManager(Utils.missionIndex);
        this.view.addChild(this.levelManager.getTimerText());
        this.levelManager.startLevel();
    }

    private createPauseButton() {
        this.pauseButton = new UIButton({
            label: '⏸',
            width: 50,
            height: 50,
            fontSize: 24,
            onClick: this.togglePause.bind(this),
        });
        this.pauseButton.position.set(ScreenUtil.width - 60, 10);
        this.view.addChild(this.pauseButton);

        this._resizeCallback = () => {
            this.pauseButton.position.set(ScreenUtil.width - 60, 10);
        };
        ResizeManager.getInstance().onResize(this._resizeCallback);
    }

    private togglePause(): void {
        GameStateManager.getInstance().changeState(GameState.Paused);
    }

    update(ticker: Ticker) {
        this.asteroidManager.update();
        this.hero.update(this.asteroidManager.asteroids);
        if (GameStateManager.getInstance().getState() !== GameState.Paused) {
            this.levelManager.timer.timerManager.update(ticker.elapsedMS);
        }

    }

    public destroy() {
        Ticker.shared.remove(this.update, this);
        ResizeManager.getInstance().offResize(this._resizeCallback);
        this.levelManager.destroy();
        this.hero = null;
        this.asteroidManager = null;
        this.view = null;
        this.levelManager = null;
    }
}