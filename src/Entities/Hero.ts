import { Container, Graphics, Sprite, Text, TextStyle, Texture, Ticker } from 'pixi.js';
import HeroCfg from '../Configs/HeroCfg.json';
import ScreenUtil from '../Utils/ScreenUtil';
import Bullet from './Bullet';
import Utils from '../Utils/Utils';
import GameStateManager, { GameState } from '../Managers/GameStateManager';
import GameStorage from '../Utils/GameStorage';
import BaseEnemyClass from './Enemies/BaseEnemyClass';
import BoostersCfg from '../Configs/BoostersCfg.json';
import { SoundsManager } from '../Managers/SoundsManager';

export default class Hero extends Container {
    private static instance: Hero | null = null;

    public sprite: Sprite;
    private horizontalSpeed: number = HeroCfg.HorizontalSpeed;
    private verticalSpeed: number = HeroCfg.VerticalSpeed;
    private keys: { [key: string]: boolean };
    private isShooting: boolean = false;
    private shootingInterval: number = HeroCfg.ShootingInterval;
    private lastShotTime: number = 0;
    private bullets: Bullet[] = [];
    public healthPoints: number;
    private heroDamage: number = HeroCfg.Damage;
    public cleanHealthPoints: number;
    public static isBoosterActive: boolean = false;
    private boosterTimeoutId: number | null = null;
    private healthBar: Graphics;
    private maxHealth: number = HeroCfg.Health;

    private constructor(texture: string) {
        super();
        this.sprite = Sprite.from(texture);
        this.addChild(this.sprite);

        this.sprite.anchor.set(HeroCfg.Anchor);
        this.sprite.scale.set(HeroCfg.Scale);

        this.keys = {
            [HeroCfg.Controls.MoveLeft]: false, // Left
            [HeroCfg.Controls.MoveRight]: false, // Right
            [HeroCfg.Controls.MoveUp]: false, // Up
            [HeroCfg.Controls.MoveDown]: false, // Down
            [HeroCfg.Controls.Shoot]: false, // Shoot
        };

        this.healthPoints = HeroCfg.Health;

        Utils.repositionAccordingToResize(this.sprite);
        this.setupInput();

        this.createHealthBar();
        this.updateHealthBar();
    }

    public static getInstance(texture?: string): Hero {
        if (!Hero.instance) {
            Hero.instance = new Hero(texture);
        }
        return Hero.instance;
    }

    public static resetInstance(): void {
        Hero.instance = null;
    }

    public update(enemies: BaseEnemyClass[]): void {
        if (!GameStateManager.getInstance().isPlaying()) return;
        this.moveHero();
        this.rotateHero();
        this.updateShooting();
        this.updateBullets(enemies);
        this.checkHeroHealth(enemies);

        if (this.healthPoints <= this.cleanHealthPoints) {
            this.deactivateBooster();
        }

        this.updateHealthBar();
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
            if (event.code === HeroCfg.Controls.Shoot) this.stopShooting();
        }
    }

    private moveHero(): void {
        if (this.keys[HeroCfg.Controls.MoveLeft] && this.sprite.x >= this.sprite.width / 2) {
            this.moveLeft();
        }
    
        if (this.keys[HeroCfg.Controls.MoveRight] && this.sprite.x <= ScreenUtil.width - this.sprite.width / 2) {
            this.moveRight();
        }

        if (this.keys[HeroCfg.Controls.MoveUp] && this.sprite.y >= this.sprite.height / 2) {
            this.moveUp();
        }

        if (this.keys[HeroCfg.Controls.MoveDown] && this.sprite.y <= ScreenUtil.height - this.sprite.height / 2) {
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
        SoundsManager.getInstance().play('Shoot_sound.mp3');
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

                    if (enemy.enemyType !== GameStorage.bossEnemyTypeName) {
                        enemy.destroy();
                        SoundsManager.getInstance().play('Explosion_sound.mp3');
                        enemies.splice(j, 1);
                    } else {
                        enemy.healthPoints -= this.heroDamage;
                    }
                    break;
                }
            }
        }
    }

    private checkHeroHealth(enemies: BaseEnemyClass[]): void {
        for (let i: number = 0; i < enemies.length; i++) {
            const enemy: BaseEnemyClass = enemies[i];
            if (Utils.checkAABBCollision(this.sprite, enemy)) {
                if (!GameStorage.isTakenDamage && !Hero.isBoosterActive) {
                    GameStorage.isTakenDamage = true;
                    GameStorage.starsErned--;
                }

                const enemyConfig = GameStorage.getEnemyConfig(enemy.enemyType);
                this.healthPoints -= enemyConfig.damage;
                SoundsManager.getInstance().play('Explosion_sound.mp3');

                if (this.healthPoints <= 0) {
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

    private createHealthBar(): void {
        const barHeight = 6;
        const offsetY = -this.sprite.height / 2 - 10;
    
        const titleStyle = new TextStyle({ fontSize: HeroCfg.HealthTextFontSize, fill: HeroCfg.HealthTextColor, fontWeight: 'bold' });
        const healthText = new Text(HeroCfg.HealthText, titleStyle);
        healthText.anchor.set(0.5);
        this.addChild(healthText);
    
        this.healthBar = new Graphics();
        this.healthBar.beginFill(HeroCfg.HealthBarColor);
        this.healthBar.drawRect(-HeroCfg.HealthBarWidth / 2, offsetY, HeroCfg.HealthBarWidth, barHeight);
        this.healthBar.endFill();
        this.addChild(this.healthBar);

        healthText.position.set(healthText.width / 2, HeroCfg.HealthTextOffsetY);
        this.healthBar.position.set(healthText.width + HeroCfg.HealthBarOffsetX, HeroCfg.HealthBarOffsetY);
    }

    private updateHealthBar(): void {
        const healthRatio = Math.max(this.healthPoints / this.maxHealth, 0);
    
        this.healthBar.width = HeroCfg.HealthBarWidth * healthRatio;
    }
    
    

    public addArmor(armorAmount: number): void {
        this.cleanHealthPoints = this.healthPoints;
        this.healthPoints += armorAmount;

        this.activateBooster();
    }

    private activateBooster(): void {
        if (Hero.isBoosterActive) return;

        Hero.isBoosterActive = true;
        SoundsManager.getInstance().play('Activate_shield_sound.mp3');

        this.boosterTimeoutId = window.setTimeout(() => {
            this.deactivateBooster();
        }, BoostersCfg.Boosters[GameStorage.shieldBoosterType as keyof typeof BoostersCfg.Boosters].Duration * 1000);
    }

    public deactivateBooster(): void {
        if (!Hero.isBoosterActive) return;

        Hero.isBoosterActive = false;

        this.boosterTimeoutId && clearTimeout(this.boosterTimeoutId);
        this.boosterTimeoutId = null;
    
        if (this.healthPoints > this.cleanHealthPoints) {
            this.healthPoints = this.cleanHealthPoints;
        }
    }

    public destroy(): void {
        Ticker.shared.remove(() => this.update([]), this);
        window.removeEventListener('keydown', this.keysDown.bind(this));
        window.removeEventListener('keyup', this.keysUp.bind(this));
        Hero.resetInstance();
        super.destroy();
    }
}
