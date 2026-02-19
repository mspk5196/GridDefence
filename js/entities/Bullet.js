export class Bullet {
    constructor(x, y, target, damage){
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this. speed = 5;
        this.radius = 4;
        this.isDead = false;
    }

    update() {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy*dy);

        if(distance < this.speed){
            this.target.health -= this.damage;
            this.isDead = true;
        }
        else{
            this.x += (dx/distance)*this.speed;
            this.y += (dy/distance)*this.speed;
        }

        if(this.target.health<=0){
            this.isDead = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "#ffdb58";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
    }
}