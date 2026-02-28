export class Enemy {
    constructor(waypoints, cellSize, wave, type = 'burger', difficultyMult = 1) {
        this.waypoints = waypoints;
        this.cellSize = cellSize;
        this.waypointIndex = 0;
        this.x = waypoints[0].x * cellSize + cellSize / 2;
        this.y = waypoints[0].y * cellSize + cellSize / 2;
        this.type = type;
        
        const configs = {
            'burger': { hp: 50, speed: 1.5, radius: 12, color: '#d2691e', gold: 15 },
            'soda': { hp: 30, speed: 2.5, radius: 10, color: '#ff6b6b', gold: 10 },
            'steak': { hp: 120, speed: 0.8, radius: 16, color: '#8b4513', gold: 25 }
        };
        
        const config = configs[type];
        this.maxHealth = config.hp * (1 + wave * 0.15) * difficultyMult;
        this.health = this.maxHealth;
        this.speed = config.speed;
        this.radius = config.radius;
        this.color = config.color;
        this.goldValue = Math.floor(config.gold * (1 + wave * 0.1));
    }

    update() {
        if (this.waypointIndex >= this.waypoints.length) {
            return 'exit';
        }
        const target = this.waypoints[this.waypointIndex];
        const tx = target.x * this.cellSize + this.cellSize / 2;
        const ty = target.y * this.cellSize + this.cellSize / 2;
        const dx = tx - this.x;
        const dy = ty - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < this.speed) {
            this.waypointIndex++;
        } else {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        return 'moving';
    }
}