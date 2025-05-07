import { Container, DestroyOptions, Sprite, Text, TextStyle } from 'pixi.js';
import UIButton from './Elements/UIButton';
import GameStateManager, { GameState } from '../Managers/GameStateManager';
import ScreenUtil from '../Utils/ScreenUtil';
import ResizeManager from '../Managers/ResizeManager';
import GameStorage from '../Utils/GameStorage';
import LevelEndMenuCfg from '../Configs/LevelEndMenuCfg.json';

export default class LevelEndMenu extends Container {
    private starsContainer: Container;
    private totalStars: number = LevelEndMenuCfg.TotalStartAmount;
    private title: Text;
    private retryBtn: UIButton;
    private nextRoundBtn: UIButton;
    private resizeManager: ResizeManager;
    private _resizeCallback: () => void;

    constructor() {
        super();
        
        const isComplete = GameStateManager.getInstance().getState() === GameState.LevelComplete;

        this.title = new Text(
            isComplete
                ? LevelEndMenuCfg.LevelComplete.Title.Text 
                : LevelEndMenuCfg.LevelFailed.Title.Text
            , new TextStyle({
            fontSize: LevelEndMenuCfg.LevelComplete.Title.FontSize,
            fill: LevelEndMenuCfg.LevelComplete.Title.Color,
        }));
        this.title.anchor.set(0.5);
        this.addChild(this.title);

        this.starsContainer = new Container();
        const starSpacing = 60;

        for (let i = 0; i < this.totalStars; i++) {
            const star = Sprite.from(
                i < GameStorage.starsErned 
                    ? LevelEndMenuCfg.StartName 
                    : LevelEndMenuCfg.EmptyStarName
            );
            star.anchor.set(0.5);
            star.scale.set(0.5);
            star.position.set(i * starSpacing, 0);
            this.starsContainer.addChild(star);
        }
        this.addChild(this.starsContainer);

        this.retryBtn = new UIButton({
            label: LevelEndMenuCfg.RetryButton.Text,
            width: LevelEndMenuCfg.RetryButton.Width,
            height: LevelEndMenuCfg.RetryButton.Height,
            onClick: () => {
                GameStateManager.getInstance().changeState(GameState.MissionBriefing)
            },
        });
        this.addChild(this.retryBtn);

        this.nextRoundBtn = new UIButton({
            label: LevelEndMenuCfg.LevelComplete.NextLevelButton.Text,
            width: LevelEndMenuCfg.LevelComplete.NextLevelButton.Width,
            height: LevelEndMenuCfg.LevelComplete.NextLevelButton.Height,
            onClick: () => {
                GameStorage.missionIndex++;
                GameStateManager.getInstance().changeState(GameState.MissionBriefing)
            },
        });
        isComplete && this.addChild(this.nextRoundBtn);

        this.onResize();
        
        this._resizeCallback = () => this.onResize();
        this.resizeManager = ResizeManager.getInstance();
        this.resizeManager.onResize(this._resizeCallback);
    }

    private onResize(): void {
        const centerX = ScreenUtil.width / 2;
        let currentY = LevelEndMenuCfg.InitialYPosition;

        this.title.position.set(centerX, currentY);
        currentY += this.title.height + LevelEndMenuCfg.ItemsOffsetY;

        this.starsContainer.position.set(
            centerX - this.starsContainer.width / 2,
            currentY
        );
        currentY += this.starsContainer.height + LevelEndMenuCfg.ItemsOffsetY;

        this.nextRoundBtn.position.set(centerX - this.nextRoundBtn.width / 2, currentY);
        currentY += this.retryBtn.height + LevelEndMenuCfg.ItemsOffsetY;
        
        this.retryBtn.position.set(centerX - this.retryBtn.width / 2, currentY);
    }

    public destroy(options?: DestroyOptions): void {
        this.resizeManager.offResize(this._resizeCallback);
        super.destroy(options);
    }
}
