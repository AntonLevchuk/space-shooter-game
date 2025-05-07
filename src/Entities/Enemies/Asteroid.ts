import { Texture, Ticker } from 'pixi.js';
import ScreenUtil from '../../Utils/ScreenUtil';
import GameStateManager from '../../Managers/GameStateManager';
import GameStorage from '../../Utils/GameStorage';
import BaseEnemyClass from './BaseEnemyClass';

export default class Asteroid extends BaseEnemyClass {
    private speed: number;
    public outOfScreenOnBottomBorder: boolean = true;
    public enemyType: string = GameStorage.asteroidEnemyTypeName;

    constructor(texture: Texture) {
        super(texture);

        this.anchor.set(0.5);
        this.y = -this.height;

        const enemyConfig = GameStorage.getEnemyConfig(this.enemyType);
        
        this.scale.set(this.getRandomScale(
            enemyConfig.MinScale, 
            enemyConfig.MaxScale
        ));
        this.x = this.width + Math.random() * (ScreenUtil.width - this.width * 1.5);

        this.speed = this.getRandomSpeed(
            enemyConfig.MinSpeed, 
            enemyConfig.MaxSpeed
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
        this.move();
    }

    public move(): void {
        this.y += this.speed;
    }

    public destroy(): void {
        Ticker.shared.remove(this.update, this);
        super.destroy();
    }
}