export class Grid {
    constructor(width, height, cellSize) {
        this.cellSize = cellSize;
        this.rows = height / cellSize;
        this.cols = width / cellSize;
        this.tiles = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
        
        // Complex Waypoints for better pathing
        this.waypoints = [
            {x: -1, y: 3}, {x: 3, y: 3}, {x: 3, y: 1}, 
            {x: 8, y: 1}, {x: 8, y: 6}, {x: 13, y: 6}
        ];
        this.burnPath();
    }
    burnPath() {
        for (let i = 0; i < this.waypoints.length - 1; i++) {
            let s = this.waypoints[i], e = this.waypoints[i+1];
            for (let y = Math.min(s.y, e.y); y <= Math.max(s.y, e.y); y++) {
                for (let x = Math.min(s.x, e.x); x <= Math.max(s.x, e.x); x++) {
                    if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) this.tiles[y][x] = 1;
                }
            }
        }
    }
    isPlacementValid(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows && this.tiles[y][x] === 0;
    }
}