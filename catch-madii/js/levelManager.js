class LevelManager {
    constructor(w, h) {
        // placeholder
        this.nodes = [];
        this.wallPadding = 50;
        this.padding = 100;
        this.radius = 5;

        let maxW = w - this.wallPadding * 2;
        let maxH = h - this.wallPadding * 2;

        this.rows = Math.floor(maxH / this.padding);
        this.cols = Math.floor(maxW / this.padding);
    }

    populate() {
        for (let i = 0; i < 2; ++i) {
            for (let j = 0; j < 2; ++j) {
                const node = new Node(j * this.padding + this.wallPadding, i * this.padding + this.wallPadding, this.radius);
                this.nodes.push(node);
            }
        }

        for (let i = 0; i < this.cols - 1; ++i) {
            let sx = 2 + i;
            const top = new Node(sx * this.padding + this.wallPadding, this.wallPadding, this.radius); // top
            const bottom = new Node(sx * this.padding + this.wallPadding, this.padding + this.wallPadding, this.radius); // bottom

            this.nodes.push(top);
            this.nodes.push(bottom);
        }
    }

    draw(ctx) {
        this.nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r, 0, 2 * Math.PI, false);
            ctx.fillStyle = "#10aad7";
            ctx.fill();
        });
    }
}