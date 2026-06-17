const config = {
    type: Phaser.AUTO, width: 390, height: 700,
    physics: { default: 'arcade' },
    scene: { preload: preload, create: create, update: update }
};
const game = new Phaser.Game(config);
let player, stick;

function preload() {
    this.load.image('grass', 'grass.png');
    this.load.spritesheet('hero_walk', 'hero_walk.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('hero_attack', 'hero_attack.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('hero_idle', 'hero_idle.png');
}

function create() {
    this.add.tileSprite(195, 350, 390, 700, 'grass');
    player = this.physics.add.sprite(195, 350, 'hero_idle');

    // --- 動畫核心在這裡 ---
    this.anims.create({ key: 'walk', frames: this.anims.generateFrameNumbers('hero_walk', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'attack', frames: this.anims.generateFrameNumbers('hero_attack', { start: 0, end: 7 }), frameRate: 15, repeat: 0 });

    // 搖桿視覺 (圓圈)
    this.add.circle(100, 600, 50, 0x888888, 0.5);
    stick = this.add.circle(100, 600, 25, 0xffffff, 0.8);
    
    // 攻擊按鈕 (畫一個簡單的圓形按鈕在右下角)
    const attackBtn = this.add.circle(300, 600, 40, 0xff0000, 0.6);
    attackBtn.setInteractive().on('pointerdown', () => {
        player.play('attack', true); // 按下按鈕時播放攻擊動畫
    });

    this.input.on('pointermove', (pointer) => {
        if (pointer.isDown && pointer.x < 200) { // 在左半邊滑動才控制移動
            stick.setPosition(pointer.x, pointer.y);
            const dx = pointer.x - 100;
            const dy = pointer.y - 600;
            player.setVelocity(dx * 3, dy * 3);
            player.play('walk', true);
            player.flipX = dx < 0;
        }
    });

    this.input.on('pointerup', () => {
        stick.setPosition(100, 600);
        player.setVelocity(0);
        player.setTexture('hero_idle'); // 停止時變回站立圖
    });
}

function update() {}
