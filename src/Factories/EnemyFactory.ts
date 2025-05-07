import Kamikaze from '../Entities/Enemies/Kamikaze';
import Asteroid from '../Entities/Enemies/Asteroid';
import { Sprite, Texture } from 'pixi.js';
import GameStorage from '../Utils/GameStorage';
import BaseEnemyClass from '../Entities/Enemies/BaseEnemyClass';
import Boss from '../Entities/Enemies/Boss';

export default class EnemyFactory {
    public createEnemy(type: string, texture: Texture): BaseEnemyClass {
        switch (type) {
            case GameStorage.kamikazeEnemyTypeName:
                return new Kamikaze(texture);
            case GameStorage.asteroidEnemyTypeName:
                return new Asteroid(texture);
            case GameStorage.bossEnemyTypeName:
                const boss = Boss.getInstance(texture);
                return boss;
            default:
                throw new Error('Unknown enemy type');
        }
    }
}
