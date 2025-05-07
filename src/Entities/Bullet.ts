import { Sprite, Texture, Ticker } from 'pixi.js';
import HeroCfg from '../Configs/HeroCfg.json';
import GameStateManager from '../Managers/GameStateManager';

export default class Bullet extends Sprite {
    private bulletSpeed: number = HeroCfg.BulletSpeed;
    private directionX: number = 0;
    private directionY: number = -1;

    constructor(texture: Texture, x: number, y: number, directionX: number = 0, directionY: number = -1) {
        super(texture);
        this.anchor.set(0.5);
        this.x = x;
        this.y = y;

        this.directionX = directionX;
        this.directionY = directionY;

        if (this.directionY < 0) {
            this.rotation = 3 * Math.PI / 2;
        } else if (this.directionY > 0 && this.directionX === 0) {
            this.rotation = Math.PI / 2;
        } else {
            this.rotation = Math.atan2(this.directionY, this.directionX);
        }

        this.scale.set(HeroCfg.BulletScale);
    }

    public update(): void {
        if (!GameStateManager.getInstance().isPlaying()) return;
        this.moove();
    }
    
    private moove(): void {
        this.x += this.directionX * this.bulletSpeed;
        this.y += this.directionY * this.bulletSpeed;

    }

    public destroy(): void {
        Ticker.shared.remove(this.update, this);
        super.destroy();
    }
}
