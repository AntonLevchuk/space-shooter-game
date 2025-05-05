import { Sprite, Texture, Ticker } from "pixi.js";
import AsteroidsCfg from '../Configs/AsteroidsCfg.json';
import ScreenUtil from "../Utils/ScreenUtil";
import Utils from "../Utils/Utils";
import GameStateManager from "../Managers/GameStateManager";

export default class Asteroid extends Sprite {
    private speed: number;

    constructor(texture: Texture) {
        super(texture);

        this.anchor.set(0.5);
        this.y = -this.height;
        
        this.scale.set(this.getRandomScale(AsteroidsCfg.MinScale, AsteroidsCfg.MaxScale));
        this.x = this.width + Math.random() * (ScreenUtil.width - this.width * 1.5);

        this.speed = this.getRandomSpeed(AsteroidsCfg.MinSpeed, AsteroidsCfg.MaxSpeed);

        // Utils.repositionAccordingToResize(this);
        // Ticker.shared.add(this.update, this);
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
        // if (this.isOutOfScreen(this)) {
        //     this.destroy();
        // }
    }

    // public isOutOfScreen(entity: Sprite): boolean {
    //     return entity.y > ScreenUtil.height + entity.height;
    // }

    protected moveDown(): void {
        this.y += this.speed;
    }

    public destroy(): void {
        Ticker.shared.remove(this.update, this);
        this.speed = null;
        super.destroy();
    }
}