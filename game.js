let player = {x: 1, y: 1};
let map = [];
let lastMoveTime = 0;

// 1. 初始化遊戲與讀取地圖
async function init() {
    const res = await fetch('map.json');
    const data = await res.json();
    map = data.map;
    draw();
}

// 2. 繪圖函式
function draw() {
    const ctx = document.getElementById('gameCanvas').getContext('2d');
    ctx.clearRect(0, 0, 250, 250);
    map.forEach((row, r) => {
        row.forEach((tile, c) => {
            ctx.fillStyle = tile === 1 ? '#333' : '#eee';
            ctx.fillRect(c*50, r*50, 48, 48);
        });
    });
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x*50, player.y*50, 48, 48);
}

// 3. 移動邏輯
function movePlayer(dx, dy) {
    if (map[player.y + dy] && map[player.y + dy][player.x + dx] === 0) {
        player.x += dx;
        player.y += dy;
        draw();
    }
}

// 4. 設定虛擬搖桿
const manager = nipplejs.create({
    zone: document.getElementById('zone_joystick'),
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'red'
});

manager.on('move', (evt, data) => {
    // 限制移動頻率，避免移動太快
    const now = Date.now();
    if (now - lastMoveTime > 150 && data.direction) {
        let dx = 0, dy = 0;
        if (data.direction.angle === 'up') dy = -1;
        if (data.direction.angle === 'down') dy = 1;
        if (data.direction.angle === 'left') dx = -1;
        if (data.direction.angle === 'right') dx = 1;
        
        movePlayer(dx, dy);
        lastMoveTime = now;
    }
});

init();
