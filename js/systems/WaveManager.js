export class WaveManager {
    constructor(game) {
        this.game = game;
        this.currentWave = 1;
        this.enemiesToSpawn = 0;
        this.spawnedCount = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 800;
        this.isWaveActive = false;
        this.waveDelay = 3000; 
        this.waveTimer = 0;
    }

    startWave() {
        this.enemiesToSpawn = 5 + (this.currentWave * 2);
        this.spawnedCount = 0;
        this.isWaveActive = true;
        console.log(`Wave ${this.currentWave} is cooking!`);
    }

    update(dt) {
        if (!this.isWaveActive) {
            this.waveTimer += dt;
            if (this.waveTimer >= this.waveDelay) {
                this.startWave();
                this.waveTimer = 0;
            }
            return;
        }

        this.spawnTimer += dt;
        if (this.spawnTimer >= this.spawnInterval && this.spawnedCount < this.enemiesToSpawn) {
            this.game.spawnEnemy(this.currentWave);
            this.spawnedCount++;
            this.spawnTimer = 0;
        }

        if (this.spawnedCount >= this.enemiesToSpawn && this.game.enemies.length === 0) {
            this.isWaveActive = false;
            this.currentWave++;
            this.game.state.wave = this.currentWave;
            this.game.state.addGold(50 + (this.currentWave * 10)); // Wave completion bonus
        }
    }
}