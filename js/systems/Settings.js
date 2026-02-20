export class Settings{
    constructor() {
        this.storageKey = 'flavortown_settings';
        this.defaults = {
            soundEnabled: true,
            musicEnabled: true,
            soundVolumes: 0.7,
            musicVolume: 0.5,
            particlesEnabled: true,
            showFPS: false,
            showHotKeys: true,
            showRangePreview: true,
            gridLines: true,
            difficulty: 'normal'
        };
        this.settings = this.load();
    }

    load() {
        const data = localStorage.getItem(this.storageKey)
        return data ? { ...this.defaults, ...JSON.parse(data)} : {...this.defaults};
    }
}