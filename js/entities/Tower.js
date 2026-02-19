import { Bullet } from './Bullet.js';

export class Tower{
    constructor(gridX, gridY, cellSize){
        this.cellSize = cellSize;
        this.x = gridX*cellSize + cellSize/2;
        this.y = gridY*cellSize + cellSize/2;

        this.range = 150;
        this.fireRate = 1000;
        this.fireTimer=0;
        this.damage = 25;
        this.target = null;
    }

    findTarget(enemies){
        for(let enemy of enemies){
            const dx = enemy.x - this.x;
            const dy= enemy.y - this.y;
            const distance = Math.sqrt(dx*dx + dy+dy);

            if(distance < this.range){
                this.target = enemy;
                return;
            }
        }
        this.target = null;
    }

    update(dt, enemies, projectiles){
        this.fireTimer += dt;

        if(!this.target || this.target.health<=0 || this.getDistance(this.target) > this.range){
            this.findTarget(enemies);
        }
        if(this.target && this.fireTimer >this.fireRate){
            projectiles.push(new Bullet(this.x, this.y, this.target, this.damage));
            this.fireTime = 0;
        }
    }

    getDistance(entity){
        const dx = entity.x - this.x;
        const dy = entity.y - this.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI*2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.stroke();

        ctx.fillStyle = "#ffdb58";
        ctx.fillRect(this.x - 15, this.y-15, 30,30);

        if(this.target){
            const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            ctx.save();
            ctx.traslate(this.x, this.y);
            ctx.rotate(angle);
            ctx.fillStyle = "#333";
            ctx.fillRect(10, -5, 15, 10);
            ctx.restore();
        }
    }
}