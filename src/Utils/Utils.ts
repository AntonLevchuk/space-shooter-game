import { Container, Sprite } from 'pixi.js';
import ScreenUtil from './ScreenUtil';

export default class Utils {
    public static missionIndex: number = 0;

    public static repositionAccordingToResize(sprite: Sprite): void {
        sprite.x = ScreenUtil.width / 2;
        sprite.y = ScreenUtil.height - sprite.height;
    }

    public static checkAABBCollision(entity: Container, area: Container): boolean {
        // Checking the AABB collision between two entities
        if (
            entity.x < area.x + area.width &&
            entity.x + entity.width > area.x &&
            entity.y < area.y + area.height &&
            entity.y + entity.height > area.y
        ) {
            return true;
        }
        return false;
    }

    public static isOutOfScreen(entity: Sprite, checkBottomBorder: boolean): boolean {
        if (checkBottomBorder) {
            return entity.y > ScreenUtil.height + entity.height;
        } else {
            return entity.y < -entity.height;
        }
    }
}