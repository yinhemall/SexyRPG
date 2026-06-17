const config = {
    type: Phaser.AUTO,
    parent: 'gameCanvas',
    width: 390,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player, manager;

function preload() {
    // 載入圖片資源
    this.load.image('grass', 'grass.jpg');
    this.load.image('hero_idle', 'hero_idle.png');
    // 載入動畫圖集
    this.load.spritesheet('hero_walk', 'hero_walk.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('hero_attack', 'hero_attack.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    // 建立平鋪地圖背景
    const bg = this.add.tileSprite(195, 350, 390, 700, 'grass');
    
    // 建立角色並設定物理屬性
    player = this.physics.add.sprite(195, 350, 'hero_idle');
    player.setCollideWorldBounds(true);

    // 定義動畫
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('hero_walk', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('hero_attack', { start: 0, end: 7 }),
        frameRate: 15,
        repeat: 0
    });

    this.anims.create({
        key: 'idle',
        frames: [{ key: 'hero_idle' }],
        frameRate: 1,
        repeat: -1
    });

    // 初始化虛擬搖桿
    manager = nipplejs.create({
        zone: document.getElementById('zone_joystick'),
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'blue'
    });

    // 搖桿移動事件
    manager.on('move', (evt, data) => {
        player.setVelocity(data.vector.x * 200, data.vector.y * -200);
        player.play('walk', true);
        player.flipX = data.vector.x < 0;
    });

    // 搖桿結束事件 (停止移動並回到閒置狀態)
    manager.on('end', () => {
        player.setVelocity(0);
        player.play('idle', true);
    });
}

function update() {
    // 這裡保留為空，確保物理引擎正常運作
}
