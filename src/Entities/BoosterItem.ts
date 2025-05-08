import { Sprite, Texture } from 'pixi.js';
import Hero from './Hero';
import Utils from '../Utils/Utils';
import ScreenUtil from '../Utils/ScreenUtil';
import { SoundsManager } from '../Managers/SoundsManager';

export default class BoosterItem extends Sprite {
    private speed: number = 2;
    public static collected: boolean = false;
    public static busterType: string;

    constructor(texture: Texture, busterType: string) {
        super(texture);
        this.anchor.set(0.5);
        this.scale.set(3);

        BoosterItem.busterType = busterType;

        this.x = this.width + Math.random() * (ScreenUtil.width - this.width * 1.5);
        this.y = -this.height;
    }

    public update(): void {
        if (BoosterItem.collected) return;

        this.y += this.speed;

        const hero = Hero.getInstance();
        if (Utils.checkAABBCollision(this, hero.sprite)) {
            this.collect();
        }

        if (this.y > window.innerHeight + 100) {
            this.parent.destroy();
            this.destroy();
        }
    }

    private collect(): void {
        SoundsManager.getInstance().play('Pick_up_booster_sound.mp3');
        BoosterItem.collected = true;
        this.visible = false;
    }
}
