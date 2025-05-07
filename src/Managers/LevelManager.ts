import { TimerManager, Timer } from 'eventemitter3-timer';
import { Text } from 'pixi.js';
import MissionCfg from '../Configs/MissionsCfg.json';
import GameStateManager, { GameState } from '../Managers/GameStateManager';
import ScreenUtil from '../Utils/ScreenUtil';
import ResizeManager from './ResizeManager';

export default class LevelManager {
    private missionIndex: number;
    private missionDuration: number;
    private isMissionActive: boolean = false;
    private timerText: Text;
    private countdown: number;
    private timerManager: TimerManager;
    public timer: Timer;
    private resizeManager: ResizeManager;
    private _resizeCallback: () => void;
    private isDestroyed: boolean = false;

    constructor(missionIndex: number) {
        this.missionIndex = missionIndex;

        const mission = MissionCfg.missions[this.missionIndex];
        if (!mission) {
            throw new Error(`Mission with index ${this.missionIndex} not found`);
        }

        this.missionDuration = mission.missionDuration || 30; // 30 seconds by default
        this.countdown = this.missionDuration;

        this.timerText = new Text(this.formatTime(this.countdown), {
            fontSize: 24,
            fill: 0xffffff,
        });
        this.onResize();

        this.timerManager = new TimerManager();
        this.timer = this.timerManager.createTimer(1000); 
        this.timer.repeat = this.countdown;

        this.timer.on('repeat', () => {
            this.countdown--;
            this.timerText.text = this.formatTime(this.countdown);
        });

        this.timer.on('end', () => {
            this.countdown = 1;
            this.timerText.text = 'Round End';
            this.endLevel();
        });

        this.resizeManager = ResizeManager.getInstance();
        this._resizeCallback = () => this.onResize();
        this.resizeManager.onResize(this._resizeCallback);
    }

    public startLevel(): void {
        this.countdown = this.missionDuration;
        this.isMissionActive = true;
        this.timer.reset();
        this.timer.start();
    }

    private endLevel(): void {
        this.isMissionActive = false;
        this.timer.stop();
        GameStateManager.getInstance().changeState(GameState.LevelComplete);
    }

    private formatTime(timeInSeconds: number): string {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    public getTimerText(): Text {
        return this.timerText;
    }

    private onResize(): void {
        this.timerText.position.set(ScreenUtil.width / 2 - this.timerText.width / 2, 10);
    }

    public update = (deltaMS: number): void => {
        if (!this.isDestroyed) {
            this.timerManager?.update(deltaMS);
        }
    }

    public destroy(): void {
        this.timerManager.removeTimer(this.timer);
        this.resizeManager.offResize(this._resizeCallback);
        this.isDestroyed = true;
    }
}
