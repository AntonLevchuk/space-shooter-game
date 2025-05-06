import { Application, Container, Renderer } from 'pixi.js';
import MainMenu from '../UI/MainMenu';
import SceneManager from './SceneManager';
import MissionBriefing from '../UI/MissionBriefing';
import Game from '../Game';
import Utils from '../Utils/Utils';
import PauseMenu from '../UI/PauseMenu';

export enum GameState {
    MainMenu = 'MainMenu',
    Settings = 'Settings',
    MissionBriefing = 'MissionBriefing',
    Playing = 'Playing',
    Paused = 'Paused',
    GameOver = 'GameOver',
    LevelComplete = 'LevelComplete',
}

export default class GameStateManager {
    private static instance: GameStateManager;
    private app: Application<Renderer>;
    private currentScene: Container;
    private state: GameState;
    public static wasPaused: boolean = false;
    private game: Game;

    private constructor(app: Application<Renderer>) {
        this.app = app;
        this.currentScene = null;
        this.state = GameState.MainMenu;
    }

    public static init(app: Application<Renderer>): GameStateManager {
        if (!GameStateManager.instance) {
            GameStateManager.instance = new GameStateManager(app);
        }
        return GameStateManager.instance;
    }

    public static getInstance(): GameStateManager {
        if (!GameStateManager.instance) {
            throw new Error('GameStateManager not initialized. Call init(app) first.');
        }
        return GameStateManager.instance;
    }

    public changeState(newState: GameState): void {
        this.state = newState;

        switch (this.state) {
            case GameState.MainMenu:
                this.currentScene = new MainMenu(
                    () => console.log('Settings pressed'),
                    () => console.log('Toggle Mute pressed')
                );
                break;
            case GameState.MissionBriefing:
                this.currentScene = new MissionBriefing(Utils.missionIndex);
                break;
            case GameState.Playing:
                if (!GameStateManager.wasPaused) {
                    this.game = new Game(this.app);
                }
                this.currentScene = this.game.view;
                GameStateManager.wasPaused = false;
                break;
            case GameState.Paused:
                this.currentScene = new PauseMenu();
                GameStateManager.wasPaused = true;
                break;
        }

        if (this.currentScene) {
            SceneManager.changeScene(this.currentScene);
            this.app.stage.addChild(this.currentScene);
        }
    }

    public getState(): GameState {
        return this.state;
    }

    public isPlaying(): boolean {
        return this.state === GameState.Playing;
    }
}
