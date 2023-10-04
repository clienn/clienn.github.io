class StaticSprite {
    constructor(x, y, w, h, clipX, clipY, clipW, clipH, imgID) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.ox = x;
        this.oy = y;

        this.clipX = clipX;
        this.clipY = clipY;
        this.clipW = clipW;
        this.clipH = clipH;
        this.imgID = imgID;
    }

    resetOX() {
        this.ox = this.x;
        this.oy = this.y;
    }

    draw(ctx) {
        ctx.drawImage(AM.images[this.imgID].img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);
    }

    dynamicDraw(ctx, x, y, w, h, cw, ch, imgID) {
        ctx.drawImage(AM.images[imgID].img, this.clipX, this.clipY, cw, ch, x, y, w, h);
    }

    drawRotate(ctx, degrees) {
        ctx.save();
        // Untransformed draw position
        const position = {x: this.x, y: this.y};
        // In degrees
        const rotation = { x: 0, y: 0, z: degrees};
        // Rotation relative to here (this is the center of the image)
        const rotPt = { x: this.w / 2, y: this.h / 2 };

        ctx.setTransform(new DOMMatrix()
            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
            .rotateSelf(rotation.x, rotation.y, rotation.z)
        );
        
        ctx.drawImage(AM.images[this.imgID].img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
        ctx.restore();
    }
}