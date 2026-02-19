import { grid } from '../systems/Grid.js';
import { Renderer } from '../systems/Renderer.js';
import { InputHandler } from './Input.js';

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

        this.input = new InputHandler(this);
        this.enemies = [];
        this.towers = [];

        this.spawnTimer = 0;
        this.spawnInterval = 1500;
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
        if(this.state.isGameOver) return;

        this.state.updateUI();

        this.spawnTimer += dt;

        if(this.spawnTimer > this.spawnInterval){
            this.enemies.push(new Enemy(this.grid.waypoints, this.cellSize));
            this.spawnTimer =0;
        }

        for(let i=this.enemies.length-1;i>=0;i--){
            const enemy = this.enemies[i];
            enemy.update();

            if(enemy.reachedEnd){
                this.state.reducedHealth(1);
                this.enemies.splice(i, 1);
            }
            if(enemy.isDead){
                this.state.addGold(10);
                this.enemies.splice(i,1);
            }
        }
    }

    draw() {
        this.renderer.clear();
        // this.grid.draw(this.ctx);

        this.renderer.drawGrid(this.grid, this.input.mouse);

        this.enemies.forEach(enemy => enemy.draw(this.ctx));
    }
}