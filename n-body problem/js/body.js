class Body {
    constructor(x, y, vx, vy, mass, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = 0;
        this.ay = 0;
        this.mass = mass;
        this.color = color;

        this.r = Math.sqrt(mass) * 10;
    }

    applyForce(f, delta) {

        this.ax = f.x / this.mass;
        this.ay = f.y / this.mass;
    }

    update(speed) {
        // console.log(this.x, this.y, this.vx, this.vy)
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
        this.ax = 0;
        this.ay = 0;
    }

    draw(ctx) {
        const { x, y, r, color } = this;

        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
 }