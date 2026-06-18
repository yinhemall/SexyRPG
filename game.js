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
    // 檢查角色是否已存在，若存在則直接返回，不再創建
    if (this.playerCreated) return;
    this.playerCreated = true;

    // 1. 鋪設背景
    this.add.tileSprite(195, 350, 390, 700, 'grass');
    
    // 2. 建立角色
    player = this.physics.add.sprite(195, 350, 'hero_idle');
    player.setCollideWorldBounds(true);

    // 3. 建立動畫
    this.anims.create({ key: 'walk', frames: this.anims.generateFrameNumbers('hero_walk', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'idle', frames: [{ key: 'hero_idle' }], frameRate: 1, repeat: -1 });

    // 4. 初始化搖桿
    const zone = document.getElementById('zone_joystick');
    // 清空舊的搖桿節點，防止疊加
    zone.innerHTML = '';
    
    manager = nipplejs.create({
        zone: zone,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'blue'
    });

    manager.on('move', (evt, data) => {
        if (!player) return;
        player.setVelocity(data.vector.x * 200, data.vector.y * -200);
        player.play('walk', true);
        player.flipX = data.vector.x < 0;
    });

    manager.on('end', () => {
        if (!player) return;
        player.setVelocity(0);
        player.play('idle', true);
    });
}
