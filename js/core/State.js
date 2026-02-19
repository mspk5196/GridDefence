export class State {
    constructor() {
        this.gold = 150;
        this.health = 20;
        this.wave = 1;
        this.score = 0;
        this.ui = {
            gold: document.getElementById('gold-count'),
            health: document.getElementById('health-count'),
            wave: document.getElementById('wave-count')
        };
    }
    updateUI() {
        this.ui.gold.innerText = Math.floor(this.gold);
        this.ui.health.innerText = this.health;
        this.ui.wave.innerText = this.wave;
    }
    addGold(amt) { this.gold += amt; this.updateUI(); }
    reduceHealth(amt) {
        this.health -= amt;
        this.updateUI();
    }
}