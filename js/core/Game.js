import { grid } from '../systems/Grid.js';
import { Renderer } from '../systems/Renderer.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.cellSize =64;
        this.canvas.width = 12*this.cellSize;
        this.canvas.height = 8*this.cellSize;

        this.state = new State();
        this.grid = new grid(this.canvas.width, this.canvas.height, this.cellSize)
        this.renderer = new Renderer(this.ctx);

        this.lastTime = 0;
    }

    start() {
        this.gameLoop(0);
    }

    gameLoop(timeStamp){
        const deltaTime = timeStamp - this.lastTime
        this.lastTime = timeStamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(dt) {

    }

    draw() {
        this.renderer.clear();
        this.grid.draw(this.ctx);
    }
}