const config = {
    type: Phaser.AUTO,
    parent: 'gameCanvas',
    width: 390, // 調整為手機常見寬度
    height: 700,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player;

const manager = nipplejs.create({
    zone: document.getElementById('zone_joystick'),
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'blue'
});

function preload() {
    this.load.image('grass', 'grass.jpg');
    this.load.image('hero_idle', 'hero_idle.png');
    // 如果你的角色圖也是 32x32，請把下面的 64 改成 32
    this.load.spritesheet('hero_walk', 'hero_walk.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('hero_attack', 'hero_attack.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    // 將草地設為 390x700 的大畫布，並重複拼貼
    const bg = this.add.tileSprite(195, 350, 390, 700, 'grass');
    
    player = this.physics.add.sprite(195, 350, 'hero_idle');
    player.setCollideWorldBounds(true); // 不會跑出螢幕

    this.anims.create({ key: 'walk', frames: this.anims.generateFrameNumbers('hero_walk', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'attack', frames: this.anims.generateFrameNumbers('hero_attack', { start: 0, end: 7 }), frameRate: 15, repeat: 0 });

    manager.on('move', (evt, data) => {
        player.setVelocity(data.vector.x * 200, data.vector.y * -200);
        player.play('walk', true);
        player.flipX = data.vector.x < 0;
    });

    manager.on('end', () => {
        player.setVelocity(0);
        player.play('idle', true); // 或用 setTexture('hero_idle')
    });
}

function update() {}
