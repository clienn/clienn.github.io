class StaticSprite {
    constructor(x, y, w, h, clipX, clipY, clipW, clipH, imgID) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.ox = x;
        this.oy = y;
        this.ow = w;
        this.oh = h;

        this.clipX = clipX;
        this.clipY = clipY;
        this.clipW = clipW;
        this.clipH = clipH;
        this.imgID = imgID;
    }

    draw(ctx) {
        ctx.drawImage(AM.images[this.imgID].img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);
    }

    dynamicDraw(ctx, x, y, w, h, cw, ch, imgID) {
        ctx.drawImage(AM.images[imgID].img, this.clipX, this.clipY, cw, ch, x, y, w, h);
    }
}