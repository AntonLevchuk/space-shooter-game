import { Container } from "pixi.js";
import UIButton from "./Elements/UIButton";
import GameStateManager, { GameState } from "../Managers/GameStateManager";
import ScreenUtil from "../Utils/ScreenUtil";
import ResizeManager from "../Utils/ResizeManager";

export default class MainMenu extends Container {
    private playButton: UIButton;
    private settingsButton: UIButton;
    private muteButton: UIButton;
    private resizeManager: ResizeManager;

    constructor(onSettings: () => void, onToggleMute: () => void) {
        super();

        //move values to config file
        this.playButton = new UIButton({
            label: "Play",
            width: 200,
            height: 60,
            fontSize: 26,
            onClick: this.playButtonClick.bind(this),
        });
        this.playButton.position.set(ScreenUtil.width / 2 - 100, ScreenUtil.height / 2 - 100);
        this.addChild(this.playButton);

        //move values to config file
        this.settingsButton = new UIButton({
            label: "Settings",
            width: 200,
            height: 60,
            fontSize: 26,
            onClick: onSettings,
        });
        this.settingsButton.position.set(ScreenUtil.width / 2 - 100, ScreenUtil.height / 2);
        this.addChild(this.settingsButton);

        //move values to config file
        this.muteButton = new UIButton({
            label: "Mute",
            width: 50,
            height: 50,
            fontSize: 20,
            onClick: onToggleMute,
        });
        this.muteButton.position.set(ScreenUtil.width - 60, 10);
        this.addChild(this.muteButton);

        this.resize();
        this.resizeManager = ResizeManager.getInstance();
        this.resizeManager.onResize(() => {
            this.resize();
        });
    }

    private resize(): void {
        const centerX = ScreenUtil.width / 2;
        const centerY = ScreenUtil.height / 2;

        this.playButton.position.set(centerX - this.playButton.width / 2, centerY - 100);
        this.settingsButton.position.set(centerX - this.settingsButton.width / 2, centerY);
        this.muteButton.position.set(ScreenUtil.width - this.muteButton.width - 10, 10);
    }

    protected playButtonClick(): void {
        GameStateManager.getInstance().changeState(GameState.MissionBriefing);
    }

    public destroy(): void {
        this.resizeManager = null;
        super.destroy();
    }
}
