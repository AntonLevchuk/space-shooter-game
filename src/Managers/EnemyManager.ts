import { Container, DestroyOptions, Sprite, Texture } from "pixi.js";
import EnemyFactory from "../Factories/EnemyFactory";
import GameCfg from "../Configs/GameCfg.json";
import GameStateManager from "./GameStateManager";
import BaseEnemyClass from "../Entities/Enemies/BaseEnemyClass";
import Utils from "../Utils/Utils";
import GameStorage from "../Utils/GameStorage";

export default class EnemyManager extends Container {
    public enemies: BaseEnemyClass[] = [];
    private missionIndex: number;
    private enemyFactory: EnemyFactory;
    private lastSpawnTimes: Record<string, number> = {};

    constructor(missionIndex: number) {
        super();
        this.missionIndex = missionIndex;
        this.enemyFactory = new EnemyFactory();
    
        const enemyTypes = GameCfg.missions[this.missionIndex].enemies;
        for (const type of enemyTypes) {
            this.lastSpawnTimes[type] = 0;
        }
    }

    public update(): void {
        if (!GameStateManager.getInstance().isPlaying()) return;
        const now = Date.now();

        const missionConfig = GameStorage.missionConfig;
        for (const enemyType of missionConfig.enemies) {
            const interval = missionConfig.enemiesConfigs[
                enemyType as keyof typeof missionConfig.enemiesConfigs
            ].SpawnInterval;

            if (now - this.lastSpawnTimes[enemyType] >= interval) {
                this.createEnemy(enemyType);
                this.lastSpawnTimes[enemyType] = now;
            }
        }

        this.updateEnemies();
    }

    private createEnemy(enemyType: string) {
        const missionConfig = GameStorage.missionConfig;
        const enemiesTexturesKeys: string[] = missionConfig.enemiesTexturesKeys[
            enemyType as keyof typeof missionConfig.enemiesTexturesKeys
        ];
        const enemyTexture: Texture = Texture.from(
            enemiesTexturesKeys[Math.floor(Math.random() * enemiesTexturesKeys.length)]
        );
        
        const enemy: BaseEnemyClass = this.enemyFactory.createEnemy(enemyType, enemyTexture);
        
        if (!this.children.includes(enemy)) {
            this.addChild(enemy);
            this.enemies.push(enemy);
        }
    }

    private updateEnemies(): void {
        for (let i: number = 0; i < this.enemies.length; i++) {
            const enemy: BaseEnemyClass = this.enemies[i];
            enemy.update();

            if (Utils.isOutOfScreen(enemy, enemy.outOfScreenOnBottomBorder)) {
                GameStorage.starsErned--;
                enemy.destroy();
                this.enemies.splice(i, 1);
            }
        }
    }

    public destroy(options?: DestroyOptions): void {
        super.destroy(options);
    }
}
