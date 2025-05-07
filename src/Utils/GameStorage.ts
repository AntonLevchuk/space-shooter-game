import Hero from "../Entities/Hero";
import GameCfg from '../Configs/GameCfg.json';
import AsteroidInterface from "../Interfaces/EnemyInterfaces";
import KamikazeInterface from "../Interfaces/EnemyInterfaces";
import BossInterface from "../Interfaces/EnemyInterfaces";
export default class GameStorage {
    public static missionIndex: number = 0;
    public static starsErned: number = 3;
    public static isTakenDamage: boolean = false;

    public static asteroidEnemyTypeName: string = "Asteroid";
    public static kamikazeEnemyTypeName: string = "Kamikaze";
    public static bossEnemyTypeName: string = "Boss";

    public static shieldBoosterType: string = "ShieldBooster";

    public static hero: Hero | null = null;

    public static resetGameValues(): void {
        GameStorage.starsErned = 3;
        GameStorage.isTakenDamage = false;
    }

    public static get missionConfig(): any {
        return GameCfg.missions[GameStorage.missionIndex];
    }

    public static getEnemyConfig(enemyType: string): AsteroidInterface | KamikazeInterface | BossInterface {
        const missionConfig = GameStorage.missionConfig;
        return missionConfig.enemiesConfigs[
            enemyType as keyof typeof missionConfig.enemiesConfigs
        ];
    }
}

