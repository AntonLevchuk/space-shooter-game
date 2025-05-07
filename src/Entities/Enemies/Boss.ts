import { Texture } from 'pixi.js';
import GameStateManager, { GameState } from '../../Managers/GameStateManager';
import Bullet from '../Bullet';
import ScreenUtil from '../../Utils/ScreenUtil';
import BaseEnemyClass from './BaseEnemyClass';
import GameStorage from '../../Utils/GameStorage';
import Utils from '../../Utils/Utils';
import Hero from '../Hero';
import HeroCfg from '../../Configs/HeroCfg.json';

export default class Boss extends BaseEnemyClass {
    private static instance: Boss | null = null;

    private horizontalSpeed: number = 2;
    private direction: number = 1; // 1 -> move to the rigth, -1 -> move to the left
    private shootingInterval: number;
    private lastShotTime = 0;
    private fireMode: number = 0;
    private wavesLeft = 0;
    private bullets: Bullet[] = [];
    public healthPoints: number;
    private damage: number; 

    public enemyType: string = GameStorage.bossEnemyTypeName;

    private constructor(texture: Texture) {
        super(texture);

        const enemyConfig = GameStorage.getEnemyConfig(this.enemyType);
        this.horizontalSpeed = enemyConfig.HorizontalSpeed;
        this.shootingInterval = enemyConfig.ShootingInterval;
        this.healthPoints = enemyConfig.Health;
        this.damage = enemyConfig.damage;

        this.scale.set(enemyConfig.Scale);
        this.anchor.set(enemyConfig.Anchor);
        this.outOfScreenOnBottomBorder = false;

        this.x = this.width + Math.random() * (ScreenUtil.width - this.width * 1.5);
        this.y = this.height;

        setInterval(() => this.changeFireMode(), enemyConfig.ChangeFireModeInterval);
    }

    public static getInstance(texture: Texture): Boss {
        if (!Boss.instance) {
            Boss.instance = new Boss(texture);
        }
        return Boss.instance;
    }

    public static resetInstance(): void {
        Boss.instance = null;
    }

    public update(): void {
        if (!GameStateManager.getInstance().isPlaying()) return;
        this.checkHealthPoints();
        this.move();
        this.attack();
        this.updateBullets();
    }

    public move(): void {
        this.x += this.horizontalSpeed * this.direction;

        const halfWidth = this.width / 2;

        if (this.x < halfWidth || this.x > ScreenUtil.width - halfWidth) {
            this.direction *= -1;
        }
    }

    public attack(): void {
        const now = Date.now();
        if (now - this.lastShotTime < this.shootingInterval) return;

        switch (this.fireMode) {
            case 0:
                this.fireSingle();
                break;
            case 1:
                this.fireTriple();
                break;
            case 2:
                if (this.wavesLeft === 0) this.wavesLeft = 3;
                this.fireTriple();
                this.wavesLeft--;
                if (this.wavesLeft > 0) {
                    this.lastShotTime = now - this.shootingInterval + 300;
                    return;
                }
                break;
        }

        this.lastShotTime = now;
    }

    private fireSingle(): void {
        this.spawnBullet(0, 1);
    }

    private fireTriple(): void {
        this.spawnBullet(-0.5, 1);
        this.spawnBullet(0, 1);
        this.spawnBullet(0.5, 1);
    }

    private spawnBullet(dirX: number, dirY: number): void {
        const bullet = new Bullet(Texture.from('Boss_bullet'), this.x, this.y + this.height / 2, dirX, dirY);
        this.parent?.addChild(bullet);
        this.bullets.push(bullet);
    }

    private updateBullets(): void {
        this.bullets = this.bullets.filter(bullet => {
            bullet.update();

            if (
                Utils.isOutOfScreen(bullet, true) ||
                bullet.x < 0 ||
                bullet.x > ScreenUtil.width + bullet.width
            ) {
                bullet.destroy();
                this.parent?.removeChild(bullet);
                return false;
            }
            const hero = Hero.getInstance(HeroCfg.HerotextureName);
            if (Utils.checkAABBCollision(bullet, hero.sprite)) {
                Hero.getInstance().healthPoints -= this.damage;
                bullet.destroy();
                this.parent?.removeChild(bullet);
                return false;
            }

            return true;
        });
    }

    private changeFireMode(): void {
        this.fireMode = Math.floor(Math.random() * 3);
        this.wavesLeft = 0;
    }

    private checkHealthPoints(): void {
        if (this.healthPoints <= 0) {
            GameStateManager.getInstance().changeState(GameState.LevelComplete);
        }
    }

    public destroy(): void {
        Boss.resetInstance();
        this.bullets.forEach(b => {
            b.destroy();
            this.parent?.removeChild(b);
        });
        this.bullets = [];
        super.destroy();
    }
}
