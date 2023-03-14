const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');
const lm = new LevelManager();

var last = 0;
var delta = 0;
var halfW = 0;
var halfH = 0;
var scaleX = 1;
var scaleY = 1;
var screenCenterX = 0;
var screenCenterY = 0;

const EDGE_WEIGHT = 1;
const nodes = [];
const edges = [];

var selected = -1;

var blocks = [0, 1, 2];
var heroPos = [0, 1, 2];

var src = 6;

const hero = {
    img: null,
    loaded: false,
    dim: 125 / 2,
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,
};

const madii = {
    img: null,
    loaded: false,
    dim: 125 / 2,
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,
    mx: 0,
    my: 0,
    t: 0,
    moveTo : {
        x: 0,
        y: 0
    },
    isMoving: false
};

const heroes = [];
var isMoving = false;
var heroMoveIdx = 0;
var hasEscapePath = false;

var scale = 1;
var adjX = 0;
var adjY = 0;

var hpadding = 110;
var vpadding = 100;
var graphW = 0;
var graphH = 0;
var centerX = 0;
var centerY = 0;

var isWin = false;

// w - 980, h - 1687

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    if (h > w) {
        scaleX = 980 / w;
        scaleY = 1687 / h;
    } else {
        scaleX = 1;
        scaleY = 1;
    }

    let hw = w / 2;
    let hh = h / 2;

    halfW = hw;
    halfH = hh;

    hpadding *= scaleX;
    vpadding *= scaleY;

    lm.scaleX *= scaleX;
    lm.scaleY *= scaleY;

    lm.init();

    graphW = 350 * lm.scaleX + hpadding * 2;
    graphH = 600 * lm.scaleY + vpadding * 2;

    centerX = hw - graphW / 2 + lm.r * lm.scale;
    centerY = hh - graphH / 2 + lm.r * lm.scale;

    // alert(w + ' ' + hw + ' ' + graphW + ' ' + centerX)
    // centerX = hw;

    // console.log(w, centerX, graphW)

    lm.setLevel(0);
    setBlocks();

    lm.nodes[src].color = '#ff0000';
    
    hero.img = new Image();
    hero.img.src = 'assets/pusheenshades.png';
    hero.img.onload = function() {
        hero.loaded = true;
    }

    hero.cx = hero.dim / 2;
    hero.cy = hero.dim / 2;

    // madii
    madii.img = new Image();
    madii.img.src = 'assets/madii2.png';
    madii.img.onload = function() {
        madii.loaded = true;
    }

    madii.x = lm.nodes[src].x;
    madii.y = lm.nodes[src].y;
    madii.cx = madii.dim / 2;
    madii.cy = madii.dim / 2;
    //

    for (let i = 0; i < blocks.length; ++i) {
        heroes.push({
            x: lm.nodes[blocks[i]].x,
            y: lm.nodes[blocks[i]].y,
            mx: 0,
            my: 0,
            moveTo: {
                x: 0, 
                Y: 0
            },
            t: 0,
            isMoving: false
        });
    }

    controls();
    gameCycle();
}

function minDist(graph) {
    let min = Infinity;
    let minIndex = -1;

    for (let i = 0; i < graph.length; ++i) {
        if (!graph[i].visted && graph[i].g <= min) {
            min = graph[i].g;
            minIndex = i;
        }
    }

    return minIndex;
}

function nextLevel() {
    let l = (lm.level + 1) % lm.levels.length;
    lm.setLevel(l);

    blocks = [0, 1, 2];
    heroPos = [0, 1, 2];
    src = lm.levels[l].src;

    for (let i = 0; i < blocks.length; ++i) {
        heroes[i] = {
            x: lm.nodes[blocks[i]].x,
            y: lm.nodes[blocks[i]].y,
            mx: 0,
            my: 0,
            moveTo: {
                x: 0, 
                Y: 0
            },
            t: 0,
            isMoving: false
        };
    }
    
    selected = -1;
    isWin = false;
    madii.isMoving = false;

    setBlocks();
}

