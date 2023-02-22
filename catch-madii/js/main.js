const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');
var lm = null;

var last = 0;
var delta = 0;

const hero = {
    direction: [0, 0],
    move: [0, 0],
    t: 0,
    img: null,
    isLoaded: false
}

const madii = {
    direction: [0, 0],
    move: [0, 0],
    t: 0,
    img: null,
    isLoaded: false,
    pulseT: 0,
    pulse: 0
}

const grid = [];

const FREE = 0;
const LEFTDIAG = 1;
const RIGHTDIAG = 2;
const BLOCKED = 3;

const pos = [2, 1];
const madiiPos = [1, 0];

// w - 980, h - 1687

var ROWS = 7;
var COLS = 5;

var cellW = 200;
var cellH = 200;

var agentsDim = 150;
var agentScale = 1;

var centerX = cellW / 2 - agentsDim / 2;
var centerY = cellH / 2 - agentsDim / 2;

var scaleX = 1;
var scaleY = 1;

var screenCenterX = 0;
var screenCenterY = 0;

var halfW = 0;
var halfH = 0;

var textSize = 80;
var textCenter = 130;

const directions = {
    'ArrowRight': [1, 0],
    'ArrowLeft': [-1, 0],
    'ArrowUp': [0, -1],
    'ArrowDown': [0, 1],
    'LeftUp': [-1, -1],
    'RightDown': [1, 1],
    'LeftDown': [-1, 1],
    'RightUp': [1, -1],
}

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    let hw = w / 2;
    let hh = h / 2;

    halfW = hw;
    halfH = hh;

    scaleX = 980 / w;
    scaleY = 1687 / h;

    // scaleX = w / 980;
    // scaleY = h / 1687;

    textSize *= scaleX;
    textCenter *= scaleX;

    cellW *= scaleX;
    cellH = cellW;

    agentScale = scaleX;
    agentsDim *= agentScale;

    let gridW = cellW * COLS;
    let gridH = cellH * ROWS;

    console.log(h, gridH)

    if (h < gridH) {
        cellH = 125;
        cellW = 125;

        gridW = cellW * COLS;
        gridH = cellH * ROWS;

        agentScale = 0.625;
        agentsDim = 150 * agentScale;

        textSize = 80 * agentScale;
        textCenter = 130 * agentScale;
        
    }

    centerX = cellW / 2 - agentsDim / 2;
    centerY = cellH / 2 - agentsDim / 2;

    screenCenterX = hw - gridW / 2;
    screenCenterY = hh - gridH / 2;

    centerX += screenCenterX;
    centerY += screenCenterY;


    lm = new LevelManager(w, h);

    for (let i = 0; i < ROWS; ++i) {
        grid[i] = [];
        for (let j = 0; j < COLS; ++j) {
            grid[i][j] = FREE;
        }
    }

    // grid[2][0] = BLOCKED;
    // grid[2][1] = BLOCKED;
    // grid[2][2] = BLOCKED;
    grid[6][1] = LEFTDIAG;

    for (let i = 2; i < ROWS - 2; ++i) {
        for (let j = 0; j < COLS - 2; ++j) {
            grid[i][j] = BLOCKED;
        }
    }

    hero.img = new Image();
    hero.img.src = 'assets/you.png';

    hero.img.onload = function() {
        hero.isLoaded = true;
    }

    madii.img = new Image();
    madii.img.src = 'assets/madii2.png';

    madii.img.onload = function() {
        madii.isLoaded = true;
    }
    

    controls();
    gameCycle();
}

function isMoveValid(x, y, mx, my) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) {
        return false;
    } else {
        if (grid[y][x] == BLOCKED) return false;

        let m = isDiagMove(mx, my);

        let prevX = x - mx;
        let prevY = y - my;

        if (m && grid[y][x] != m && grid[prevY][prevX] != m) 
            return false;
    }
    
    return true;
}

function isDiagMove(x, y) {
    if (x != 0 && x == y)
        return LEFTDIAG;
    else if (x == 1 && y == -1 || x == -1 && y == 1)
        return RIGHTDIAG;

    return 0;
}

