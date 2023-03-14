class LevelManager {
    constructor() {
        this.nodes = [];
        this.edges = [];
        this.r = 10;

        this.scale = 1.5;
        this.scaleX = 1;
        this.scaleY = 1;
        
        this.level = 0;

        this.levels = [
            {
                nodes: [
                    [110, 100, this.r], [260, 100, this.r], [410, 100, this.r], 
                    [185, 300, this.r], [260, 300, this.r], [335, 300, this.r], 
                    [260, 500, this.r]
                ],
                edges: [
                    [0, 1], [0, 3], [1, 2], [1, 4], [2, 5], [3, 4], [3, 6], [4, 5], [4, 6], [5, 6]
                ],
                src: 6,
            },
            {
                nodes: [
                    [110, 100, this.r], [260, 100, this.r], [410, 100, this.r], 
                    [185, 300, this.r], [260, 300, this.r], [335, 300, this.r], 
                    [110, 400, this.r], [260, 500, this.r], [410, 400, this.r]
                ],
                edges: [
                    [0, 1], [0, 3], [1, 2], [1, 4], [2, 5], [3, 4], [3, 6], [4, 5], [4, 6], [4, 7], [4, 8], [5, 8], [6, 7], [7, 8]
                ],
                src: 7
            }
        ];
    }

    init() {
        this.levels.forEach(level => {
            for (let i = 0; i < level.nodes.length; ++i) {
                level.nodes[i][0] *= this.scaleX;
                level.nodes[i][1] *= this.scaleY;
                level.nodes[i][2] *= this.scale;
            }
        });
    }

    setLevel(n) {
        this.nodes = [];
        this.edges = [];

        this.levels[n].nodes.forEach((node, i) => {
            this.nodes.push(new Node(i, node[0], node[1], node[2]));
        });

        this.levels[n].edges.forEach(edge => {
            this.nodes[edge[0]].connect(this.nodes[edge[1]]);
            this.edges.push(edge);
        });

        this.level = n;
    }

    draw(ctx, selected, centerX, centerY) {
        ctx.strokeStyle = '#10aad7';
        ctx.lineWidth = 5;
    
        this.edges.forEach(edge => {
            let p1 = edge[0];
            let p2 = edge[1];
    
            ctx.beginPath();
            ctx.moveTo(this.nodes[p1].x + centerX, this.nodes[p1].y + centerY);
            ctx.lineTo(this.nodes[p2].x + centerX, this.nodes[p2].y + centerY);
            ctx.stroke();
        });

        this.nodes.forEach((node, i) => {
            ctx.beginPath();
            ctx.arc(node.x + centerX, node.y + centerY, node.r, 0, 2 * Math.PI, false);
            if (selected == i) {
                ctx.fillStyle = '#00ff00';
            } else if (node.blocked) {
                ctx.fillStyle = '#0000ff';
            } else {
                ctx.fillStyle = node.color;
            }
            
            ctx.fill();

            if (selected == i) {
                ctx.strokeStyle = '#ff0000';
                ctx.beginPath();
                ctx.arc(node.x + centerX, node.y + centerY, this.r * 4, 0, 2 * Math.PI, false);
                ctx.stroke();
            }
        });
    }
}