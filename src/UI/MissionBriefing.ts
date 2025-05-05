import { Container, Text, TextStyle, Graphics } from "pixi.js";
import UIButton from "./Elements/UIButton";
import GameStateManager, { GameState } from "../Managers/GameStateManager";
import ResizeManager from "../Utils/ResizeManager";
import MissionConfig from "../Configs/MissionsCfg.json";

interface MissionData {
    name: string;
    description: string;
    objectives: string[];
    missionDuration?: number;
}

export default class MissionBriefing extends Container {
    private resizeManager: ResizeManager;

    constructor(missionIndex: number = 0) {
        super();

        const mission: MissionData = MissionConfig.missions[missionIndex];
        const duration = mission.missionDuration ?? 0;

        const styleTitle = new TextStyle({
            fontSize: 40,
            fill: "#ffffff",
            fontWeight: "bold"
        });

        const styleDescription = new TextStyle({
            fontSize: 20,
            fill: "#ffffff"
        });

        const title = new Text(mission.name, styleTitle);
        title.anchor.set(0.5);
        title.position.set(window.innerWidth / 2, 100);
        this.addChild(title);

        const description = new Text(mission.description, styleDescription);
        description.anchor.set(0.5, 0);
        description.position.set(window.innerWidth / 2, 160);
        description.style.wordWrap = true;
        description.style.wordWrapWidth = window.innerWidth - 100;
        this.addChild(description);

        let objectiveY = description.y + description.height + 30;
        mission.objectives.forEach((rawObj, i) => {
            const text = rawObj.replace("{duration}", duration.toString()).trim();
            if (text.length === 0) return;

            const objText = new Text(`• ${text}`, styleDescription);
            objText.anchor.set(0.5, 0);
            objText.position.set(window.innerWidth / 2, objectiveY);
            objectiveY += objText.height + 10;
            this.addChild(objText);
        });

        const startButton = new UIButton({
            label: "Start Mission",
            width: 220,
            height: 60,
            fontSize: 24,
            onClick: () => {
                GameStateManager.getInstance().changeState(GameState.Playing);
            }
        });
        startButton.position.set(window.innerWidth / 2 - startButton.width / 2, objectiveY + 40);
        this.addChild(startButton);

        this.resizeManager = ResizeManager.getInstance();
        this.resizeManager.onResize(() => this.resize());
    }

    private resize(): void {
        // Optional: реалізуй переміщення елементів на зміну розміру
        // Залежно від того, як саме ти хочеш адаптувати елементи
    }

    public destroy(): void {
        super.destroy({ children: true });
    }
}
