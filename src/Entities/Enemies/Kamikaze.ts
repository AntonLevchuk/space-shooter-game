import { Texture, Ticker } from "pixi.js";
import BaseEnemyClass from "./BaseEnemyClass";
import GameStorage from "../../Utils/GameStorage";
import ScreenUtil from "../../Utils/ScreenUtil";
import GameStateManager from "../../Managers/GameStateManager";

export default class Kamikaze extends BaseEnemyClass {
    private speed: number;
    public enemyType: string = GameStorage.kamikazeEnemyTypeName;

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

    protected getRandomScale(min: number, max: number = 0.11): number {
        return Math.random() * (max - min) + min;
    }

    protected getRandomSpeed(min: number = 0.5, max: number = 1.4): number {
        return min + Math.random() * max;
    }

    public update() {
        if (!GameStateManager.getInstance().isPlaying()) return;
        this.move();
    }

    public move(): void {
        if (!GameStorage.hero) return

        const dx = GameStorage.hero.sprite.x - this.x;
        const dy = GameStorage.hero.sprite.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0) return;

        const vx = (dx / distance) * this.speed;
        const vy = (dy / distance) * this.speed;

        this.x += vx;
        this.y += vy;
    }

    public destroy(): void {
        Ticker.shared.remove(this.update, this);
        super.destroy();
    }
}