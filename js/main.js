import { Game } from './core/Game.js';

const flavortown = new Game();

document.getElementById('start-btn').onclick = () => {
    flavortown.start();
    updateHotkeyDisplay();
};

document.getElementById('restart-btn').onclick = () => flavortown.restart();
document.getElementById('exit-btn').onclick = () => location.reload();
document.getElementById('pause-btn').onclick = () => flavortown.togglePause();
document.getElementById('resume-btn').onclick = () => flavortown.togglePause();
document.getElementById('quick-restart-btn').onclick = () => {
    flavortown.restart();
    document.getElementById('pause-overlay').classList.add('hidden');
};
document.getElementById('quit-btn').onclick = () => location.reload();

document.getElementById('highscores-btn').onclick = () => {
    flavortown.showHighScores();
};

document.getElementById('close-highscores-btn').onclick = () => {
    document.getElementById('highscores-overlay').classList.add('hidden');
    document.getElementById('menu-overlay').classList.remove('hidden');
};

document.getElementById('clear-scores-btn').onclick = () => {
    if (confirm('Clear all high scores? This cannot be undone.')) {
        flavortown.highScore.clear();
        flavortown.showHighScores();
    }
};

document.getElementById('settings-menu-btn').onclick = () => {
    flavortown.showSettings();
};

document.getElementById('settings-btn').onclick = () => {
    flavortown.showSettings();
    document.getElementById('pause-overlay').classList.add('hidden');
};

document.getElementById('close-settings-btn').onclick = () => {
    document.getElementById('settings-overlay').classList.add('hidden');
    if (flavortown.isPlaying) {
        flavortown.isPaused = true;
        document.getElementById('pause-overlay').classList.remove('hidden');
    } else {
        document.getElementById('menu-overlay').classList.remove('hidden');
    }
};

document.getElementById('reset-settings-btn').onclick = () => {
    if (confirm('Reset all settings to defaults?')) {
        flavortown.settings.reset();
        flavortown.showSettings();
        flavortown.applySettings();
    }
};

document.getElementById('set-sound').onchange = (e) => {
    flavortown.settings.set('soundEnabled', e.target.checked);
};

document.getElementById('set-music').onchange = (e) => {
    flavortown.settings.set('musicEnabled', e.target.checked);
};

document.getElementById('set-sound-vol').oninput = (e) => {
    flavortown.settings.set('soundVolume', e.target.value / 100);
};

document.getElementById('set-music-vol').oninput = (e) => {
    flavortown.settings.set('musicVolume', e.target.value / 100);
};

document.getElementById('set-particles').onchange = (e) => {
    flavortown.settings.set('particlesEnabled', e.target.checked);
};

document.getElementById('set-range').onchange = (e) => {
    flavortown.settings.set('showRangePreview', e.target.checked);
    flavortown.showRangePreview = e.target.checked;
};

document.getElementById('set-grid').onchange = (e) => {
    flavortown.settings.set('gridLines', e.target.checked);
};

document.getElementById('set-fps').onchange = (e) => {
    flavortown.settings.set('showFPS', e.target.checked);
    updateFPSDisplay();
};

document.getElementById('set-hotkeys').onchange = (e) => {
    flavortown.settings.set('showHotkeys', e.target.checked);
    updateHotkeyDisplay();
};

document.getElementById('set-difficulty').onchange = (e) => {
    flavortown.settings.set('difficulty', e.target.value);
};

function updateFPSDisplay() {
    const fpsCounter = document.getElementById('fps-counter');
    if (flavortown.settings.get('showFPS')) {
        fpsCounter.classList.remove('hidden');
    } else {
        fpsCounter.classList.add('hidden');
    }
}

function updateHotkeyDisplay() {
    const hotkeyDisplay = document.getElementById('hotkey-display');
    if (flavortown.settings.get('showHotkeys')) {
        hotkeyDisplay.classList.remove('hidden');
    } else {
        hotkeyDisplay.classList.add('hidden');
    }
}

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
                flavortown.stats.totalMoneySpent += flavortown.selected.upgradeCost;
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