import { Container, Application } from 'pixi.js';
import GameStateManager, { GameState } from './GameStateManager';

export default class SceneManager {
    private static app: Application;
    private static currentScene: Container;

    public static init(app: Application): void {
        this.app = app;
    }

    public static changeScene(newScene: Container): void {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
            if (GameStateManager.getInstance().getState() !== GameState.Paused) {
                this.currentScene.destroy({children: true});
            }
        }

        this.currentScene = newScene;
        this.app.stage.addChild(this.currentScene);
    }

    public static getCurrentScene(): Container {
        return this.currentScene;
    }
}