function moveOnClick(x, y, mx, my) {
    let dx = Math.abs(pos[0] - x);
    let dy = Math.abs(pos[1] - y);

    if (isMoveValid(x, y, mx, my) && !(x == pos[0] && y == pos[1]) && (dx < 2 && dy < 2)) {
        pos[0] = x;
        pos[1] = y;

        hero.direction = [mx, my];
        hero.move = [cellW * mx, cellH * my];
        hero.t = 0;

        if (!isMadiiCaught()) {
            aiMove();
        } else {
            alert('You caught Madii!');
        }
    } else {
        console.log('Invalid Move!');
    }
}

function aiMove() {
    const betsMove = {
        value: 0,
        newpos: []
    };

    let px = pos[0];
    let py = pos[1];

    const diags = [];

    if (grid[py][px] == LEFTDIAG) {
        diags.push([
            [px - 1, py - 1],
            [px + 1, py + 1]
        ]);
    } else if (grid[py][px] == RIGHTDIAG) {
        diags.push([
            px + 1, py - 1,
            px - 1, py + 1
        ]);
    }

    var selMx = 0;
    var selMy = 0;

     // check all move options
    for (let k in directions) {
        let mx = directions[k][0];
        let my = directions[k][1];

        let x = mx + madiiPos[0];
        let y = my + madiiPos[1];

        if (isMoveValid(x, y, mx, my)) {
            let d = manhattanDist(pos[0], x, pos[1], y);

            // add weights favoring even distances with +1 point
            let r = d + ((d & 1) ? 1 : 2);
            if (d == 2) r += 1.5;

            r += countValidMoves(x, y) / 10;

            // deductions from diagonals
            if (diags.length && ((x == diags[0][0][0] && y == diags[0][0][1]) || (x == diags[0][1][0] && y == diags[0][1][1]))) {
                console.log('test')
                r -= 1;
            }

            if (grid[y][x] == LEFTDIAG || grid[y][x] == RIGHTDIAG) {
                r -= 1;
            }

            if (d > 0 && betsMove.value <= r) {
                if (betsMove.value != r) {
                    betsMove.value = r;
                    betsMove.newpos = [x, y];

                    selMx = mx;
                    selMy = my;
                }
            }
        }
    }
    
    let x = betsMove.newpos[0];
    let y = betsMove.newpos[1];

    madiiPos[0] = x;
    madiiPos[1] = y;

    madii.direction = [selMx, selMy];
    madii.move = [cellW * selMx, cellH * selMy];
    madii.t = 0;

    // console.log(madii.move[0], madii.move[1])
    // console.log(lerp(cellW, 0, madii.t + 3 * delta) * madii.direction[0])
}

function countValidMoves(x, y) {
    let count = 0;

    for (let k in directions) {
        let mx = directions[k][0];
        let my = directions[k][1];

        let px = mx + x;
        let py = my + y;

        if (isMoveValid(px, py, mx, my)) {
            ++count;
        }
    }

    return count;
}

function distance(x1, x2, y1, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;

    return Math.sqrt(dx * dx + dy * dy);
}

function manhattanDist(x1, x2, y1, y2) {
    return Math.abs(x2- x1) + Math.abs(y2 - y1);
}

function isMadiiCaught() {
    return pos[0] == madiiPos[0] && pos[1] == madiiPos[1];
}

function controls() {
    document.addEventListener("mouseup", (e)=> {
        if (hero.move[0] == 0 && hero.move[1] == 0 && madii.move[0] == 0 && madii.move[1] == 0) {
            let mx = e.clientX - screenCenterX;
            let my = e.clientY - screenCenterY;

            resetAgents();

            let row = Math.floor(my / (cellW));
            let col = Math.floor(mx / (cellH));

            mx = col - pos[0]
            my = row - pos[1]

            moveOnClick(col, row, mx, my);
        }
    });
}

