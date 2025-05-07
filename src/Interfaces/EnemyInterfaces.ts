interface BaseEnemyInterface {
    SpawnInterval: number,
    MinScale: number,
    MaxScale: number,
    MinSpeed: number, 
    MaxSpeed: number,
    damage: number,
    ChangeFireModeInterval?: number
}

export default interface AsteroidInterface extends BaseEnemyInterface {
}

export default interface KamikazeInterface extends BaseEnemyInterface {
}

export default interface BossInterface {
    HorizontalSpeed: number,
    ShootingInterval: number,
    ChangeFireMode: number,
    Anchor: number,
    Scale: number,
    RotationAngle: number,
    BulletScale: number,
    Health: number,
    damage: number,
}