export class Settings {
    constructor() {
        this.storageKey = 'flavortown_settings';
        this.defaults = {
            soundEnabled: true,
            musicEnabled: true,
            soundVolume: 0.7,
            musicVolume: 0.5,
            particlesEnabled: true,
            showFPS: false,
            showHotkeys: true,
            showRangePreview: true,
            gridLines: true,
            difficulty: 'normal'
        };
        this.settings = this.load();
    }

    load() {
        const data = localStorage.getItem(this.storageKey);
        return data ? { ...this.defaults, ...JSON.parse(data) } : { ...this.defaults };
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    }

    get(key) {
        return this.settings[key];
    }

    set(key, value) {
        this.settings[key] = value;
        this.save();
    }

    toggle(key) {
        this.settings[key] = !this.settings[key];
        this.save();
        return this.settings[key];
    }

    reset() {
        this.settings = { ...this.defaults };
        this.save();
    }

    getDifficultyMultiplier() {
        switch (this.settings.difficulty) {
            case 'easy': return 0.7;
            case 'normal': return 1.0;
            case 'hard': return 1.5;
            default: return 1.0;
        }
    }
}