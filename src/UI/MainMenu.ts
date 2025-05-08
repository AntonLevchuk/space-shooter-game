import { Container } from 'pixi.js';
import UIButton from './Elements/UIButton';
import GameStateManager, { GameState } from '../Managers/GameStateManager';
import ScreenUtil from '../Utils/ScreenUtil';
import ResizeManager from '../Managers/ResizeManager';
import MenuCfg from '../Configs/MenuCfg.json';
import { SoundsManager } from '../Managers/SoundsManager';
import GameStorage from '../Utils/GameStorage';

export default class MainMenu extends Container {
    private playButton: UIButton;
    private muteButton: UIButton;
    private resizeManager: ResizeManager;
    private _resizeCallback: () => void;

    constructor() {
        super();

        this.playButton = new UIButton({
            label: MenuCfg.mainMenu.playButtonName,
            width: MenuCfg.mainMenu.playButtonParams.width,
            height: MenuCfg.mainMenu.playButtonParams.height,
            fontSize: MenuCfg.mainMenu.playButtonParams.fontSize,
            onClick: this.playButtonClick.bind(this),
        });
        this.playButton.position.set(ScreenUtil.width / 2 - MenuCfg.mainMenu.playButtonParams.offSetX, ScreenUtil.height / 2 - MenuCfg.mainMenu.playButtonParams.offSetY);
        this.addChild(this.playButton);

        this.muteButton = new UIButton({
            label: MenuCfg.mainMenu.muteButtonName,
            width: MenuCfg.mainMenu.muteButtonParams.width,
            height: MenuCfg.mainMenu.muteButtonParams.height,
            fontSize: MenuCfg.mainMenu.muteButtonParams.fontSize,
            onClick: this.muteButtonClick.bind(this),
        });
        this.muteButton.position.set(ScreenUtil.width - MenuCfg.mainMenu.muteButtonParams.offSetX, MenuCfg.mainMenu.muteButtonParams.offSetY);
        this.addChild(this.muteButton);

        this.resize();
        this.resizeManager = ResizeManager.getInstance();
        this._resizeCallback = () => this.resize();
        this.resizeManager.onResize(this._resizeCallback);
    }

    private resize(): void {
        const centerX = ScreenUtil.width / 2;
        const centerY = ScreenUtil.height / 2;

        this.playButton.position.set(centerX - this.playButton.width / 2, centerY - MenuCfg.mainMenu.playButtonParams.offSetY);
        this.muteButton.position.set(ScreenUtil.width - this.muteButton.width - MenuCfg.mainMenu.muteButtonParams.offSetY, MenuCfg.mainMenu.muteButtonParams.offSetY);
    }

    protected playButtonClick(): void {
        GameStateManager.getInstance().changeState(GameState.MissionBriefing);
    }

    protected muteButtonClick(): void {
        if (!GameStorage.soundsMuted) {
            SoundsManager.getInstance().mute(true);
            GameStorage.soundsMuted = true;
        } else {
            SoundsManager.getInstance().mute(false); 
            GameStorage.soundsMuted = false;
        }
    }

    public destroy(): void {
        this.resizeManager.offResize(this._resizeCallback);
        super.destroy();
    }
}
