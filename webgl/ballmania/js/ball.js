class Ball {
    constructor() {
        this.x = Math.random() * (Math.random() < 0.5 ? -1 : 1);
        this.y = Math.random() + 1.5;
        this.color = [Math.random(), Math.random(), Math.random()];
        this.radius = Math.max(0.035, Math.random() * 1.5 / 10);

        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.fx = Math.random() / 100 * this.direction;
        this.fy = 0.0;

        this.restitution = Math.max(0.025, Math.random() / 10);
        this.hasBounced = false;
    }

    addForce(fx, fy) {
        this.fx += fx;
        this.fy += fy;
    }

    setForce(fx, fy) {
        this.fx = fx;
        this.fy = fy;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    reset() {
        this.x = Math.random() * (Math.random() < 0.5 ? -1 : 1);
        this.y = Math.random() + 1.5;
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.fx = Math.random() / 100 * this.direction;
        this.fy = 0.0;
        this.hasBounced = false;
    }

    move() {
        this.x += this.fx;
        this.y += this.fy;
    }
}