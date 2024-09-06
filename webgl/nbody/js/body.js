class Body {
    constructor(x, y, z, vx, vy, vz, mass) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        this.ax = 0;
        this.ay = 0;
        this.az = 0;
        this.mass = mass;

        this.r = Math.sqrt(mass) * 10;
    }

    applyForce(f) {
        this.ax = f.x / this.mass;
        this.ay = f.y / this.mass;
        this.az = f.z / this.mass;
    }

    update(speed, delta) {
        // console.log(this.x, this.y, this.vx, this.vy)
        this.vx += this.ax;
        this.vy += this.ay;
        this.vz += this.az;
        this.x += this.vx * speed * delta;
        this.y += this.vy * speed * delta;
        this.z += this.vz * speed * delta;
        this.ax = 0;
        this.ay = 0;
        this.az = 0;
    }
 }