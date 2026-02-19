export class Enemy {
    constructor(waypoints, cellSize, wave, type = 'burger') {
        this.waypoints = waypoints;
        this.cellSize = cellSize;
        this.x = waypoints[0].x * cellSize + cellSize / 2;
        this.y = waypoints[0].y * cellSize + cellSize / 2;
        this.targetIdx = 1;

        const catalog = {
            burger: { hp: 80, speed: 1.3, gold: 15, color: '#8b4513', r: 18 },
            soda: { hp: 40, speed: 2.6, gold: 10, color: '#ff4500', r: 12 },
            steak: { hp: 400, speed: 0.6, gold: 50, color: '#4a2c2a', r: 25 }
        };

        const config = catalog[type];
        this.color = config.color;
        this.radius = config.r;
        this.speed = config.speed + (wave * 0.05);
        this.maxHealth = config.hp * Math.pow(1.2, wave);
        this.health = this.maxHealth;
        this.goldValue = config.gold;
    }

    update() {
        const target = this.waypoints[this.targetIdx];
        const tx = target.x * this.cellSize + this.cellSize / 2;
        const ty = target.y * this.cellSize + this.cellSize / 2;
        const dx = tx - this.x, dy = ty - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.speed) {
            this.targetIdx++;
            return this.targetIdx >= this.waypoints.length ? 'exit' : 'move';
        }
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;
        return 'move';
    }
}