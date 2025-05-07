import { Sprite, Texture, Ticker } from 'pixi.js';
import ScreenUtil from '../Utils/ScreenUtil';
import Utils from '../Utils/Utils';
import GameStateManager from '../Managers/GameStateManager';
import MissionCfg from '../Configs/MissionsCfg.json';
import GameStorage from '../Utils/GameStorage';

export default class Asteroid extends Sprite {
    private speed: number;

    constructor(texture: Texture) {
        super(texture);

        this.anchor.set(0.5);
        this.y = -this.height;
        
        this.scale.set(this.getRandomScale(
            MissionCfg.missions[GameStorage.missionIndex].enemiesConfigs.MaxScale, 
            MissionCfg.missions[GameStorage.missionIndex].enemiesConfigs.MaxScale
        ));
        this.x = this.width + Math.random() * (ScreenUtil.width - this.width * 1.5);

        this.speed = this.getRandomSpeed(
            MissionCfg.missions[GameStorage.missionIndex].enemiesConfigs.MinSpeed, 
            MissionCfg.missions[GameStorage.missionIndex].enemiesConfigs.MaxSpeed
        );
    }

    protected getRandomSpeed(min: number = 0.5, max: number = 1.4): number {
        return min + Math.random() * max;
    }

    protected getRandomScale(min: number, max: number = 0.11): number {
        return Math.random() * (max - min) + min;
    }

    public update() {
        if (!GameStateManager.getInstance().isPlaying()) return;
        this.moveDown();
    }

    protected moveDown(): void {
        this.y += this.speed;
    }

    public destroy(): void {
        Ticker.shared.remove(this.update, this);
        super.destroy();
    }
}