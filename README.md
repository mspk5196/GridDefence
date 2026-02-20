# Grid Defence

A tower defense game with a diner theme, because apparently running a restaurant is just as intense as defending against waves of enemies.

## What's this about ?

Grid defence is a fast-paced tower defense game where you place towers on a grid to stop enemies from reaching the end. Think classic tower defense mechanics but with a fun diner aesthetic. Your job is to keep the "diner open by preventing the "health inspector" (enemies) from shutting you down.

The game features:
- **Wave-based gameplay** - Survice as many waves as you can
- **Tower upgrades** - Make your defenses stronger as you earn gold
- **Speed controls** - Speed things up when you're confident, or take your time
- **Smooth particle effects** - Because explosions should look good
- **Keyboard shortcuts** - Play efficiently without clicking everything

## How to play

1. **Place towers** - Click on empty grid cells to place defensive towers(costs 50 gold)
2. **Defend your base** - Stop enemies from reaching the end of the path
3. **Earn gold** - Each enemy defeated gives you gold to soend on more towers
4. **Upgrade towers** - Click on towers to select them, then press `Q` to upgrade
5. **Survive waves** - Each wave gets progressively harder

You start with 150 gold and 20 health. Lose all your health and the diner closes!

## Controls

### Mouse
- **Click** - Place tower or select existing tower
- **Hover** - Preview tower range

### Keybord
- **Space** - pause/Resume
- **R** - Quick restart (with confirmation)
- **ESC** - Toggle menu / Deselect tower
- **1/2/3** - Set game speed (1x, 2x, 3x)
- **Q** - Upgrade selected tower
- **W** - Sellselcted tower (60% refund)

## Running the game

Since this is a pure vanilla JS project, you just need to open it in a browser:
1. Clone or download this repo
2. Open `index.html` in your web browser
3. Click "OPEN DINER (START)" and start defending!

No build process, no npm install, no webpack config, Just old-school JS.

## Project Structure

```
├── index.html              # Main game page
├── test.html              # Testing page
├── css/
│   └── main.css           # All the styling
├── js/
│   ├── main.js            # Entry point and event handlers
│   ├── core/
│   │   ├── Game.js        # Main game loop and logic
│   │   ├── Input.js       # Input handling
│   │   └── State.js       # Game state management
│   ├── entities/
│   │   ├── Bullet.js      # Projectile logic
│   │   ├── Enemy.js       # Enemy behavior
│   │   └── Tower.js       # Tower functionality
│   └── systems/
│       ├── Grid.js        # Grid and pathfinding
│       ├── HighScore.js   # Score tracking
│       ├── Particles.js   # Particle effects
│       ├── Physics.js     # Physics calculations
│       ├── Renderer.js    # Canvas rendering
│       ├── Settings.js    # Game settings
│       ├── Stats.js       # Statistics tracking
│       └── WaveManager.js # Wave spawning logic
```

## Features

- Responsive tower placement with visual feedback
- Multiple game speeds (1x, 2x, 3x)
- Tower upgrade system
- Wave-based difficulty progression
- Particle effects for visual feedback
- Comprehensive keyboard shortcuts
- Pause/resume functionality
- Stats tracking

Tips & Strategy

- Place towers at corners where enemies slow down - you'll get more shots off
- Don't spend all your gold immediately - save some for upgrades
- Upgraded towers are usually better value than more level 1 towers
- Use speed controls strategically - slow down for precise placement, speed up during easy waves
- Watch the wave counter - plan your economy around what's coming

## Future Ideas

Things that might get added if I find the time:
- Different tower types (splash damage, slow effects, etc.)
- More enemy varieties with special abilities
- Sound effects and music
- High score leaderboard
- Mobile touch controls
- Save/load game state

## License

Do whatever you want with this code. Make it better, make it worse, turn it into a completely different game. Just have fun with it.

---

Made with ☕ and probably too much time spent tweaking particle effects.
