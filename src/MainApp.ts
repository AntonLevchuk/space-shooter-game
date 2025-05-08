import { Application, Renderer } from 'pixi.js';
import AssetsLoader from './Utils/AssetsLoader';
import ScreenUtil from './Utils/ScreenUtil';
import SceneManager from './Managers/SceneManager';
import GameStateManager, { GameState } from './Managers/GameStateManager';
import ResizeManager from './Managers/ResizeManager';
import { SoundsManager } from './Managers/SoundsManager';

interface SoundConfigInterface{
  soundKey: {
    src: string,
    volume: number,
    loop: boolean
  }
}

interface GameConfigInterface {
  allAssetsToLoad: Record<string, string>;
  allSoundsToLoad: Record<string, SoundConfigInterface["soundKey"]>;
}

const GameConfig: GameConfigInterface = require('./Configs/GameCfg.json');

declare global {
  interface GlobalThis {
    __PIXI_APP__: any;
  }
}

export default class MainApp {
  private app: Application<Renderer>;
  private gameStateManager: GameStateManager;
  private soundsManager: SoundsManager;

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

    this.soundsManager = SoundsManager.getInstance();

    await this.loadAssets();
    await this.loadSounds();

    ScreenUtil.init(this.app);
    ResizeManager.init(this.app);
    SceneManager.init(this.app);
    this.gameStateManager = GameStateManager.init(this.app);
    this.gameStateManager.changeState(GameState.MainMenu);
  }
  
  private async loadAssets(): Promise<void> {
    for (const key of Object.keys(GameConfig.allAssetsToLoad)) {
      const assetPath: string = GameConfig.allAssetsToLoad[key as keyof typeof GameConfig.allAssetsToLoad];
      await AssetsLoader.loadAssets(key, [assetPath]);
    }
  }

  private async loadSounds(): Promise<void> {
    for (const key of Object.keys(GameConfig.allSoundsToLoad)) {
      const soundConfig: SoundConfigInterface["soundKey"] = GameConfig.allSoundsToLoad[key as keyof typeof GameConfig.allSoundsToLoad]
      await this.soundsManager.load(key, soundConfig.src, {volume: soundConfig.volume, loop: soundConfig.loop});
    }
  }
}
