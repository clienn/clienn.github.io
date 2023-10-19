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
        this.t3 = 0;

        this.direction = 1;
        this.density = this.w / 2;
        this.yRotate = 0;
        this.frames = 1;
        this.currFrame = 0;
        this.startAnimation = false;

        this.prevY = y;
        this.prevX = x;
        this.zRotate = 0;
    }

    animateSprite(speed, delta) {
        if (this.startAnimation) {
            if (this.currFrame == this.frames - 1) {
                this.startAnimation = false;
                this.clipX = 0;
                this.t3 = 0;
                this.currFrame = 0;
            } else {
                this.t3 += speed * delta;
                this.currFrame = Math.floor(this.t3) % this.frames;
                
                this.clipX = this.currFrame * this.clipW;
            }
        }
        
    }

    dive(ctx, img) {
        let angle = Math.atan2(this.y - this.oy, this.x - this.ox) * 180 / Math.PI;

        ctx.save();
        // Untransformed draw position
        const position = {x: this.x, y: this.y};
        // In degrees
        const rotation = { x: 0, y: 0, z: angle + this.zRotate};
        // Rotation relative to here (this is the center of the image)
        const rotPt = { x: this.w / 2, y: this.h / 2 };

        ctx.setTransform(new DOMMatrix()
            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
            .rotateSelf(rotation.x, rotation.y, rotation.z)
        );
        
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
        ctx.restore();
    }

    draw(ctx, img) {
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);

        // ctx.beginPath();
        // ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 15.3125, 0, 2 * Math.PI);
        // ctx.stroke();
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

    update(delta, g, projectileRanges) {
        // delta *= 0.2;
        this.vy = (2 * this.fx) / this.x;

        this.fy += (this.vy + g);

        this.x += this.fx * delta;
        this.y += this.fy * delta;
        this.prevX = this.x;
        this.prevY = this.y;

        // this.fy += g;

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
        this.prevY = this.oy;
        this.fx = (Math.random() * ranges.x[0] + ranges.x[1]) * this.direction;
        this.fy = -(Math.random() * ranges.y[0] + ranges.y[1]);
        this.vx = 0;
        this.vy = 0;
    }
}