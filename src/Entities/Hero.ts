import { Container, Sprite, Texture, Ticker } from 'pixi.js';
import HeroCfg from '../Configs/HeroCfg.json';
import ScreenUtil from '../Utils/ScreenUtil';
import Bullet from './Bullet';
import Utils from '../Utils/Utils';
import GameStateManager, { GameState } from '../Managers/GameStateManager';
import GameStorage from '../Utils/GameStorage';
import BaseEnemyClass from './Enemies/BaseEnemyClass';

export default class Hero extends Container {
    public sprite: Sprite;
    private horizontalSpeed: number = HeroCfg.HorizontalSpeed;
    private verticalSpeed: number = HeroCfg.VerticalSpeed;
    private keys: { [key: string]: boolean };
    private isShooting: boolean = false;
    private shootingInterval: number = HeroCfg.ShootingInterval;
    private lastShotTime: number = 0;
    private bullets: Bullet[] = [];
    private heroHealth: number;

    constructor(texture: string) {
        super();
        this.sprite = Sprite.from(texture);
        this.addChild(this.sprite);

        this.sprite.anchor.set(HeroCfg.Anchor);
        this.sprite.scale.set(HeroCfg.Scale);

        this.keys = {
            'KeyA': false, // Left
            'KeyD': false, // Right
            'KeyW': false, // Up
            'KeyS': false, // Down
            'Space': false, // Shoot
        };

        this.heroHealth = HeroCfg.Health;

        Utils.repositionAccordingToResize(this.sprite);

        this.setupInput();
    }

    public update(enemies: BaseEnemyClass[]): void {
        if (!GameStateManager.getInstance().isPlaying()) return;
        this.moveHero();
        this.rotateHero();
        this.updateShooting();
        this.updateBullets(enemies);
        this.checkHeroHealth(enemies);
    }

    private setupInput(): void {
        window.addEventListener('keydown', this.keysDown.bind(this));
        window.addEventListener('keyup', this.keysUp.bind(this));
    }

    private keysDown(event: KeyboardEvent): void {
        if (event.code in this.keys) {
            this.keys[event.code] = true;
            if (event.code === 'Space') this.startShooting();
        }
    }

    private keysUp(event: KeyboardEvent): void {
        if (event.code in this.keys) {
            this.keys[event.code] = false;
            if (event.code === 'Space') this.stopShooting();
        }
    }

    private moveHero(): void {
        if (this.keys['KeyA'] && this.sprite.x >= this.sprite.width / 2) {
            this.moveLeft();
        }
    
        if (this.keys['KeyD'] && this.sprite.x <= ScreenUtil.width - this.sprite.width / 2) {
            this.moveRight();
        }

        if (this.keys['KeyW'] && this.sprite.y >= this.sprite.height / 2) {
            this.moveUp();
        }

        if (this.keys['KeyS'] && this.sprite.y <= ScreenUtil.height - this.sprite.height / 2) {
            this.moveDown();
        }
    }

    private rotateHero(): void {
        if (this.keys['KeyA']) {
            this.sprite.rotation = -HeroCfg.RotationAngle;
        } else if (this.keys['KeyD']) {
            this.sprite.rotation = HeroCfg.RotationAngle;
        } else {
            this.sprite.rotation = 0;
        }
    }

    private updateShooting(): void {
        const now = Date.now();
        if (this.isShooting && now - this.lastShotTime >= this.shootingInterval) {
            this.shoot();
            this.lastShotTime = now;

        }
    }

    private shoot(): void {
        const bullet = new Bullet(Texture.from(HeroCfg.BulletTextureName), this.sprite.x, this.sprite.y - this.sprite.height / 2);
        this.parent.addChild(bullet);
        this.bullets.push(bullet);
    }

    private updateBullets(enemies: BaseEnemyClass[]): void {
        for (let i: number = this.bullets.length - 1; i >= 0; i--) {
            const bullet: Bullet = this.bullets[i];
            bullet.update();
    
            if (Utils.isOutOfScreen(bullet, false)) {
                bullet.destroy();
                this.bullets.splice(i, 1);
                break;
            }

            for (let j: number = 0; j < enemies.length; j++) {
                const enemy: BaseEnemyClass = enemies[j];
                if (Utils.checkAABBCollision(bullet, enemy)) {
                    bullet.destroy();
                    this.bullets.splice(i, 1);

                    enemy.destroy();
                    enemies.splice(j, 1);
                    break;
                }
            }
        }
    }

    private checkHeroHealth(enemies: BaseEnemyClass[]): void {
        for (let i: number = 0; i < enemies.length; i++) {
            const enemy: BaseEnemyClass = enemies[i];
            if (Utils.checkAABBCollision(this.sprite, enemy)) {
                if (!GameStorage.isTakenDamage) {
                    GameStorage.isTakenDamage = true;
                    GameStorage.starsErned--;
                }
                const enemyConfig = GameStorage.getEnemyConfig(enemy.enemyType);
                this.heroHealth -= enemyConfig.damage;
                if (this.heroHealth <= 0) {
                    GameStorage.starsErned = 0;
                    GameStateManager.getInstance().changeState(GameState.GameOver);
                }
                enemy.destroy();
                enemies.splice(i, 1);
                break;
            }

        }
    }
    

    private moveLeft(): void {
        this.sprite.x -= this.horizontalSpeed;
    }

    private moveRight(): void {
        this.sprite.x += this.horizontalSpeed;
    }

    private moveUp(): void {
        this.sprite.y -= this.verticalSpeed;
    }

    private moveDown(): void {
        this.sprite.y += this.verticalSpeed;
    }

    public startShooting(): void {
        this.isShooting = true;
    }
    
    public stopShooting(): void {
        this.isShooting = false;
    }

    public destroy(): void {
        Ticker.shared.remove(() => this.update([]), this);
        window.removeEventListener('keydown', this.keysDown.bind(this));
        window.removeEventListener('keyup', this.keysUp.bind(this));
        super.destroy();
    }
}