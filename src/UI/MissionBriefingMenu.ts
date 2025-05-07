import { Container, Text, TextStyle } from 'pixi.js';
import UIButton from './Elements/UIButton';
import GameStateManager, { GameState } from '../Managers/GameStateManager';
import ResizeManager from '../Managers/ResizeManager';
import ScreenUtil from '../Utils/ScreenUtil';
import MissionCfg from '../Configs/GameCfg.json';
import MenuCfg from '../Configs/MenuCfg.json';

export default class MissionBriefingMenu extends Container {
    private titleText: Text;
    private descriptionText: Text;
    private objectivesText: Text;
    private playButton: UIButton;
    private backButton: UIButton;
    private _resizeCallback: () => void;

    private resizeManager: ResizeManager;
    private missionIndex: number;

    constructor(missionIndex: number = 0) {
        super();
        this.missionIndex = missionIndex;
        this.resizeManager = ResizeManager.getInstance();

        const mission = MissionCfg.missions[missionIndex];
        if (!mission) throw new Error(`Mission with index ${missionIndex} not found`);

        const titleStyle = new TextStyle({ fontSize: MenuCfg.briefingMenu.title.titleFontSize, fill: MenuCfg.briefingMenu.title.titleFontColor, fontWeight: 'bold' });
        const descStyle = new TextStyle({ fontSize: MenuCfg.briefingMenu.description.descriptionFontSize, fill: MenuCfg.briefingMenu.description.descriptionFontColor, wordWrap: true });
        const objStyle = new TextStyle({ fontSize: MenuCfg.briefingMenu.objectives.objectivesFontSize, fill: MenuCfg.briefingMenu.objectives.objectivesFontColor });

        this.titleText = new Text(mission.name, titleStyle);
        this.addChild(this.titleText);

        this.descriptionText = new Text(mission.description, descStyle);
        this.descriptionText.style.wordWrapWidth = ScreenUtil.width * 0.8;
        this.addChild(this.descriptionText);

        this.objectivesText = new Text(this.formatObjectives(mission.objectives, mission.missionDuration), objStyle);
        this.addChild(this.objectivesText);

        this.playButton = new UIButton({
            label: MenuCfg.briefingMenu.playButtonName,
            width: MenuCfg.briefingMenu.buttonWidth,
            height: MenuCfg.briefingMenu.buttonHeight,
            fontSize: MenuCfg.briefingMenu.buttonFontSize,
            onClick: this.startMission.bind(this),
        });
        this.addChild(this.playButton);

        this.backButton = new UIButton({
            label: MenuCfg.briefingMenu.mainMenuButtonName,
            width: MenuCfg.briefingMenu.buttonWidth,
            height: MenuCfg.briefingMenu.buttonHeight,
            fontSize: MenuCfg.briefingMenu.buttonFontSize,
            onClick: this.returnToMenu.bind(this),
        });
        this.addChild(this.backButton);

        this.resize();
        this._resizeCallback = () => this.resize();
        this.resizeManager.onResize(this._resizeCallback);
    }

    private formatObjectives(objectives: string[], duration?: number): string {
        return objectives
            .filter((obj) => obj.trim() !== '')
            .map((obj) =>
                obj.includes('{duration}') && duration
                    ? obj.replace('{duration}', duration.toString())
                    : obj
            )
            .join('\n');
    }

    private resize(): void {
        const centerX = ScreenUtil.width / 2;
        let currentY = 80;

        this.titleText.position.set(centerX - this.titleText.width / 2, currentY);
        currentY += this.titleText.height + 20;

        this.descriptionText.style.wordWrapWidth = ScreenUtil.width * 0.8;
        this.descriptionText.position.set(centerX - this.descriptionText.width / 2, currentY);
        currentY += this.descriptionText.height + 20;

        this.objectivesText.position.set(centerX - this.objectivesText.width / 2, currentY);
        currentY += this.objectivesText.height + 40;

        this.playButton.position.set(centerX - this.playButton.width / 2, currentY);
        this.backButton.position.set(centerX - this.backButton.width / 2, currentY + 80);
    }

    private startMission(): void {
        GameStateManager.getInstance().changeState(GameState.Playing);
    }

    private returnToMenu(): void {
        GameStateManager.getInstance().changeState(GameState.MainMenu);
    }

    public destroy(): void {
        this.resizeManager.offResize(this._resizeCallback);
        super.destroy();
    }
}
