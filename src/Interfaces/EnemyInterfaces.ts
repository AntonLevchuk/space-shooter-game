interface BaseEnemyInterface {
    SpawnInterval: number,
    MinScale: number,
    MaxScale: number,
    MinSpeed: number, 
    MaxSpeed: number,
    damage: number
}

export default interface AsteroidInterface extends BaseEnemyInterface {
}

export default interface KamikazeInterface extends BaseEnemyInterface {
}