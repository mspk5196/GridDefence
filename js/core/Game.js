import { State } from './State.js';
import { Grid } from '../systems/Grid.js';
import { Renderer } from '../systems/Renderer.js';
import { Enemy } from '../entities/Enemy.js';
import { Tower } from '../entities/Tower.js';
import { Particle } from '../systems/Particles.js';
import { Stats } from '../systems/Stats.js';
import { HighScore } from '../systems/HighScore.js';
import { Settings } from '../systems/Settings.js';
import { Tooltip } from '../systems/Tooltip.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 64;
        this.canvas.width = 12 * this.cellSize;
        this.canvas.height = 8 * this.cellSize;
        
        this.stats = new Stats();
        this.highScore = new HighScore();
        this.settings = new Settings();
        this.tooltip = new Tooltip();
        
        this.reset();
        this.renderer = new Renderer(this.ctx, this.cellSize);
        this.initInput();
        this.gameSpeed = 1;
        this.fpsCounter = 0;
        this.fpsTime = 0;
        
        this.applySettings();
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
        this.gameSpeed = 1;
        this.showRangePreview = this.settings.get('showRangePreview');
        this.stats.reset();
    }

    applySettings() {
        this.showRangePreview = this.settings.get('showRangePreview');
        const fpsCounter = document.getElementById('fps-counter');
        if (this.settings.get('showFPS')) {
            fpsCounter.classList.remove('hidden');
        } else {
            fpsCounter.classList.add('hidden');
        }
        const hotkeyDisplay = document.getElementById('hotkey-display');
        if (this.settings.get('showHotkeys')) {
            hotkeyDisplay.classList.remove('hidden');
        } else {
            hotkeyDisplay.classList.add('hidden');
        }
    }

    showHighScores() {
        document.getElementById('menu-overlay').classList.add('hidden');
        document.getElementById('highscores-overlay').classList.remove('hidden');
        
        const scores = this.highScore.getHighScores();
        document.getElementById('hs-wave').innerText = scores.highestWave;
        document.getElementById('hs-kills').innerText = scores.mostKills;
        document.getElementById('hs-accuracy').innerText = scores.mostAccurate;
        document.getElementById('hs-time').innerText = scores.longestTimeFormatted;
        
        const recentList = document.getElementById('recent-games-list');
        recentList.innerHTML = '';
        scores.recentGames.forEach(game => {
            const item = document.createElement('div');
            item.className = 'recent-game-item';
            item.innerHTML = `
                <div>${game.date}</div>
                <div>Wave: ${game.wave} | Kills: ${game.kills}</div>
                <div>Time: ${game.playTime} | Acc: ${game.accuracy}%</div>
            `;
            recentList.appendChild(item);
        });
    }

    showSettings() {
        document.getElementById('menu-overlay').classList.add('hidden');
        document.getElementById('pause-overlay').classList.add('hidden');
        document.getElementById('settings-overlay').classList.remove('hidden');
        
        document.getElementById('set-sound').checked = this.settings.get('soundEnabled');
        document.getElementById('set-music').checked = this.settings.get('musicEnabled');
        document.getElementById('set-sound-vol').value = this.settings.get('soundVolume') * 100;
        document.getElementById('set-music-vol').value = this.settings.get('musicVolume') * 100;
        document.getElementById('set-particles').checked = this.settings.get('particlesEnabled');
        document.getElementById('set-range').checked = this.settings.get('showRangePreview');
        document.getElementById('set-grid').checked = this.settings.get('gridLines');
        document.getElementById('set-fps').checked = this.settings.get('showFPS');
        document.getElementById('set-hotkeys').checked = this.settings.get('showHotkeys');
        document.getElementById('set-difficulty').value = this.settings.get('difficulty');
    }

    start() {
        this.isPlaying = true;
        document.getElementById('menu-overlay').classList.add('hidden');
        document.getElementById('ui-layer').classList.remove('hidden');
        this.stats.gameStartTime = Date.now();
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

            const tower = this.towers.find(t => t.gx === this.mouse.gx && t.gy === this.mouse.gy);
            const enemy = this.enemies.find(e => {
                const dist = Math.hypot(e.x - mx, e.y - my);
                return dist < e.radius + 10;
            });

            if (tower && !this.selected) {
                this.tooltip.show(this.tooltip.getTowerInfo(tower), e.clientX + 15, e.clientY + 15, 500);
            } else if (enemy) {
                this.tooltip.show(this.tooltip.getEnemyInfo(enemy), e.clientX + 15, e.clientY + 15, 500);
            } else if (this.grid.isPlacementValid(this.mouse.gx, this.mouse.gy)) {
                this.tooltip.show(this.tooltip.getPlacementInfo(), e.clientX + 15, e.clientY + 15, 500);
            } else {
                this.tooltip.hide();
            }
        };

        this.canvas.onmouseleave = () => {
            this.tooltip.hide();
        };
        
        this.canvas.onmousedown = () => {
            if (!this.isPlaying || this.isPaused) return;
            const t = this.towers.find(t => t.gx === this.mouse.gx && t.gy === this.mouse.gy);
            if (t) {
                this.selected = t;
            } else if (this.grid.isPlacementValid(this.mouse.gx, this.mouse.gy) && this.state.gold >= 50) {
                this.state.addGold(-50);
                this.stats.totalMoneySpent += 50;
                this.stats.towersBuilt++;
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
                this.stats.totalMoneySpent += this.selected.upgradeCost;
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
            document.getElementById('t-firerate').innerText = (1000 / this.selected.cooldown).toFixed(1);
            document.getElementById('t-kills').innerText = this.selected.kills;
            document.getElementById('up-cost').innerText = this.selected.upgradeCost;
            document.getElementById('sell-val').innerText = this.selected.sellValue;
        } else {
            p.classList.add('hidden');
        }
        document.getElementById('kill-count').innerText = this.stats.enemiesKilled;
        this.state.updateUI();
    }

    endGame() {
        this.isPlaying = false;
        this.stats.gameEndTime = Date.now();
        this.stats.wavesSurvived = this.state.wave;
        this.stats.highestWaveReached = this.state.wave;
        
        const statsData = this.stats.toJSON();
        const isNewRecord = this.highScore.scores.highestWave < statsData.wavesSurvived;
        
        this.highScore.updateScores(statsData);
        
        document.getElementById('stat-waves').innerText = statsData.wavesSurvived;
        document.getElementById('stat-kills').innerText = statsData.enemiesKilled;
        document.getElementById('stat-accuracy').innerText = statsData.accuracy;
        document.getElementById('stat-damage').innerText = Math.floor(statsData.damageDealt);
        document.getElementById('stat-towers').innerText = statsData.towersBuilt;
        document.getElementById('stat-earned').innerText = statsData.totalMoneyEarned;
        document.getElementById('stat-time').innerText = statsData.playTime;
        
        if (isNewRecord) {
            document.getElementById('new-record').classList.remove('hidden');
        } else {
            document.getElementById('new-record').classList.add('hidden');
        }
        
        document.getElementById('gameover-overlay').classList.remove('hidden');
    }

    loop(t = 0) {
        if (!this.isPlaying) return;
        const dt = t - (this.lastTime || t);
        this.lastTime = t;
        
        this.fpsCounter++;
        this.fpsTime += dt;
        if (this.fpsTime >= 1000) {
            document.getElementById('fps-value').innerText = this.fpsCounter;
            this.fpsCounter = 0;
            this.fpsTime = 0;
        }
        
        if (!this.isPaused) this.update(dt * this.gameSpeed);
        this.renderer.draw(this.grid, this.enemies, this.towers, this.bullets, this.particles, this.mouse, this.selected, this.showRangePreview, this.settings.get('gridLines'));
        requestAnimationFrame(v => this.loop(v));
    }

    update(dt) {
        if (this.state.health <= 0) {
            this.endGame();
            return;
        }

        const difficultyMult = this.settings.getDifficultyMultiplier();
        const spawnRate = 1500 / difficultyMult;

        this.spawnTimer += dt;
        if (this.spawnTimer > spawnRate) {
            const types = ['burger', 'soda', 'steak'];
            const type = types[Math.floor(Math.random() * (this.state.wave > 3 ? 3 : 2))];
            this.enemies.push(new Enemy(this.grid.waypoints, this.cellSize, this.state.wave, type, difficultyMult));
            this.spawnTimer = 0;
        }

        this.enemies.forEach((e, i) => {
            const res = e.update();
            if (res === 'exit') {
                this.enemies.splice(i, 1);
                this.state.reduceHealth(1);
            } else if (e.health <= 0) {
                this.state.addGold(e.goldValue);
                this.stats.totalMoneyEarned += e.goldValue;
                this.stats.enemiesKilled++;
                if (this.settings.get('particlesEnabled')) {
                    for (let k = 0; k < 8; k++) {
                        this.particles.push(new Particle(e.x, e.y, e.color));
                    }
                }
                this.enemies.splice(i, 1);
                if (this.stats.enemiesKilled % 10 === 0) this.state.wave++;
            }
        });

        this.towers.forEach(t => t.update(dt, this.enemies, this.bullets, this.stats));
        this.bullets.forEach((b, i) => {
            b.update();
            if (b.dead) {
                if (this.settings.get('particlesEnabled')) {
                    for (let k = 0; k < 3; k++) {
                        this.particles.push(new Particle(b.x, b.y, "#ffdb58"));
                    }
                }
                this.bullets.splice(i, 1);
            }
        });
        
        if (this.settings.get('particlesEnabled')) {
            this.particles.forEach((p, i) => {
                p.update();
                if (p.life <= 0) this.particles.splice(i, 1);
            });
        } else {
            this.particles = [];
        }
        
        this.state.updateUI();
    }
}