function draw() {
    let hw = cellW / 2;
    let hh = cellH / 2;

    for (let i = 0; i < ROWS; ++i) {
        for (let j = 0; j < COLS; ++j) {
            let x = j * cellW + screenCenterX;
            let y = i * cellH + screenCenterY;

            // ctx.strokeStyle = "#000";
            // ctx.strokeRect(x, y, cellW, cellH);
            
            if (grid[i][j] == BLOCKED) {
                // ctx.fillStyle = "#000";
                // ctx.fillRect(x, y, cellW, cellH);
            } else {
                let nx = x + hw;
                let ny = y + hh;

                ctx.beginPath();
                ctx.arc(nx, ny, 15, 0, 2 * Math.PI, false);
                ctx.fillStyle ='#10aad7';
                ctx.fill();
                

                ctx.strokeStyle = '#10aad7';
                ctx.lineWidth = 5;

                if (j + 1 < COLS && grid[i][j + 1] != BLOCKED) {
                    ctx.beginPath();
                    ctx.moveTo(nx, ny);
                    ctx.lineTo(nx + cellW, ny);
                    ctx.stroke();
                }

                if (i + 1 < ROWS && grid[i + 1][j] != BLOCKED) {
                    ctx.beginPath();
                    ctx.moveTo(nx, ny);
                    ctx.lineTo(nx, ny + cellH);
                    ctx.stroke();
                }
            }

            // if (i == pos[1] && j == pos[0]) {
            //     ctx.fillStyle = "#b3d23b";
            //     ctx.fillRect(x, y, cellW, cellH);
            // } else if (i == madiiPos[1] && j == madiiPos[0]) {
            //     ctx.fillStyle = "#f9a139";
            //     ctx.fillRect(x, y, cellW, cellH);
            // } 
        }
    }    


    let x = 1 * cellW + screenCenterX;
    let y = 6 * cellH + screenCenterY;

    let nx = x + hw;
    let ny = y + hh;

    ctx.beginPath();
    ctx.moveTo(nx, ny);
    ctx.lineTo(nx - cellW, ny - cellH);
    ctx.stroke();

    // ctx.fillStyle = "#f9a139";
    // ctx.fillRect(madiiPos[0] * cellW + centerX - madii.move[0], madiiPos[1] * cellH + centerY - madii.move[1], agentsDim, agentsDim);

    ctx.drawImage(madii.img, 0, 0, 400, 400, madiiPos[0] * cellW + centerX - madii.move[0] - madii.pulse, madiiPos[1] * cellH + centerY - madii.move[1] - madii.pulse, agentsDim + madii.pulse, agentsDim + madii.pulse)

    // ctx.fillStyle = "#b3d23b";
    // ctx.fillRect(pos[0] * cellW + centerX - hero.move[0], pos[1] * cellH + centerY - hero.move[1], agentsDim, agentsDim);

    ctx.drawImage(hero.img, 660, 300, 500, 370, pos[0] * cellW + centerX - hero.move[0], pos[1] * cellH + centerY - hero.move[1], agentsDim, 125 * agentScale)

    drawText();
}

function resetAgents() {
    hero.direction = [0, 0];
    hero.move = [0, 0];
    hero.t = 0;
    
    madii.direction = [0, 0];
    madii.move = [0, 0];
    madii.t = 0;

}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function update() {
    // placeholder
    moveAgent(hero);
    moveAgent(madii);

    madii.pulseT += 4 * delta;
    madii.pulse = Math.sin(madii.pulseT) * 2;
}

function moveAgent(agent) {
    let hx = Math.abs(agent.move[0]);
    let hy = Math.abs(agent.move[1]);

    if (hx || hy) {
        agent.t += 2.0 * delta;

        if (agent.t > 1.0) agent.t = 1.0;

        if (hx > 1) {
            agent.move[0] = lerp(cellW, 0, agent.t) * agent.direction[0];
        } else {
            agent.move[0] = 0;
        }
    
        if (hy > 1) {
            agent.move[1] = lerp(cellH, 0, agent.t) * agent.direction[1];
        } else {
            agent.move[1] = 0;
        }
    }
}

function drawText() {
    ctx.font = textSize + "px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Catching Madii", halfW - textCenter, halfH);
}

function gameCycle() {
    if (madii.isLoaded && hero.isLoaded) {
        let now = Date.now();
        delta = (now - last) / 1000;
        last = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        update();
        draw();
    }

    requestAnimationFrame(gameCycle);
}

main(document.documentElement.clientWidth, document.documentElement.clientHeight);