import { Bullet } from './Bullet.js';

export class Tower {
    constructor(gx, gy, cellSize) {
        this.gx = gx; this.gy = gy;
        this.x = gx * cellSize + cellSize / 2;
        this.y = gy * cellSize + cellSize / 2;
        this.level = 1;
        this.range = 160;
        this.damage = 30;
        this.fireRate = 800;
        this.timer = 0;
        this.upgradeCost = 75;
        this.totalSpent = 50;
        this.sellValue = 25;
    }
    update(dt, enemies, bullets) {
        this.timer += dt;
        if (this.timer > this.fireRate) {
            const target = enemies.find(e => Math.hypot(e.x - this.x, e.y - this.y) < this.range);
            if (target) {
                bullets.push(new Bullet(this.x, this.y, target, this.damage));
                this.timer = 0;
            }
        }
    }
    upgrade() {
        this.level++;
        this.totalSpent += this.upgradeCost;
        this.damage *= 1.5;
        this.range += 15;
        this.fireRate *= 0.9;
        this.upgradeCost = Math.floor(this.upgradeCost * 2);
        this.sellValue = Math.floor(this.totalSpent * 0.6);
    }
}