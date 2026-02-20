export class Stats {
    constructor() {
        this.reset();
    }

    reset() {
        this.enemiesKilled = 0;
        this.towersBuilt =0;
        this.totalMoneyEarned = 0;
        this.totalMoneySpent = 0;
        this.bulletsShot = 0;
        this.bulletsHit = 0;
        this.damageDealt = 0;
        this.wavesSurvived = 0;
        this.gameStartTime = Date.now();
        this.gameEndTime = null;
        this.highestWaveReached = 0;
    }

    getAccuracy() {
        return this.bulletsShot > 0 ? Math.round((this.bulletsHit/this.bulletsShot)*100) : 0;
    }

    getPlayTime() {
        const end = this.gameEndTime || Date.now();
        const seconds = Math.floor((end - this.gameStartTime)/1000);
        const mins = Math.floor(seconds/60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    toJSON() {
        return {
            enemiesKilled: this.enemiesKilled,
            towersBuilt: this.towersBuilt,
            totalMoneyEarned: this.totalMoneyEarned,
            totalMoneySpent: this.totalMoneySpent,
            accuracy: this.getAccuracy(),
            damageDealt: this.damageDealt,
            wavesSurvived: this.wavesSurvived,
            playTime: this.getPlayTime(),
            highestWaveReached: this.highestWaveReached
        };
    }
}