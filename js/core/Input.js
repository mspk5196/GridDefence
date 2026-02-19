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

        const existingTower = this.game.towers.find(t => 
        Math.floor(t.x / this.game.cellSize) === gridX && 
        Math.floor(t.y / this.game.cellSize) === gridY
    );

    if (existingTower) {
        this.game.selectedEntity = existingTower;
        console.log("Tower Selected! Level:", existingTower.level);
        return; 
    }

    // 2. Otherwise, try to place a NEW tower
    if (grid.isPlacementValid(gridX, gridY)) {
        const cost = 50; 
        if (this.game.state.gold >= cost) {
            this.game.state.addGold(-cost);
            grid.tiles[gridY][gridX] = 2; // Mark as Tower
            this.game.addTower(gridX, gridY);
            this.game.selectedEntity = null;
        } else {
            console.log("Not enough grease in the pan!");
        }
    } else {
        this.game.selectedEntity = null;
    }
    }
}