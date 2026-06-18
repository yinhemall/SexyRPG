// 徹底清理全局變數，防止重複
if (window.game) {
    window.game.destroy(true);
    window.game = null;
}

const config = {
    type: Phaser.AUTO,
    parent: 'gameCanvas',
    width: 700, 
    height: 390,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload: preload, create: create }
};

window.game = new Phaser.Game(config);

let player, manager;

function preload() {
    this.load.image('grass', 'grass.JPG');
    this.load.image('hero_idle', 'hero_idle.png');
    this.load.spritesheet('hero_walk', 'hero_walk.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('hero_attack', 'hero_attack.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    // 確保場景不被二次初始化
    if (this.scene.isActive('main')) return;
    
    // 清除舊的搖桿
    const zone = document.getElementById('zone_joystick');
    zone.innerHTML = '';
    if (window.manager) {
        window.manager.destroy();
    }

    // 鋪設背景與建立角色
    this.add.tileSprite(350, 195, 700, 390, 'grass');
    player = this.physics.add.sprite(350, 195, 'hero_idle');
    player.setCollideWorldBounds(true);

    // 建立動畫
    this.anims.create({ key: 'walk', frames: this.anims.generateFrameNumbers('hero_walk', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'idle', frames: [{ key: 'hero_idle' }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'attack', frames: this.anims.generateFrameNumbers('hero_attack', { start: 0, end: 7 }), frameRate: 12, repeat: 0 });

    // 初始化搖桿
    window.manager = nipplejs.create({
        zone: zone,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'blue'
    });

    window.manager.on('move', (evt, data) => {
        player.setVelocity(data.vector.x * 200, data.vector.y * -200);
        player.play('walk', true);
        player.flipX = data.vector.x < 0;
    });

    window.manager.on('end', () => {
        player.setVelocity(0);
        player.play('idle', true);
    });
}
