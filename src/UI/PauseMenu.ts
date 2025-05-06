import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import UIButton from './Elements/UIButton';
import GameStateManager, { GameState } from '../Managers/GameStateManager';
import ResizeManager from '../Managers/ResizeManager';
import ScreenUtil from '../Utils/ScreenUtil';

export default class PauseMenu extends Container {
    private background: Graphics;
    private titleText: Text;
    private resumeButton: UIButton;
    private exitButton: UIButton;
    private resizeManager: ResizeManager;
    private _resizeCallback: () => void;

    constructor() {
        super();

        this.background = new Graphics()
            .beginFill(0x000000, 0.6)
            .drawRect(0, 0, ScreenUtil.width, ScreenUtil.height)
            .endFill();
        this.addChild(this.background);

        this.titleText = new Text('Pause', new TextStyle({
            fontSize: 48,
            fill: 0xffffff,
        }));
        this.titleText.anchor.set(0.5);
        this.addChild(this.titleText);

        this.resumeButton = new UIButton({
            label: 'Continue',
            width: 200,
            height: 60,
            fontSize: 22,
            onClick: () => GameStateManager.getInstance().changeState(GameState.Playing),
        });
        this.resumeButton.pivot.set(this.resumeButton.width / 2, this.resumeButton.height / 2);
        this.addChild(this.resumeButton);

        this.exitButton = new UIButton({
            label: 'Back to Menu',
            width: 200,
            height: 60,
            fontSize: 22,
            onClick: () => GameStateManager.getInstance().changeState(GameState.MainMenu),
        });
        this.exitButton.pivot.set(this.exitButton.width / 2, this.exitButton.height / 2);
        this.addChild(this.exitButton);

        this.onResize();
        this.resizeManager = ResizeManager.getInstance();
        this._resizeCallback = () => this.onResize();
        this.resizeManager.onResize(this._resizeCallback);
    }

    private onResize = () => {
        const centerX = ScreenUtil.width / 2;
        const centerY = ScreenUtil.height / 2;

        this.background.clear()
            .beginFill(0x000000, 0.6)
            .drawRect(0, 0, ScreenUtil.width, ScreenUtil.height)
            .endFill();

        this.titleText.position.set(centerX, centerY - 120);
        this.resumeButton.position.set(centerX, centerY);
        this.exitButton.position.set(centerX, centerY + 80);
    };

    public destroy(): void {
        this.resizeManager.offResize(this._resizeCallback);
        super.destroy();
    }
}
