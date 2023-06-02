class Shape {
    constructor(id, w, h, x, y) {
        this.id = id;
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.ox = x;
        this.oy = y;
        this.cx = 0;
        this.cy = 0;
    }

    draw(ctx, img, w, h) {
        ctx.drawImage(img, 0, 0, this.w, this.h, this.x, this.y, w, h);
    }

    shuffle(x, y) {
        this.x = x;
        this.ox = x;
        this.y = y;
        this.oy = y;
       
    }
}