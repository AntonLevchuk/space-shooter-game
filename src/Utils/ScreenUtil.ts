import { Application, Renderer } from 'pixi.js';

export default class ScreenUtil {
    private static app: Application<Renderer>;

    public static init(app: Application<Renderer>): void {
        this.app = app;
    }

    public static get width(): number {
        return this.app ? this.app.screen.width : window.innerWidth;
    }

    public static get height(): number {
        return this.app ? this.app.screen.height : window.innerHeight;
    }
}
