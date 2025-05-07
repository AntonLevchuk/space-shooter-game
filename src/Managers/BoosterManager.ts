import { Container, Texture } from 'pixi.js';
import BoosterItem from '../Entities/BoosterItem';
import BoostersCfg from '../Configs/BoostersCfg.json';

export default class BoosterManager extends Container {
    private booster: BoosterItem;
    private hasSpawned: boolean = false;
    private spawnTimerId: number;

    constructor() {
        super();
        this.start();
    }

    private start(): void {
        const boostersConfig = BoostersCfg.Boosters;
        for (const key of Object.keys(boostersConfig)) {
            const boostertype = boostersConfig[key as keyof typeof boostersConfig].Type;
            const spriteName = boostersConfig[key as keyof typeof boostersConfig].SpriteName;
            const delay = Math.random() * (boostersConfig[key as keyof typeof boostersConfig].MaxAppearenceDelay * 1000);
            this.spawnTimerId = window.setTimeout(this.spawnBooster.bind(this, spriteName, boostertype), delay);
        }
    }

    private spawnBooster(spriteName: string, boostertype: string): void {
        if (this.hasSpawned) return;

        this.hasSpawned = true;
        this.booster = new BoosterItem(Texture.from(spriteName), boostertype);
        this.addChild(this.booster);
    }

    public update(): void {
        if (this.booster) {
            this.booster.update();
        }
    }

    public reset(): void {
        this.hasSpawned = false;

        if (this.spawnTimerId !== null) {
            clearTimeout(this.spawnTimerId);
            this.spawnTimerId = null;
        }

        if (this.booster) {
            this.booster.destroy();
            this.booster = null;
        }
    }

    public destroy(): void {
        this.reset();
    }
}
