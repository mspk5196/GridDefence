import { State } from './State.js';
import { Grid } from '../systems/Grid.js';
import { Renderer } from '../systems/Renderer.js';
import { Enemy } from '../entities/Enemy.js';
import { Tower } from '../entities/Tower.js';
import { Particle } from '../systems/Particles.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 64;
        this.canvas.width = 12 * this.cellSize;
        this.canvas.height = 8 * this.cellSize;
        this.reset();
        this.renderer = new Renderer(this.ctx, this.cellSize);
        this.initInput();
        this.gameSpeed = 1;
    }

    reset() {
        this.state = new State();
        this.grid = new Grid(this.canvas.width, this.canvas.height, this.cellSize);
        this.enemies = [];
        this.towers = [];
        this.bullets = [];
        this.particles = [];
        this.mouse = { gx: 0, gy: 0, x: 0, y: 0 };
        this.selected = null;
        this.spawnTimer = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.enemiesKilled = 0;
        this.gameSpeed = 1;
        this.showRangePreview = true;
    }

    start() {
        this.isPlaying = true;
        document.getElementById('menu-overlay').classList.add('hidden');
        document.getElementById('ui-layer').classList.remove('hidden');
        this.loop();
    }

    restart() {
        this.reset();
        this.start();
        document.getElementById('gameover-overlay').classList.add('hidden');
        document.getElementById('pause-overlay').classList.add('hidden');
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseOverlay = document.getElementById('pause-overlay');
        if (this.isPaused) {
            pauseOverlay.classList.remove('hidden');
        } else {
            pauseOverlay.classList.add('hidden');
        }
        document.getElementById('pause-btn').innerHTML = this.isPaused ? '▶ RESUME' : '⏸ PAUSE';
    }

    setSpeed(speed) {
        this.gameSpeed = speed;
        document.querySelectorAll('.speed-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`speed-${speed}x`).classList.add('active');
    }

    initInput() {
        this.canvas.onmousemove = (e) => {
            const r = this.canvas.getBoundingClientRect();
            const mx = e.clientX - r.left;
            const my = e.clientY - r.top;
            this.mouse.gx = Math.floor(mx / this.cellSize);
            this.mouse.gy = Math.floor(my / this.cellSize);
            this.mouse.x = mx;
            this.mouse.y = my;
        };
        
        this.canvas.onmousedown = () => {
            if (!this.isPlaying || this.isPaused) return;
            const t = this.towers.find(t => t.gx === this.mouse.gx && t.gy === this.mouse.gy);
            if (t) {
                this.selected = t;
            } else if (this.grid.isPlacementValid(this.mouse.gx, this.mouse.gy) && this.state.gold >= 50) {
                this.state.addGold(-50);
                this.towers.push(new Tower(this.mouse.gx, this.mouse.gy, this.cellSize));
                this.grid.tiles[this.mouse.gy][this.mouse.gx] = 2;
                this.selected = null;
            } else {
                this.selected = null;
            }
            this.updateUI();
        };

        document.getElementById('upgrade-btn').onclick = () => {
            if (this.selected && this.state.gold >= this.selected.upgradeCost) {
                this.state.addGold(-this.selected.upgradeCost);
                this.selected.upgrade();
                this.updateUI();
            }
        };

        document.getElementById('sell-btn').onclick = () => {
            if (this.selected) {
                this.state.addGold(this.selected.sellValue);
                this.grid.tiles[this.selected.gy][this.selected.gx] = 0;
                this.towers = this.towers.filter(t => t !== this.selected);
                this.selected = null;
                this.updateUI();
            }
        };
        
        document.getElementById('close-panel').onclick = () => {
            this.selected = null;
            this.updateUI();
        };
    }

    updateUI() {
        const p = document.getElementById('tower-panel');
        if (this.selected) {
            p.classList.remove('hidden');
            document.getElementById('t-level').innerText = this.selected.level;
            document.getElementById('t-range').innerText = Math.floor(this.selected.range);
            document.getElementById('t-damage').innerText = Math.floor(this.selected.damage);
            document.getElementById('up-cost').innerText = this.selected.upgradeCost;
            document.getElementById('sell-val').innerText = this.selected.sellValue;
        } else {
            p.classList.add('hidden');
        }
        this.state.updateUI();
    }

    loop(t = 0) {
        if (!this.isPlaying) return;
        const dt = t - (this.lastTime || t);
        this.lastTime = t;
        if (!this.isPaused) this.update(dt * this.gameSpeed);
        this.renderer.draw(this.grid, this.enemies, this.towers, this.bullets, this.particles, this.mouse, this.selected, this.showRangePreview);
        requestAnimationFrame(v => this.loop(v));
    }

    update(dt) {
        if (this.state.health <= 0) {
            this.isPlaying = false;
            document.getElementById('gameover-overlay').classList.remove('hidden');
            document.getElementById('final-wave').innerText = this.state.wave;
            return;
        }

        this.spawnTimer += dt;
        if (this.spawnTimer > 1500) {
            const types = ['burger', 'soda', 'steak'];
            const type = types[Math.floor(Math.random() * (this.state.wave > 3 ? 3 : 2))];
            this.enemies.push(new Enemy(this.grid.waypoints, this.cellSize, this.state.wave, type));
            this.spawnTimer = 0;
        }

        this.enemies.forEach((e, i) => {
            const res = e.update();
            if (res === 'exit') {
                this.enemies.splice(i, 1);
                this.state.reduceHealth(1);
            } else if (e.health <= 0) {
                this.state.addGold(e.goldValue);
                for (let k = 0; k < 8; k++) {
                    this.particles.push(new Particle(e.x, e.y, e.color));
                }
                this.enemies.splice(i, 1);
                this.enemiesKilled++;
                if (this.enemiesKilled % 10 === 0) this.state.wave++;
            }
        });

        this.towers.forEach(t => t.update(dt, this.enemies, this.bullets));
        this.bullets.forEach((b, i) => {
            b.update();
            if (b.dead) {
                for (let k = 0; k < 3; k++) {
                    this.particles.push(new Particle(b.x, b.y, "#ffdb58"));
                }
                this.bullets.splice(i, 1);
            }
        });
        this.particles.forEach((p, i) => {
            p.update();
            if (p.life <= 0) this.particles.splice(i, 1);
        });
        this.state.updateUI();
    }
}