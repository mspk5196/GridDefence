import { Game } from './core/Game.js';

const flavortown = new Game();

document.getElementById('start-btn').onclick = () => flavortown.start();
document.getElementById('restart-btn').onclick = () => flavortown.restart();
document.getElementById('exit-btn').onclick = () => location.reload();
document.getElementById('pause-btn').onclick = () => flavortown.togglePause();
document.getElementById('resume-btn').onclick = () => flavortown.togglePause();
document.getElementById('quick-restart-btn').onclick = () => {
    flavortown.restart();
    document.getElementById('pause-overlay').classList.add('hidden');
};
document.getElementById('quit-btn').onclick = () => location.reload();
document.getElementById('settings-btn').onclick = () => {
    alert('Settings coming soon!');
};

document.getElementById('speed-1x').onclick = () => flavortown.setSpeed(1);
document.getElementById('speed-2x').onclick = () => flavortown.setSpeed(2);
document.getElementById('speed-3x').onclick = () => flavortown.setSpeed(3);

document.addEventListener('keydown', (e) => {
    if (!flavortown.isPlaying) return;
    
    switch(e.key.toLowerCase()) {
        case ' ':
            e.preventDefault();
            flavortown.togglePause();
            break;
        case 'r':
            if (confirm('Restart the game? Progress will be lost.')) {
                flavortown.restart();
            }
            break;
        case 'escape':
            if (flavortown.selected) {
                flavortown.selected = null;
                flavortown.updateUI();
            } else if (!flavortown.isPaused) {
                flavortown.togglePause();
            } else {
                flavortown.togglePause();
            }
            break;
        case '1':
            flavortown.setSpeed(1);
            break;
        case '2':
            flavortown.setSpeed(2);
            break;
        case '3':
            flavortown.setSpeed(3);
            break;
        case 'q':
            if (flavortown.selected && flavortown.state.gold >= flavortown.selected.upgradeCost) {
                flavortown.state.addGold(-flavortown.selected.upgradeCost);
                flavortown.selected.upgrade();
                flavortown.updateUI();
            }
            break;
        case 'w':
            if (flavortown.selected) {
                flavortown.state.addGold(flavortown.selected.sellValue);
                flavortown.grid.tiles[flavortown.selected.gy][flavortown.selected.gx] = 0;
                flavortown.towers = flavortown.towers.filter(t => t !== flavortown.selected);
                flavortown.selected = null;
                flavortown.updateUI();
            }
            break;
    }
});