class Node {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.edges = [];
    }

    connect(node) {
        this.edges.push(node);
    }
}