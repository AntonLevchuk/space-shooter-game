import { Container, Texture, Ticker } from 'pixi.js';
import Asteroid from '../Entities/Asteroid';
import MissionCfg from '../Configs/MissionsCfg.json';
import Utils from '../Utils/Utils';
import GameStateManager from './GameStateManager';
import GameStorage from '../Utils/GameStorage';

export default class AsteroidManager extends Container {
    private textures: Texture[] = [];
    private spawnInterval: number = MissionCfg.missions[GameStorage.missionIndex].enemiesConfigs.SpawnInterval;
    private lastSpawnTime = 0;
    public asteroids: Asteroid[] = [];

    constructor(textures: string[]) {
        super();
        this.textures = textures.map(texture => Texture.from(texture));
    }

    public update(): void {
        if (!GameStateManager.getInstance().isPlaying()) return;
        const now = Date.now();

        if (now - this.lastSpawnTime >= this.spawnInterval) {
            this.createAsteroid();
            this.lastSpawnTime = now;
        }

        this.updateAsteroids();
    }

    protected createAsteroid(): void {
        const asteroid = new Asteroid(this.textures[Math.floor(Math.random() * this.textures.length)]);
        this.addChild(asteroid);
        this.asteroids.push(asteroid);
    }

    protected updateAsteroids(): void {
        for (let i: number = 0; i < this.asteroids.length; i++) {
            const asteroid = this.asteroids[i];
            asteroid.update();

            if (Utils.isOutOfScreen(asteroid, true)) {
                GameStorage.starsErned--;
                asteroid.destroy();
                this.asteroids.splice(i, 1);
            }
        }
    }

    public destroy(): void {
        Ticker.shared.remove(this.update, this);
        super.destroy();
    }
}