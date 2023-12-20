class StaticSprite {
    constructor(x, y, w, h, clipX, clipY, clipW, clipH, imgID) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.clipX = clipX;
        this.clipY = clipY;
        this.clipW = clipW;
        this.clipH = clipH;
        this.imgID = imgID;
    }

    draw(ctx) {
        ctx.drawImage(AM.images[this.imgID].img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);
    }
}