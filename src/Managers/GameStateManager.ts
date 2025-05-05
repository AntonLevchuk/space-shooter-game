import { Application, Container, Renderer } from "pixi.js";
import MainMenu from "../UI/MainMenu";
import SceneManager from "./SceneManager";
import MissionBriefing from "../UI/MissionBriefing";
import Game from "../Game";

export enum GameState {
    MainMenu = "MainMenu",
    Settings = "Settings",
    MissionBriefing = "MissionBriefing",
    Playing = "Playing",
    Paused = "Paused",
    GameOver = "GameOver",
}

export default class GameStateManager {
    private static instance: GameStateManager;
    private app: Application<Renderer>;
    private currentScene: Container;
    private state: GameState;

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
            throw new Error("GameStateManager not initialized. Call init(app) first.");
        }
        return GameStateManager.instance;
    }

    public changeState(newState: GameState): void {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
            this.currentScene.destroy({ children: true });
        }

        this.state = newState;

        switch (this.state) {
            case GameState.MainMenu:
                this.currentScene = new MainMenu(
                    () => console.log("Settings pressed"),
                    () => console.log("Toggle Mute pressed")
                );
                break;
            case GameState.MissionBriefing:
                this.currentScene = new MissionBriefing(0);
                break;
            case GameState.Playing:
                this.currentScene = new Game(this.app).view;
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
