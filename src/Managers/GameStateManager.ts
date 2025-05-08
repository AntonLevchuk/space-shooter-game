import { Application, Container, Renderer } from 'pixi.js';
import MainMenu from '../UI/MainMenu';
import SceneManager from './SceneManager';
import MissionBriefingMenu from '../UI/MissionBriefingMenu';
import Game from '../Game';
import PauseMenu from '../UI/PauseMenu';
import LevelEndMenu from '../UI/LevelEndMenu';
import GameStorage from '../Utils/GameStorage';
import { SoundsManager } from './SoundsManager';

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
        const soundsManager = SoundsManager.getInstance();

        switch (this.state) {
            case GameState.MainMenu:
                GameStorage.missionIndex = 0;
                this.currentScene = new MainMenu();
                soundsManager.play('Main_menu_ambient_sound.mp3');
                soundsManager.stop('Round_ambient_sound.mp3');
                break;
            case GameState.MissionBriefing:
                this.currentScene = new MissionBriefingMenu(GameStorage.missionIndex);
                soundsManager.play('Main_menu_ambient_sound.mp3');
                soundsManager.stop('Round_ambient_sound.mp3');
                break;
            case GameState.Playing:
                if (!GameStateManager.wasPaused) {
                    this.game = new Game(this.app);
                    GameStorage.resetGameValues();
                }
                this.currentScene = this.game;
                GameStateManager.wasPaused = false;
                soundsManager.play('Round_ambient_sound.mp3');
                soundsManager.stop('Main_menu_ambient_sound.mp3');
                break;
            case GameState.Paused:
                this.currentScene = new PauseMenu();
                GameStateManager.wasPaused = true;
                soundsManager.play('Main_menu_ambient_sound.mp3');
                soundsManager.stop('Round_ambient_sound.mp3');
                break;
            case GameState.LevelComplete:
                this.currentScene = new LevelEndMenu();
                soundsManager.play('Main_menu_ambient_sound.mp3');
                soundsManager.stop('Round_ambient_sound.mp3');
                break;
            case GameState.GameOver:
                this.currentScene = new LevelEndMenu();
                soundsManager.play('Main_menu_ambient_sound.mp3');
                soundsManager.stop('Round_ambient_sound.mp3');
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
