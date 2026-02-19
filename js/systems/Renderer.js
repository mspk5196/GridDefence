export class Renderer {
    constructor(ctx, cellSize) {
        this.ctx = ctx;
        this.cellSize = cellSize;
        this.towerRange = 160;
    }

    draw(grid, enemies, towers, bullets, particles, mouse, selected, showRangePreview) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        for (let y = 0; y < grid.rows; y++) {
            for (let x = 0; x < grid.cols; x++) {
                if (grid.tiles[y][x] === 1) {
                    this.ctx.fillStyle = "#151515";
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                }
                this.ctx.strokeStyle = "rgba(255,255,255,0.03)";
                this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }

        if (showRangePreview && grid.isPlacementValid(mouse.gx, mouse.gy)) {
            const centerX = mouse.gx * this.cellSize + this.cellSize / 2;
            const centerY = mouse.gy * this.cellSize + this.cellSize / 2;
            
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, this.towerRange, 0, Math.PI * 2);
            this.ctx.fillStyle = "rgba(255, 219, 88, 0.08)";
            this.ctx.fill();
            this.ctx.strokeStyle = "rgba(255, 219, 88, 0.3)";
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            this.ctx.fillStyle = "rgba(255, 219, 88, 0.3)";
            this.ctx.fillRect(mouse.gx * this.cellSize, mouse.gy * this.cellSize, this.cellSize, this.cellSize);
            
            this.ctx.strokeStyle = "rgba(255, 219, 88, 0.8)";
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(mouse.gx * this.cellSize, mouse.gy * this.cellSize, this.cellSize, this.cellSize);
        }

        particles.forEach(p => {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        this.ctx.globalAlpha = 1.0;

        enemies.forEach(e => {
            this.ctx.fillStyle = e.color;
            this.ctx.beginPath();
            this.ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            const hpBarWidth = 30;
            const hpBarHeight = 5;
            this.ctx.fillStyle = "rgba(0,0,0,0.6)";
            this.ctx.fillRect(e.x - hpBarWidth/2, e.y - e.radius - 12, hpBarWidth, hpBarHeight);
            this.ctx.fillStyle = "#e74c3c";
            this.ctx.fillRect(e.x - hpBarWidth/2, e.y - e.radius - 12, hpBarWidth, hpBarHeight);
            this.ctx.fillStyle = "#2ecc71";
            this.ctx.fillRect(e.x - hpBarWidth/2, e.y - e.radius - 12, hpBarWidth * (e.health / e.maxHealth), hpBarHeight);
        });

        towers.forEach(t => {
            if (t === selected) {
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
                this.ctx.fillStyle = "rgba(255, 219, 88, 0.1)";
                this.ctx.fill();
                this.ctx.strokeStyle = "rgba(255, 219, 88, 0.4)";
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
            
            this.ctx.fillStyle = (t === selected) ? "#fff" : "#ffdb58";
            this.ctx.fillRect(t.x - 20, t.y - 20, 40, 40);
            
            this.ctx.strokeStyle = (t === selected) ? "#fff" : "#000";
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(t.x - 20, t.y - 20, 40, 40);
            
            this.ctx.fillStyle = "#000";
            this.ctx.font = "bold 14px 'Courier New'";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText("L" + t.level, t.x, t.y);
        });

        bullets.forEach(b => {
            this.ctx.fillStyle = "#ffdb58";
            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = "#fff";
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }
}