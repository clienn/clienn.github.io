class Sprite {
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

        this.vx = 0;
        this.vy = 0;

        this.id = 0;
        this.key = '';

        this.degrees = 0;

        this.t = 0;
        this.yRotate = 0;
        this.zRotate = 0;
        
    }


    draw(ctx, img) {
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);
    }

    update(delta, speed) {
        this.x += this.vx * delta * speed;
        this.y += this.vy * delta * speed;
    }

    drawWithRotation(ctx, img) {        
        this.degrees = this.zRotate;

        ctx.save();
        // Untransformed draw position
        const position = {x: this.x, y: this.y};
        // In degrees
        const rotation = { x: 0, y: 0, z: this.zRotate};
        // Rotation relative to here (this is the center of the image)
        const rotPt = { x: this.w / 2, y: this.h / 2 };
        // const rotPt = { x: rx, y: ry };

        ctx.setTransform(new DOMMatrix()
            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
            .rotateSelf(rotation.x, rotation.y, rotation.z)
        );
        
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
        ctx.restore();
    }
}