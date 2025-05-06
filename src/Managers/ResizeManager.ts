import { Application, Renderer } from 'pixi.js';

export default class ResizeManager {
    private static instance: ResizeManager;
    private app: Application<Renderer>;
    private resizeCallbacks: Set<() => void> = new Set();

    private constructor(app: Application<Renderer>) {
        this.app = app;

        window.addEventListener('resize', this.resize);
        this.resize();
    }

    public static init(app: Application<Renderer>): void {
        if (!ResizeManager.instance) {
            ResizeManager.instance = new ResizeManager(app);
        }
    }

    public static getInstance(): ResizeManager {
        if (!ResizeManager.instance) {
            throw new Error('ResizeManager is not initialized. Call initialize(app) first.');
        }
        return ResizeManager.instance;
    }

    public onResize(callback: () => void): void {
        this.resizeCallbacks.add(callback);
    }

    public offResize(callback: () => void): void {
        this.resizeCallbacks.delete(callback);
    }

    private resize = (): void => {
        const { innerWidth, innerHeight } = window;

        this.app.renderer.resize(innerWidth, innerHeight);

        const scaleX = innerWidth / this.app.screen.width;
        const scaleY = innerHeight / this.app.screen.height;
        const scale = Math.min(scaleX, scaleY);

        this.app.stage.scale.set(scale);
        this.app.stage.position.set(
            (innerWidth - this.app.screen.width * scale) / 2,
            (innerHeight - this.app.screen.height * scale) / 2
        );

        this.resizeCallbacks.forEach(cb => cb());
    };

    public get width(): number {
        return this.app.screen.width;
    }

    public get height(): number {
        return this.app.screen.height;
    }

    public destroy(): void {
        window.removeEventListener('resize', this.resize);
        this.resizeCallbacks.clear();
    }
}
