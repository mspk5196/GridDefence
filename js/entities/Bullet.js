export class Bullet {
    constructor(x, y, target, damage, tower) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.tower = tower;
        this.speed = 8;
        this.dead = false;
    }

    update() {
        if (!this.target || this.target.health <= 0) {
            this.dead = true;
            return;
        }
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 10) {
            this.target.health -= this.damage;
            if (this.target.health <= 0 && this.tower) {
                this.tower.kills++;
            }
            this.dead = true;
        } else {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
    }
}