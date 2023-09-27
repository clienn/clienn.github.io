class Sprite {
    constructor(x, y, w, h, clipW, clipH) {
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

        this.vx = 0;
        this.vy = 0;

        this.id = 0;

        this.dropSpeed = 1;
        this.dropSine = 0;
        this.restitution = 0;
        this.degrees = 0;
        this.dropDist = 0;

        this.t = 0;
        this.t2 = 0;
        this.rotationT = 0;
        this.isAnimating = false;
        this.yRotate = 0;
    }

    addForce(f, delta, thresh) {
        // this.vx += f * delta;
        // if (this.vx > thresh) {
        //     this.vx = thresh;
        // } else if (this.vx < -thresh) {
        //     this.vx = -thresh;
        // }
        this.vx = f;
    }

    update(w, delta, friction) {
        this.x += this.vx * delta;
        // add friction
        this.vx *= friction;


        if (this.x + this.w > w) {
            this.x = w - this.w;
            this.vx = 0;
        } else if (this.x < 0) {
            this.x = 0;
            this.vx = 0;
        }

        
    }

    drawRotate(ctx, img) {
        ctx.save();
        // Untransformed draw position
        const position = {x: this.x, y: this.y};
        // In degrees
        const rotation = { x: 0, y: this.yRotate, z: 0};
        // Rotation relative to here (this is the center of the image)
        const rotPt = { x: this.w / 2, y: this.h / 2 };

        ctx.setTransform(new DOMMatrix()
            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
            .rotateSelf(rotation.x, rotation.y, rotation.z)
        );
        
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
        ctx.restore();
    }

    dynamicDrawRotate(ctx, img, clipW, clipH) {
        ctx.save();
        // Untransformed draw position
        const position = {x: this.x, y: this.y};
        // In degrees
        const rotation = { x: 0, y: this.yRotate, z: 0};
        // Rotation relative to here (this is the center of the image)
        const rotPt = { x: this.w / 2, y: this.h / 2 };

        ctx.setTransform(new DOMMatrix()
            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
            .rotateSelf(rotation.x, rotation.y, rotation.z)
        );
        
        ctx.drawImage(img, this.clipX, this.clipY, clipW, clipH, -rotPt.x, -rotPt.y, this.w, this.h);
        ctx.restore();
    }

    draw(ctx, img) {
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);

        // ctx.beginPath();
        // ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 15.3125, 0, 2 * Math.PI);
        // ctx.stroke();
    }
}