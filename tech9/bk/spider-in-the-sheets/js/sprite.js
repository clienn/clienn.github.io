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

        this.goto = null;
        this.isMoving = false;

        this.isAnimating = false;

        this.moveDestinations = [];
        this.trail = [];
    }

    draw(ctx, img, isAngry) {
        if (isAngry == 1) {
            ctx.drawImage(img, this.clipX, this.clipY, 895, 979, this.x, this.y, this.w, this.h);
        } else if (isAngry == 2) {
            ctx.drawImage(img, 0, 0, 117, 128, this.x, this.y, this.w * 1.5, this.h * 1.5);
        } else if (isAngry == 3) {
            ctx.drawImage(img, 0, 0, 895, 979, this.x, this.y, this.w, this.h);
            for (let i = 0; i < this.trail.length; ++i) {
                ctx.save();
                ctx.globalAlpha = 0.2 - i / 10;
                ctx.drawImage(img, 0, 0, 895, 979, this.trail[i][0], this.trail[i][1], this.w, this.h);
                ctx.restore();
                // console.log(this.trail[i].x)
            }
        } else {
            ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);
        }
        // ctx.beginPath();
        // ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 15.3125, 0, 2 * Math.PI);
        // ctx.stroke();
    }

    dynamicDraw(ctx, img, clipW, clipH) {
        // 235 × 256
        ctx.drawImage(img, this.clipX, this.clipY, clipW, clipH, this.x, this.y, this.w, this.h);
    }

    move(dx, dy, pattern) {
        this.directionX = dx;
        this.directionY = dy;
        this.pattern = pattern;
        this.t = 0;
        this.t2 = 0;
        this.isMoving = true;
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    // update(speed, shuffleDuration, delta, bounds) {
    update(speed, shuffleDuration, delta) {
        // if (this.moveDestinations.length > 0) {
            
            // console.log(this.t);

            if (this.goto != null || this.moveDestinations.length > 0) {
                this.t += speed * delta;
                if (this.goto == null) {
                    this.goto = this.moveDestinations.shift();
                }

                this.x = this.lerp(this.ox, this.goto[1], this.t);
                this.y = this.lerp(this.oy, this.goto[0], this.t);

                let dx = this.x - this.goto[1];
                let dy = this.y - this.goto[0];
                let dist = Math.sqrt(dx * dx + dy * dy);
                // console.log(dist);

                this.trail.push([this.x, this.y]);

                if (this.trail.length > 5) {
                    this.trail.shift();
                }

                // console.log(this.trail.length);

                if (dist < 10) {
                    this.ox = this.x;
                    this.oy = this.y;
                    
                    this.goto = null;
                    // console.log(dist, this.goto);
                    this.t = 0;
                    this.trail = [];
                }

                // if (this.x)
                
                // this.t2 += speed * delta;

                // if (Math.floor(this.t2) % 30 == 0) {
                //     this.t2++;
                //     this.pattern = Math.floor(Math.random() * 2) + 1;
                //     // this.rot = Math.floor(Math.random() * 3 + 1) + 100;
                //     this.range = Math.floor(Math.random() * 4 + 4) * 200;


                //     // let rotX = bounds.right - this.x;
                //     // let rotY = bounds.bottom - this.y;

                //     // this.rot = Math.min(this.rot, rotX, rotY);
                // }
                
                
                // // let ax = Math.sin(this.t);
                // // let ay = Math.cos(this.t);
                
                // // this.x = this.ox + ax * 500;
                // // this.y = this.oy + ay * 100;

                // let ax = Math.sin(this.t);
                // let ay = Math.cos(this.t);
                
                // if (this.pattern == 1) {
                //     this.x += this.rangeX * this.directionX * delta;
                //     this.y += ay * this.directionY * this.range * delta;

                //     this.tmpX = this.x;
                //     this.tmpY = this.y;
                // } else if (this.pattern == 2) {
                //     this.y += this.range * this.directionY * delta;
                //     this.x += ax * this.directionX * this.range * delta;

                //     this.tmpX = this.x;
                //     this.tmpY = this.y;
                // }
                // else if (this.pattern == 3) {
                //     this.x = this.tmpX + ax * this.rot;
                //     this.y = this.tmpY + ay * this.rot;
                // }
                
                // if (this.x >= bounds.right) {
                //     this.directionX = -1;
                //     this.t2 = 0;
                // } else if (this.x <= bounds.left) {
                //     this.directionX = 1;
                //     this.t2 = 0;
                // }

                // if (this.y >= bounds.bottom) {
                //     this.directionY = -1;
                //     this.t2 = 0;
                // } else if (this.y <= bounds.top) {
                //     this.directionY = 1;
                //     this.t2 = 0;
                // }
            } else {
                this.t2 += speed * delta;
            }
        // }
        
    }
}