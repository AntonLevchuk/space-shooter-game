import { Sprite, Texture } from 'pixi.js';

export default class BaseEnemyClass extends Sprite {
    public outOfScreenOnBottomBorder: boolean;
    public enemyType: string;
    public healthPoints: number;

    constructor(texture: Texture) {
        super(texture);
    }

    public move(): void {
    }

    public attack(): void {
    }

    public update(): void {
    }

    public destroy(): void {
        super.destroy();
    }
}
