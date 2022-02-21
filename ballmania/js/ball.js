class Ball {
    constructor(color, stroke, bounds = { x: 0, y : 0 }) {
        const bounceThreshold = 40;

        this.radius = Math.max(this.getRNG() / 100 * 60, 10);
        this.color = color;
        this.stroke = stroke;

        this.resetX = -this.radius;
        this.resetY = -this.radius;

        this.bounds = {
            x: bounds.x + this.radius,
            y: bounds.y - this.radius,
        }

        this.direction = this.getRNG() > 50 ? 1 : -1;

        this.x = this.direction > 0 ? 0 : this.bounds.x;
        this.y = this.resetY;

        this.fx = 0;
        this.fy = 0;

        this.speed = 0.0005 * this.direction;
        this.speedX = this.speed;

        this.restitutionX = 0;
        this.restitutionY = 1;

        let randomBounceForce = Math.max(this.getRNG() / 100 * 60, 10);
        this.bounceForce = -(bounceThreshold - randomBounceForce / 2);
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    addForce(fx, fy) {
        this.fx += fx;
        this.fy += fy;
    }

    setVelocity(fx, fy) {
        this.fx = fx;
        this.fy = fy;
    }

    getBounds() {
        return this.bounds;
    }
    
    move() {
        this.x += this.fx;
        this.y += this.fy;
    }

    bounce() {
        this.setPos(this.x, this.bounds.y);
        this.setVelocity(this.fx * this.restitutionX, this.fy * this.restitutionY);
        this.addForce(0, this.bounceForce);
    }

    reset() {
        let rng = this.getRNG() / 100;
        let percentage = rng / 100;
        let newPosX = this.direction > 0 ? this.bounds.x * percentage : this.bounds.x;

        this.setPos(newPosX, this.resetY);

        this.speedX = this.speed * rng;
        this.restitutionX = rng;
    }

    getRNG() {
        return Math.floor(Math.random() * 101 + 1);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.stroke;
        ctx.stroke();
    }
}