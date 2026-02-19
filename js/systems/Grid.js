export class Grid{
    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.rows = height/cellSize;
        this.cols=width/cellSize;

        this.tiles = [];

        this.waypoints = [
            {x: -1, y: 2},
            {x:4, y:2},
            {x:4, y:5},
            {x:9, y:5},
            {x:9, y:1},
            {x:12, y:1}
        ]
        this.init();
    }
    init() {
        for(let y=0;y<this.rows; y++){
            this.tiles[y] = [];
            for(let x=0;x<this.cols; x++){
                this.tiles[y][x] = 0;
            }
        }
        this.burnPath();
    }

    burnPath() {
        for(let i=0;i<this.waypoints.length-1;i++){
            const start = this.waypoints[i];
            const end = this.waypoints[i+1];

            const startX = Math.max(0, Math.min(this.cols - 1, start.x));
            const endX = Math.max(0, Math.min(this.cols -1, end.x));
            const startY =  Math.max(0, Math.min(this.rows-1, start.y));
            const endY = Math.max(0, Math.min(this.rows-1, end.y));

            for(let y=Math.min(startY, endY); y<=Math.max(startY, endY); y++){
                for(let x=Math.min(startX, endX); x<=Math.max(startX, endX); x++){
                    this.tiles[y][x] = 1;
                }
            }
        }
    }

    draw(ctx) {
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        for(let y=0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                ctx.strokeRect(x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize);

                if(this.tiles[y][x] === 1){
                    ctx.fillStyle = "#222";
                    ctx.fillRect(x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }
    }
}