const config = {
    type: Phaser.AUTO,
    parent: 'gameCanvas',
    width: 390,
    height: 700,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload: preload, create: create }
};

// 確保 game 只初始化一次
if (!window.game) {
    window.game = new Phaser.Game(config);
}

let player, manager;

function preload() {
    this.load.image('grass', 'grass.JPG');
    this.load.image('hero_idle', 'hero_idle.png');
    this.load.spritesheet('hero_walk', 'hero_walk.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('hero_attack', 'hero_attack.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    // 1. 徹底防止重複創建角色與搖桿
    if (this.playerCreated) return;
    this.playerCreated = true;

    // 2. 清理舊有的搖桿實體（防止記憶體洩漏與重複綁定）
    const zone = document.getElementById('zone_joystick');
    zone.innerHTML = '';
    if (window.manager) {
        window.manager.destroy();
    }

    // 3. 鋪設背景
    this.add.tileSprite(195, 350, 390, 700, 'grass');
    
    // 4. 建立角色
    player = this.physics.add.sprite(195, 350, 'hero_idle');
    player.setCollideWorldBounds(true);

    // 5. 建立動畫
    this.anims.create({ key: 'walk', frames: this.anims.generateFrameNumbers('hero_walk', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'idle', frames: [{ key: 'hero_idle' }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'attack', frames: this.anims.generateFrameNumbers('hero_attack', { start: 0, end: 7 }), frameRate: 12, repeat: 0 });

    // 6. 初始化搖桿
    window.manager = nipplejs.create({
        zone: zone,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'blue'
    });

    window.manager.on('move', (evt, data) => {
        if (!player) return;
        player.setVelocity(data.vector.x * 200, data.vector.y * -200);
        player.play('walk', true);
        player.flipX = data.vector.x < 0;
    });

    window.manager.on('end', () => {
        if (!player) return;
        player.setVelocity(0);
        player.play('idle', true);
    });
}
