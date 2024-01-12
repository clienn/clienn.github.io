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
        this.key = 0;

        this.dropSpeed = 1;
        this.dropSine = 0;
        this.restitution = 0;
        this.degrees = 0;
        this.dropDist = 0;

        this.t = 0;
        this.rotationT = 0;
        this.isAnimating = false;
    }

    setPos(x, y) {
        this.x = x;
        this.ox = x;
        this.y = y;
        this.oy = y;
    }

    addForce(f, delta, thresh) {
        this.vx += f * delta;
        if (this.vx > thresh) {
            this.vx = thresh;
        } else if (this.vx < -thresh) {
            this.vx = -thresh;
        }
    }

    update(w, delta, friction) {
        this.x += this.vx;
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

    draw(ctx, img) {
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);

        // ctx.beginPath();
        // ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 15.3125, 0, 2 * Math.PI);
        // ctx.stroke();
    }
}