function setBlocks() {
    for (let i = 0; i < lm.nodes.length; ++i) {
        lm.nodes[i].blocked = false;
    }

    for (let i = 0; i < blocks.length; ++i) {
        lm.nodes[blocks[i]].blocked = true;
    }
}

function dijkstra(graph, source, destination) {
    hasEscapePath = false;

    if (graph.length) {
        var Q = [];

        setBlocks();

        graph.forEach(node => {
            node.g = Infinity;
            node.visited = false;
            // node.blocked = false;
            node.prev = null;
            Q.push(node);
            
        });

        Q[source].g = 0;


        while (Q.length) {
            let u = minDist(Q);
            
            if (u < 0) {
                break;
            }

            Q[u].visited = true;

            Q[u].edges.forEach(node => {
                let g = Q[u].g + EDGE_WEIGHT;
                if (!node.blocked && !node.visited && g < node.g) {
                    node.g = g;
                    node.prev = Q[u];
                }
            });

            // if (u == destination) break;

            Q.splice(u, 1);
        }
    }

    if (graph[destination].prev == null) {
        let len = graph[source].edges.length;

        if (len) {
            let rng = [...Array(len).keys()];
            shuffle(rng);

            let hasPaths = false;
            let r = [];

            for (let i = 0; i < rng.length; ++i) {
                let idx = rng[i];

                if (!graph[source].edges[idx].blocked) {
                    
                    // graph[src].color = '#10aad7';
                    // src = graph[source].edges[idx].id;
                    // // graph[source].edges[idx].color = '#ff0000';
                    // graph[src].color = '#ff0000';
                    hasPaths = true;
                    r[0] = graph[source].edges[idx];
                    break;
                }
            }

            
            if (!hasPaths) {
                console.log('You trapped Madii!');
                // return [];
                isWin = true;
                
            }

            
            return r;
        }
    } else {
        const dist = [];

        print(graph[destination], dist);
        hasEscapePath = true;
        return dist;
        // console.log(dist)
        // if (dist.length > 1) {
        //     graph[src].color = '#10aad7';
        //     src = dist[0].id;
        //     dist[0].color = '#ff0000';
        // } else {
        //     graph[src].color = '#10aad7';
        //     src = dist[0].id;
        //     dist[0].color = '#ff0000';
        // }

        // if (src < 3) {
        //     console.log('madii escaped!')
        // }
        // // console.log(dist);
        // dist.forEach(node => {
        //     node.color = '#ff0000';
        // });
    }
    
    return [];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function print(node, dist) {
    if (node != null && node.id != src) {
        print(node.prev, dist);
        dist.push(node);
        // console.log(node.id)
    }
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function distance(x1, x2, y1, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;

    return Math.sqrt(dx * dx + dy * dy);
}

function controls() {
    document.addEventListener("mouseup", (e)=> {
        let mx = e.clientX;
        let my = e.clientY;

        for (let i = 0; i < lm.nodes.length; ++i) {
            let dist = distance(lm.nodes[i].x + centerX, mx, lm.nodes[i].y + centerY, my);
            if (dist < lm.r * 3) {
                if (lm.nodes[i].blocked) {
                    selected = i;
                } else {
                    if (selected >= 0 && i != src) {
                        for (let j = 0; j < lm.nodes[selected].edges.length; ++j) {
                            if (lm.nodes[i].id == lm.nodes[selected].edges[j].id) {
                                heroMoveIdx = blocks.indexOf(selected);
                                heroes[heroMoveIdx].isMoving = isMoving = true;
                                heroes[heroMoveIdx].t = 0;
                                heroes[heroMoveIdx].moveTo.x = lm.nodes[i].x - heroes[heroMoveIdx].x;
                                heroes[heroMoveIdx].moveTo.y = lm.nodes[i].y - heroes[heroMoveIdx].y;
                                blocks[heroMoveIdx] = i;

                                lm.nodes[i].blocked = true;
                                lm.nodes[selected].blocked = false;
                                selected = i;

                                // blocks = [];
                                // lm.nodes.forEach((node, i) => {
                                //     if (node.blocked) {
                                //         blocks.push(i)
                                //     }
                                // });

                                let rng = [0, 1, 2];
                                shuffle(rng);

                                var newDist = {
                                    hasEscape: false,
                                    nodes: []
                                };

                                for (let k = 0; k < rng.length; ++k) {
                                    // if (!lm.nodes[rng[k]].blocked) {
                                        
                                        let r = dijkstra(lm.nodes, src, rng[k]);
                                        if (isWin) {
                                            alert('you won')
                                            nextLevel();
                                            return;
                                        }
                                            
                                        
                                        if (newDist.nodes.length == 0) {
                                            newDist.nodes = [...r];
                                            newDist.hasEscape = hasEscapePath;
                                        } else if (hasEscapePath) {
                                            if (r.length < newDist.nodes.length || !newDist.hasEscape) {
                                                newDist.nodes = [...r];
                                                newDist.hasEscape = hasEscapePath;
                                            }
                                        } else {
                                            if (!newDist.hasEscape) {
                                                newDist.nodes = [...r];
                                                newDist.hasEscape = hasEscapePath;
                                            }
                                        }
                                    // }
                                }

                                //
                                // console.log(newDist)
                                if (newDist.nodes.length > 0) {
                                    lm.nodes[src].color = '#10aad7';
                                    src = newDist.nodes[0].id;
                                    newDist.nodes[0].color = '#ff0000';

                                    madii.isMoving = true;
                                    madii.t = 0;
                                    madii.moveTo.x = newDist.nodes[0].x - madii.x;
                                    madii.moveTo.y = newDist.nodes[0].y - madii.y;
                                }

                                if (src < 3) {
                                    console.log('madii escaped!')
                                    alert('madii escaped!');
                                    location.href = '';
                                }
                                //

                                break;
                            }
                        }

                        
                    }
                }

                break;
            }
        }
    });
}

function draw() {
    ctx.drawImage(madii.img, 0, 0, 400, 400, madii.x - madii.cx + madii.mx + centerX, madii.y - madii.cy + madii.my + centerY, madii.dim, madii.dim);
    // ctx.drawImage(madii.img, 0, 0, 400, 400, madii.x - madii.cx , madii.y - madii.cy , madii.dim, madii.dim);

    heroes.forEach(h => {
        // ctx.drawImage(hero.img, 660, 300, 500, 370, h.x - hero.cx + h.mx + centerX, h.y - hero.cy + h.my + centerY, hero.dim, hero.dim)
        ctx.drawImage(hero.img, 0, 0, 874, 996, h.x - hero.cx + h.mx + centerX, h.y - hero.cy + h.my + centerY, hero.dim, hero.dim)
    });
}

function update() {
    let h = heroes[heroMoveIdx];

    if (h.isMoving) {
        if (h.t > 1.0) {
            h.isMoving = isMoving = false;
            h.t = 1.0;
            h.x += h.mx;
            h.y += h.my;
            h.mx = 0;
            h.my = 0;
        }

        if (h.t < 1.0) {
            h.t += 2 * delta;
            h.mx = lerp(0, h.moveTo.x, h.t);
            h.my = lerp(0, h.moveTo.y, h.t);
        }
    }

    if (madii.isMoving) {
        if (madii.t > 1.0) {
            madii.isMoving = false;
            madii.t = 1.0;
            madii.x += madii.mx;
            madii.y += madii.my;
            madii.mx = 0;
            madii.my = 0;
        }

        if (madii.t < 1.0) {
            madii.t += 2 * delta;
            madii.mx = lerp(0, madii.moveTo.x, madii.t);
            madii.my = lerp(0, madii.moveTo.y, madii.t);
        }
    }
}



function gameCycle() {
    if (hero.loaded && madii.loaded) {
        let now = Date.now();
        delta = (now - last) / 1000;
        last = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        update();

        lm.draw(ctx, selected, centerX, centerY);
        draw();
    }

    requestAnimationFrame(gameCycle);
}

main(document.documentElement.clientWidth, document.documentElement.clientHeight);