import { Application, Renderer } from 'pixi.js';
import AssetsLoader from './Utils/AssetsLoader';
import ScreenUtil from './Utils/ScreenUtil';
import SceneManager from './Managers/SceneManager';
import GameStateManager, { GameState } from './Managers/GameStateManager';
import ResizeManager from './Managers/ResizeManager';

declare global {
  interface GlobalThis {
    __PIXI_APP__: any;
  }
}

export default class MainApp {
  private app: Application<Renderer>;
  private gameStateManager: GameStateManager;

  constructor() {
    this.app = new Application();
    (globalThis as any).__PIXI_APP__ = this.app;
  }

  public async init(): Promise<void> {
    await this.app.init({
      background: '0x000000',
      resizeTo: window,
    });

    document.body.appendChild(this.app.canvas);

    await this.loadAssets();

    ScreenUtil.init(this.app);
    ResizeManager.init(this.app);
    SceneManager.init(this.app);

    this.gameStateManager = GameStateManager.init(this.app);
    this.gameStateManager.changeState(GameState.MainMenu);
  }

  private async loadAssets(): Promise<void> {
    await AssetsLoader.loadAssets('Hero', ['assets/Hero/Hero.png']);
    await AssetsLoader.loadAssets('Asteroid_grey', ['assets/Asteroids/Asteroid_grey.png']);
    await AssetsLoader.loadAssets('Asteroid_brown', ['assets/Asteroids/Asteroid_brown.png']);
    await AssetsLoader.loadAssets('Asteroid_grey_&_blue', ['assets/Asteroids/Asteroid_grey_&_blue.png']);
    await AssetsLoader.loadAssets('Bullet', ['assets/Bullet/Bullet.png']);
  }
}
