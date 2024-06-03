class Spirte {
    constructor(x, y, w, h, clipW, clipH) {
        this.x = x;
        this.y = y;
        this.ox = x;
        this.oy = y;
        this.w = w;
        this.h = h;

        this.clipX = 0;
        this.clipY = 0;
        this.clipW = clipW;
        this.clipH = clipH;

        this.t = 0;
        this.isAnimating = false;
    }

    draw(ctx, img) {
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);

        // ctx.beginPath();
        // ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 15.3125, 0, 2 * Math.PI);
        // ctx.stroke();
    }
}