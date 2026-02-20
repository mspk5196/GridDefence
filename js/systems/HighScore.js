export class HighScore{
    constructor() {
        this.storageKey = 'flavortown_highscores';
        this.scores = this.load();
    }

    load() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {
            highestWave: 0,
            mostKills: 0,
            longestTime: 0,
            mostAccurate: 0,
            recentGames: []
        };
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
    }

    updateScores(stats) {
        if(stats.wavesSurvived > this.scores.highestWave){
            this.scores.highestWave = stats.wavesSurvived;
        }
        if(stats.enemiesKilled > this.scores.mostKills) {
            this.scores.mostKills = stats.enemiesKilled;
        }
        const playTime = this.getSecondsFromTime(stats.playTime);
        if(playTime > this.scores.longestTime){
            this.scores.longestTime = playTime;
        }
        const accuracy = stats.accuracy;
        if(accuracy > this.scores.mostAccurate) {
            this.scores.mostAccurate = accuracy;
        }
        this.scores.recentGames.unshift({
            date: new Date().toLocaleDateString(),
            wave: stats.wavesSurvived,
            kills: stats.enemiesKilled,
            playTime: stats.playTime,
            accuracy: accuracy
        })

        if(this.scores.recentGames.length > 10){
            this.scores.recentGames = this.scores.recentGames.slice(0,10);
        }
        this.save();
    }

    getSecondsFromTime(timeString) {
        const parts = timeString.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds %60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    getHighScores() {
        return {
            ...this.scores,
            longestTimeFormatted: this.formatTime(this.scores.longestTime)
        }
    }

    clear(){
        this.scores = {
            highestWave: 0,
            mostKills:0,
            longestTime: 0,
            mostAccurate: 0,
            recentGames: []
        };
        this.save();
    }
}