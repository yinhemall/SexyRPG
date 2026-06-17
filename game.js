const config = {
    type: Phaser.AUTO,
    parent: 'gameCanvas',
    width: 250,
    height: 250,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player;

// 初始化虛擬搖桿 (對應你 HTML 中的 zone_joystick)
const manager = nipplejs.create({
    zone: document.getElementById('zone_joystick'),
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'blue'
});

function preload() {
    this.load.image('grass', 'grass.jpg');
    this.load.image('hero_idle', 'hero_idle.png');
    // 記得確認你的圖片寬高，若不是 64 請修改下方的 frameWidth/Height
    this.load.spritesheet('hero_walk', 'hero_walk.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('hero_attack', 'hero_attack.png', { frameWidth: 64, frameHeight: 64 });
}

function create() {
    this.add.image(125, 125, 'grass');
    player = this.physics.add.sprite(125, 125, 'hero_idle');

    // 定義動畫
    this.anims.create({ key: 'walk', frames: this.anims.generateFrameNumbers('hero_walk', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'attack', frames: this.anims.generateFrameNumbers('hero_attack', { start: 0, end: 7 }), frameRate: 15, repeat: 0 });

    // 搖桿控制
    manager.on('move', (evt, data) => {
        // 移動角色
        player.setVelocity(data.vector.x * 150, data.vector.y * -150);
        // 播放走路動畫
        player.play('walk', true);
        // 根據方向翻轉圖片
        player.flipX = data.vector.x < 0;
    });

    manager.on('end', () => {
        // 停止時回到靜止圖
        player.setVelocity(0);
        player.setTexture('hero_idle');
    });
}

function update() {
    // 若有需要持續更新的邏輯可寫在這裡
}
