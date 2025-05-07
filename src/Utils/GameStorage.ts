export default class GameStorage {
    public static missionIndex: number = 0;
    public static starsErned: number = 3;
    public static isTakenDamage: boolean = false;

    public static resetGameValues(): void {
        GameStorage.starsErned = 3;
        GameStorage.isTakenDamage = false;
    }
}

