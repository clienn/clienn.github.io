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
        this.t3 = 0;
        this.isAnimating = false;

        this.goto = [];
        this.moveDestinations = [];
        this.trail = [];

        this.facing = 0; // -1 = left, 1 = right
        this.yRotate = 0;
        this.zRotate = 0;
        this.flippingSpeed = 5;

        this.prevY = y;
        this.waveHeight = 150;

        this.tmp = 1;
        this.dest = [];

        this.show = true;
        this.frames = 1;
    }

    setFrames(frames) {
        this.frames = frames;
        this.clipW = this.w / frames;
        this.w = this.clipW;
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
        let frame = Math.floor(this.t3) % this.frames;

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
        
        ctx.drawImage(img, this.clipW * frame, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
        ctx.restore();
    }

    
    draw(ctx, img) {
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);
    }

    extend(ox, oy, px, py) {
        let a = Math.atan2(oy - py, ox - px);
        let angle = Math.atan2(oy - py, ox - px) * 180 / Math.PI - 90;
        
        // if (angle >= 105) angle -= 90;
        // else angle -= 90;
        
        // if (angle > 80) angle = 80;
        // else if (angle < -80) angle = -80;

        this.degrees = angle;

        // let flipAngle = a;
        let mul = -10;
        this.vx = Math.cos(a) * mul;
        this.vy = Math.sin(a) * mul;

        
        
        return a;
    }

    reset() {
        this.x = this.ox;
        this.y = this.oy;
        this.vx = 0;
        this.vy = 0;
        this.degrees = 0;
        
    }

    animateExtension() {
 
    }

    updatePos(delta, speed) {
        this.x += this.vx * delta * speed;
        this.y += this.vy * delta * speed;
    }

    drawWithRotation(ctx, img, rx, ry) {
        // let angle = Math.atan2(oy - py, ox - px) * 180 / Math.PI;
        // if (angle >= 105) angle -= 90;
        // else angle -= 90;
        
        // if (angle > 80) angle = 80;
        // else if (angle < -80) angle = -80;

        ctx.save();
        // Untransformed draw position
        const position = {x: this.x, y: this.y};
        // In degrees
        const rotation = { x: 0, y: 0, z: this.degrees};
        // Rotation relative to here (this is the center of the image)
        // const rotPt = { x: this.w / 2, y: this.h / 2 };
        const rotPt = { x: rx, y: ry };

        ctx.setTransform(new DOMMatrix()
            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
            .rotateSelf(rotation.x, rotation.y, rotation.z)
        );
        
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
        ctx.restore();
    }

    swim(ctx, img) {
        let frame = Math.floor(this.t) % this.frames;
        // console.log(frame * this.cw);
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
        
        ctx.drawImage(img, frame * this.clipW, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
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

    moveEel(w, delta, hitbox, callback) {
        this.x += this.vx * delta;
        // add friction
        // this.vx *= friction;

        // if (this.x + this.w > w) {
        //     this.x = w - this.w;
        //     this.vx = 0;
        // } else if (this.x < 0) {
        //     this.x = 0;
        //     this.vx = 0;
        // }

        if (callback) {
            callback();
        }

        if (hitbox.x + hitbox.w > w) {
            this.x = w - (this.w / 2 + hitbox.w / 2);
            this.vx = 0;
            // console.log(this.x)
        } else if (hitbox.x < 0) {
            this.x = -(this.w / 2 - hitbox.w / 2);
            
            this.vx = 0;
        }
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