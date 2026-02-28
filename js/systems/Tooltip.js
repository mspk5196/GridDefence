export class Tooltip {
    constructor() {
        this.createTooltipElement();
        this.active = false;
        this.hideTimeout = null;
    }

    createTooltipElement() {
        this.element = document.createElement('div');
        this.element.id = 'game-tooltip';
        this.element.className = 'tooltip hidden';
        document.body.appendChild(this.element);
    }

    show(content, x, y, delay = 300) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
            this.element.innerHTML = content;
            this.element.style.left = x + 'px';
            this.element.style.top = y + 'px';
            this.element.classList.remove('hidden');
            this.active = true;
        }, delay);
    }

    hide() {
        clearTimeout(this.hideTimeout);
        this.element.classList.add('hidden');
        this.active = false;
    }

    getTowerInfo(tower) {
        return `
            <div class="tooltip-header">🍔 BURGER BLASTER</div>
            <div class="tooltip-stat">Level: ${tower.level}</div>
            <div class="tooltip-stat">Damage: ${Math.floor(tower.damage)}</div>
            <div class="tooltip-stat">Range: ${Math.floor(tower.range)}</div>
            <div class="tooltip-stat">Fire Rate: ${(1000 / tower.cooldown).toFixed(1)}/s</div>
            <div class="tooltip-footer">Click to select</div>
        `;
    }

    getEnemyInfo(enemy) {
        const types = {
            'burger': { name: 'Angry Burger', desc: 'Basic enemy' },
            'soda': { name: 'Fizzy Soda', desc: 'Fast & weak' },
            'steak': { name: 'T-Bone Tank', desc: 'Slow & tough' }
        };
        const info = types[enemy.type];
        return `
            <div class="tooltip-header">${info.name}</div>
            <div class="tooltip-desc">${info.desc}</div>
            <div class="tooltip-stat">HP: ${Math.floor(enemy.health)}/${enemy.maxHealth}</div>
            <div class="tooltip-stat">Speed: ${enemy.speed.toFixed(1)}</div>
            <div class="tooltip-stat">Worth: ${enemy.goldValue}g</div>
        `;
    }

    getPlacementInfo() {
        return `
            <div class="tooltip-header">PLACE TOWER</div>
            <div class="tooltip-stat">Cost: 50g</div>
            <div class="tooltip-stat">Damage: 30</div>
            <div class="tooltip-stat">Range: 160</div>
            <div class="tooltip-footer">Click to build</div>
        `;
    }
}