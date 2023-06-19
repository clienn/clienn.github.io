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
        this.t = 0;
        this.et = 0;
        
        this.directionX = 0;
        this.directionY = 0;
        this.pattern = 0;
        this.t2 = 0;

        this.tmpX = x;
        this.tmpY = y;

        this.range = 300;
        this.rangeX = 300;
        this.rot = 100;

        this.isAnimating = false;
    }

    draw(ctx, img, isAngry) {
        if (isAngry) {
            ctx.drawImage(img, this.clipX, this.clipY, 895, 979, this.x, this.y, this.w, this.h);
        } else {
            ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);
        }
        // ctx.beginPath();
        // ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 15.3125, 0, 2 * Math.PI);
        // ctx.stroke();
    }

    move(dx, dy, pattern) {
        this.directionX = dx;
        this.directionY = dy;
        this.pattern = pattern;
        this.t = 0;
        this.t2 = 0;
    }

    update(speed, shuffleDuration, delta, bounds) {
        if (this.t < shuffleDuration + 5) {
            this.t += speed * delta;

            if (this.t < shuffleDuration) {
                this.t2 += speed * delta;

                if (Math.floor(this.t2) % 30 == 0) {
                    this.t2++;
                    this.pattern = Math.floor(Math.random() * 2) + 1;
                    // this.rot = Math.floor(Math.random() * 3 + 1) + 100;
                    this.range = Math.floor(Math.random() * 4 + 4) * 200;


                    // let rotX = bounds.right - this.x;
                    // let rotY = bounds.bottom - this.y;

                    // this.rot = Math.min(this.rot, rotX, rotY);
                }
                
                
                // let ax = Math.sin(this.t);
                // let ay = Math.cos(this.t);
                
                // this.x = this.ox + ax * 500;
                // this.y = this.oy + ay * 100;

                let ax = Math.sin(this.t);
                let ay = Math.cos(this.t);
                
                if (this.pattern == 1) {
                    this.x += this.rangeX * this.directionX * delta;
                    this.y += ay * this.directionY * this.range * delta;

                    this.tmpX = this.x;
                    this.tmpY = this.y;
                } else if (this.pattern == 2) {
                    this.y += this.range * this.directionY * delta;
                    this.x += ax * this.directionX * this.range * delta;

                    this.tmpX = this.x;
                    this.tmpY = this.y;
                }
                else if (this.pattern == 3) {
                    this.x = this.tmpX + ax * this.rot;
                    this.y = this.tmpY + ay * this.rot;
                }
                
                if (this.x >= bounds.right) {
                    this.directionX = -1;
                    this.t2 = 0;
                } else if (this.x <= bounds.left) {
                    this.directionX = 1;
                    this.t2 = 0;
                }

                if (this.y >= bounds.bottom) {
                    this.directionY = -1;
                    this.t2 = 0;
                } else if (this.y <= bounds.top) {
                    this.directionY = 1;
                    this.t2 = 0;
                }
            }
        }
        
    }
}