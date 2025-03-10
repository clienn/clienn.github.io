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

        this.degrees = 0;

        this.t = 0;
        this.t2 = 0;
        this.isAnimating = false;

        this.goto = null;
        this.moveDestinations = [];
        this.trail = [];

        this.facing = 0; // -1 = left, 1 = right
        this.yRotate = 0;
        this.zRotate = 0;
        this.flippingSpeed = 0;

        this.prevY = y;
        this.waveHeight = 150;

        this.tmp = 1;
        this.dest = [];
    }

    setDirection(d) {
        this.facing = d;

        if (d > 0) {
            this.yRotate = 180;
            this.zRotate = 0;
        } else {
            this.yRotate = 0;
            this.zRotate = 180;
        }
    }

    smartSwim(ctx, img) {
        // this.prevY = this.y;
        this.x = lerp(this.ox, this.dest[0], this.t);
        this.y = lerp(this.oy, this.dest[1], this.t);
        

        let dx = this.x - this.dest[0];
        let dy = this.y - this.dest[1];

        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 10) {
            this.ox = this.x;
            this.oy = this.y;
            this.prevY = this.y;

           

            let mulX = Math.floor(Math.random() * 2) ? 1 : -1;
            let mulY = Math.floor(Math.random() * 2) ? 1 : -1;

            let rngX = Math.floor(Math.random() * canvas.width) + canvas.width / 2 * mulX;
            let rngY = Math.floor(Math.random() * canvas.height) + canvas.height / 2 * mulY;

            this.dest = [rngX, rngY];

            // let d = rngX - this.x;
            if (this.x < rngX) {
                this.setDirection(1);
            } else {
                this.setDirection(-1);
            }

            this.t = 0;
            this.t2 = 0;
        }

        let angle = Math.atan2(this.y - this.oy, this.x - this.ox) * 180 / Math.PI;

        ctx.save();
        // Untransformed draw position
        const position = {x: this.x, y: this.y};
        // In degrees
        const rotation = { x: 0, y: Math.sin(this.t2) * this.flippingSpeed + this.yRotate, z: angle + this.zRotate};
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
    }

    swim(ctx, img) {
        ctx.save();
        // Untransformed draw position
        const position = {x: this.x, y: this.y};
        // In degrees
        const rotation = { x: 0, y: Math.sin(this.t) * this.flippingSpeed + this.yRotate, z: 0};
        // Rotation relative to here (this is the center of the image)
        const rotPt = { x: this.w / 2, y: this.h / 2 };

        ctx.setTransform(new DOMMatrix()
            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
            .rotateSelf(rotation.x, rotation.y, rotation.z)
        );
        
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
        ctx.restore();
    }

    dive(ctx, img) {
        let angle = Math.atan2(this.y - this.prevY, this.x - this.ox) * 180 / Math.PI;

        ctx.save();
        // Untransformed draw position
        const position = {x: this.x, y: this.y};
        // In degrees
        const rotation = { x: 0, y: Math.sin(this.t) * this.flippingSpeed + this.yRotate, z: angle + this.zRotate};
        // Rotation relative to here (this is the center of the image)
        const rotPt = { x: this.w / 2, y: this.h / 2 };

        ctx.setTransform(new DOMMatrix()
            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
            .rotateSelf(rotation.x, rotation.y, rotation.z)
        );
        
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
        ctx.restore();
    }

    mutateFish(id, w, h, cw, ch, d) {
        this.id = id;
        this.w = w;
        this.h = h;
        this.clipW = cw;
        this.clipH = ch;
        this.setDirection(d);
    }

    morph(id, w, h, cw, ch) {
        this.id = id;
        this.w = w;
        this.h = h;
        this.clipW = cw;
        this.clipH = ch;
    }

    setRandomSpeed(limit, minSpeed) {
        this.vx = Math.floor(Math.random() * limit) + minSpeed;
        this.flippingSpeed = Math.min(this.vx, 25);
        this.vx *= this.facing;
    }

    update(delta, speed) {
        this.ox = this.x;
        this.x += this.vx * delta * speed;
        this.y += this.vy * delta;
    }

    sineMovement(delta) {
        this.t2 += 1 * delta;
        this.prevY = this.y;
        this.y = this.oy + Math.sin(this.t2) * this.waveHeight;
        
        // this.degrees = 200 * Math.cos(this.t2) * 0.5;
        // this.degrees = a*b*cos(b*x)
    }

    dynamicdraw(ctx, img, x, y, w, h, cw, ch) {
        ctx.drawImage(img, 0, 0, cw, ch, x, y, w, h);
    }
}