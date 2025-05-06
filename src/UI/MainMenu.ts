import { Container } from 'pixi.js';
import UIButton from './Elements/UIButton';
import GameStateManager, { GameState } from '../Managers/GameStateManager';
import ScreenUtil from '../Utils/ScreenUtil';
import ResizeManager from '../Managers/ResizeManager';
import MenuCfg from '../Configs/MenuCfg.json';

export default class MainMenu extends Container {
    private playButton: UIButton;
    private settingsButton: UIButton;
    private muteButton: UIButton;
    private resizeManager: ResizeManager;
    private _resizeCallback: () => void;

    constructor(onSettings: () => void, onToggleMute: () => void) {
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

        this.settingsButton = new UIButton({
            label: MenuCfg.mainMenu.settingsButtonName,
            width: MenuCfg.mainMenu.playButtonParams.width,
            height: MenuCfg.mainMenu.playButtonParams.height,
            fontSize: MenuCfg.mainMenu.playButtonParams.fontSize,
            onClick: onSettings,
        });
        this.settingsButton.position.set(ScreenUtil.width / 2 - MenuCfg.mainMenu.playButtonParams.offSetX, ScreenUtil.height / 2);
        this.addChild(this.settingsButton);

        this.muteButton = new UIButton({
            label: MenuCfg.mainMenu.muteButtonName,
            width: MenuCfg.mainMenu.muteButtonParams.width,
            height: MenuCfg.mainMenu.muteButtonParams.height,
            fontSize: MenuCfg.mainMenu.muteButtonParams.fontSize,
            onClick: onToggleMute,
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
        this.settingsButton.position.set(centerX - this.settingsButton.width / 2, centerY);
        this.muteButton.position.set(ScreenUtil.width - this.muteButton.width - MenuCfg.mainMenu.muteButtonParams.offSetY, MenuCfg.mainMenu.muteButtonParams.offSetY);
    }

    protected playButtonClick(): void {
        GameStateManager.getInstance().changeState(GameState.MissionBriefing);
    }

    public destroy(): void {
        this.resizeManager.offResize(this._resizeCallback);
        this.resizeManager = null;
        this.playButton = null;
        this.settingsButton = null;
        this.muteButton = null;
        super.destroy();
    }
}
