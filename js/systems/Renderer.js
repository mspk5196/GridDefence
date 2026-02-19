export class Renderer{
    constructor(ctx, cellSize){
        this.ctx = ctx;
        this.cellSize = cellSize;
    }

    clear() {
        this.ctx.clearRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawGrid(grid, mouse){
        for(let y=0;y<grid.rows;y++){
            for(let x=0;x<grid.cols;x++){
                const posX = x*this.cellSize;
                const posY = y*this.cellSize;

                this.ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
                this.ctx.strokeRect(posX,posY, this.cellSize, this.cellSize);

                if(grid.tiles[y][x] === 1){
                    this.ctx.fillStyle = "#1a1a1a";
                    this.ctx.fillRect(posX, posY, this.cellSize, this.cellSize);

                    this.ctx.fillStyle = "rgba(255, 219, 88, 0.1)";
                    this.ctx.fillRect(posX + this.cellSize/2 -2, posY, 4, this.cellSize);
                }
            }
        }
        if(mouse.gridX >=0 && mouse.gridX < grid.cols && mouse.gridY >=0 && mouse.gridY < grid.rows){
            const isValid = grid.tiles[mouse.gridY][mouse.gridX] === 0;
            this.ctx.fillStyle = isValid ? "rgba(46, 139, 87, 0.3)" : "rgba(153, 0, 0, 0.3)";
            this.ctx.fillRect(mouse.gridX * this.cellSize, mouse.gridY * this.cellSize, this.cellSize, this.cellSize);
        }
    }
}