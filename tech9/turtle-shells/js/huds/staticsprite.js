class StaticSprite {
    constructor(x, y, w, h, imgID) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.imgID = imgID;
    }

    draw(ctx, imgInfo) {
        ctx.drawImage(imgInfo.img, 0, 0, imgInfo.clipW, imgInfo.clipH, this.x, this.y, this.w, this.h);
    }
}