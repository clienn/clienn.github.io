class Spirte {
    constructor(x, y, w, h, clipW, clipH, id) {
        this.x = x;
        this.y = y;
        this.ox = x;
        this.oy = y;
        this.w = w;
        this.h = h;
        this.ow = w;
        this.oh = h;
        this.clipX = 0;
        this.clipY = 0;
        this.clipW = clipW;
        this.clipH = clipH;
        this.obj = {};
        this.id = id;

        this.vx = 0;
        this.vy = 0;
        this.fx = 0;
        this.fy = 0;
        this.t = 0;
        this.t2 = 0;

        this.direction = 1;
        this.density = this.w / 2;
    }

    draw(ctx, img) {
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);

        // ctx.beginPath();
        // ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 15.3125, 0, 2 * Math.PI);
        // ctx.stroke();
    }

    update(delta, g, projectileRanges) {
        // delta *= 0.2;
        this.vy = (2 * this.fx) / this.x;

        this.fy += (this.vy + g) * delta;

        this.x += this.fx * delta;
        this.y += this.fy * delta;

        this.fy += g;

        if (this.y > 1000) {
            
            this.init(projectileRanges);
            return 1;
        }

        return 0;
    }

    updateSprite(w, h, clipW, clipH, clipX, clipY, id) {
        this.w = w;
        this.h = h;
        this.clipW = clipW;
        this.clipH = clipH;
        this.clipX = clipX;
        this.clipY = clipY;
        this.id = id;
    }

    floatAnim(delta) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
    }

    init(ranges) {
        this.x = this.ox;
        this.y = this.oy;
        this.fx = (Math.random() * ranges.x[0] + ranges.x[1]) * this.direction;
        this.fy = -(Math.random() * ranges.y[0] + ranges.y[1]);
        this.vx = 0;
        this.vy = 0;
    }
}