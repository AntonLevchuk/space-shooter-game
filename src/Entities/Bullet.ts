import { Sprite, Texture, Ticker } from 'pixi.js';
import HeroCfg from '../Configs/HeroCfg.json';
import GameStateManager from '../Managers/GameStateManager';

export default class Bullet extends Sprite {
    private bulletSpeed: number = HeroCfg.BulletSpeed;

    constructor(texture: Texture, x: number, y: number) {
        super(texture);
        this.anchor.set(0.5);
        this.x = x;
        this.y = y;
        this.rotation = 3 * Math.PI / 2;
        this.scale.set(HeroCfg.BulletScale);
    }

    public update(): void {
        if (!GameStateManager.getInstance().isPlaying()) return;
        this.moveUp();
    }

    private moveUp(): void {
        this.y -= this.bulletSpeed;
    }

    public destroy(): void {
        Ticker.shared.remove(this.update, this);
        this.bulletSpeed = null;
        super.destroy();
    }
}