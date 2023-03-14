class Node {
    constructor(id, x, y, r) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = '#10aad7';
        this.g = 0;
        this.visited = false;
        this.blocked = false;
        this.prev = null;
        this.edges = [];
        
    }

    connect(node) {
        this.edges.push(node);
        node.edges.push(this);
    }
}