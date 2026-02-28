import { Bullet } from './Bullet.js';

export class Tower {
    constructor(gx, gy, cellSize) {
        this.gx = gx;
        this.gy = gy;
        this.x = gx * cellSize + cellSize / 2;
        this.y = gy * cellSize + cellSize / 2;
        this.level = 1;
        this.damage = 30;
        this.range = 160;
        this.cooldown = 1000;
        this.cooldownTimer = 0;
        this.upgradeCost = 75;
        this.sellValue = 25;
        this.kills = 0;
    }

    upgrade() {
        this.level++;
        this.damage *= 1.5;
        this.range += 20;
        this.cooldown *= 0.85;
        this.upgradeCost = Math.floor(this.upgradeCost * 1.5);
        this.sellValue = Math.floor(this.sellValue * 1.8);
    }

    update(dt, enemies, bullets, stats) {
        this.cooldownTimer -= dt;
        if (this.cooldownTimer <= 0) {
            const target = enemies.find(e => {
                const dist = Math.hypot(e.x - this.x, e.y - this.y);
                return dist <= this.range && e.health > 0;
            });
            if (target) {
                bullets.push(new Bullet(this.x, this.y, target, this.damage, this));
                this.cooldownTimer = this.cooldown;
                if (stats) stats.bulletsShot++;
            }
        }
    }
}