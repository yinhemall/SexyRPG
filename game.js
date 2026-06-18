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
        create: create
    }
};

const game = new Phaser.Game(config);
let player, manager, isInitialized = false; // 加入初始化狀態標記

function preload() {
    // 確保這裡的檔案名稱與你 GitHub 倉庫裡的檔案完全一致
    this.load.image('grass', 'grass.JPG'); 
    this.load.image('hero_idle', 'hero_idle.png');
    this.load.spritesheet('hero_walk', 'hero_walk.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('hero_attack', 'hero_attack.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    // 【iOS 防護機制】：如果已經初始化過，直接終止，避免疊加
    if (isInitialized) return;
    isInitialized = true;

    // 使用 TileSprite 進行無縫平鋪
    // 它會自動把 'grass' 這張圖填滿 390x700 的範圍
    this.add.tileSprite(195, 350, 390, 700, 'grass');
    
    // 初始化角色
    player = this.physics.add.sprite(195, 350, 'hero_idle');
    player.setCollideWorldBounds(true);

    // 建立動畫
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('hero_walk', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
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

    manager.on('move', (evt, data) => {
        player.setVelocity(data.vector.x * 200, data.vector.y * -200);
        player.play('walk', true);
        player.flipX = data.vector.x < 0;
    });

    manager.on('end', () => {
        player.setVelocity(0);
        player.play('idle', true);
    });
}
