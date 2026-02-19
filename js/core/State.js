export class State {
    constructor() {
        this.gold =100;
        this.health = 20;
        this.wave =1;
        this.isGameOver =false;
        this.selectedTowerType = 'mustard';

        this.ui = {
            gold: document.getElementById('gold-count'),
            health: document.getElementById('health-count'),
            wave: document.getElementById('wave-count')
        };
    }

    updateUI(){
        this.ui.gold.innerText = Math.floor(this.gold);
        this.ui.health.innerText = this.health;
        this.ui.wave.innerText = this.wave;
    }

    reduceHealth(amount) {
        this.health -= amount;
        if(this.health <=0){
            this.heaalth =0;
            this.isGameOver = true;
            alert("The Dinner is Closed! Too many bland customers.");
        }
        this.updateUI();
    }

    addGold(amount){
        this.gold += amount;
        this.updateUI();
    }
}