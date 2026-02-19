export class Enemy {
    constructor(waypoints, cellSize) {
        this.wayponts = waypoints;
        this.cellSize = cellSize;

        this.x = waypoints[0].x * cellSize + cellSize /2;
        this.y = waypoints[0].y * cellSize + cellSize /2;

        this.targetIndex = 1;
        this.speed = 1.5;
        this.heaalth = 100;
        this.maxHealth = 100;
        thiss.radius = 15;
        this.isDead = false;
        this.reachedEnd = false;
    }

    update() {
        if(this.targetIndex >= this.waypoints.length){
            this.reachedEnd = true;
            return;
        }

        const target = this.waypoints[this.targetIndex];
        const targetX = target.x * this.cellSize + this.cellSize/2;
        const targetY = target.y * this.cellSize + this.cellSize/2;

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < this.speed){
            this.x = targetX;
            this.y = targetY;
            this.targetIndex++;
        }
        else{
            this.x += (dx/distance) * this.speed;
            this.y += (dy/distance) * this.speed;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginpath();
        ctx.arc(this.x, this.y+5, this.radius, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = "#8b4513";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();

        const barWidth=30;
        const healthPercent = this.health/this.maxHealth;
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - barWidth/2, this.y-25, barWidth, 4);
        ctx.fillStyle = "lime";
        ctx.fillRect(this.x - barWidth/2, this.y-25, barWidth*healthPercent, 4);
    }
}