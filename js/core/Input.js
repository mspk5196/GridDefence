export class InputHandler {
    constructor(game) {
        this.game = game;
        this.mouse = { x:0, y:0, gridX: 0, gridY: 0};

        window.addEventListener('mousemove', (e) => {
            const rect = this.game.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;

            this.mouse.gridX = Math.floor(this.mouse.x / this.game.cellSize);
            this.mouse.gridY = Math.floor(this.mouse.y / this.game.cellSize);
        })

        window.addEventListener('mousedown', () => {
            this.handlePlacement();
        });
    }

    handlePlacement() {
        const { gridX, gridY } = this.mouse;
        const grid = this.game.grid;
        
        if(grid >= 0  && gridX < grid.cols && gridY >=0 && gridY<grid.rows){
            if(grid.tiles[gridY][gridX] === 0){
                console.log(`Order up! Tower at ${gridX}, ${gridY}`);
                grid.tiles[gridY][gridX] = 2;
            }
            else{
                console.warn("Can't cook there, boss! That's the road!");
            }
        }
    }
}