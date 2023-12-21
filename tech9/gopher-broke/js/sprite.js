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

        this.dropSpeed = 1;
        this.dropSine = 0;
        this.restitution = 0;
        this.degrees = 0;
        this.dropDist = 0;

        this.t = 0;
        this.t2 = 0;
        this.isAnimating = false;

        this.goto = null;
        this.moveDestinations = [];
        this.trail = [];

        this.trailGap = 2;
        this.trailGapT = 0;
    }

    update(speed, delta) {
        if (this.goto != null || this.moveDestinations.length > 0) {
            if (delta > 1) delta = 0.1;
            this.t += speed * delta;
            this.trailGapT += 50 * delta;
            
            if (this.goto == null) {
                this.goto = this.moveDestinations.shift();
            }

            if (this.t >= 1) {
                this.ox = this.x;
                this.oy = this.y;
                
                this.goto = null;
                // console.log(dist, this.goto);
                this.t = 0;
                this.trail = [];
            } else {
                this.x = lerp(this.ox, this.goto[1], this.t);
                this.y = lerp(this.oy, this.goto[0], this.t);

                // if (Math.floor(this.trailGapT) == this.trailGap) {
                //     this.trail.push([this.x, this.y]);

                //     if (this.trail.length > 5) {
                //         this.trail.shift();
                //     }

                //     this.trailGapT = 0;
                // }
                // 
                if (Math.floor(this.trailGapT) >= this.trailGap) {
                    this.trail.push([this.x, this.y]);
    
                    if (this.trail.length > 3) {
                        this.trail.shift();
                    }

                    this.trailGapT = 0;
                }

                
                
            }

            
            

            // let dx = this.x - this.goto[1];
            // let dy = this.y - this.goto[0];
            // let dist = Math.sqrt(dx * dx + dy * dy);
            // console.log(dist);

            

            // console.log(this.trail.length);

            // if (dist < 10) {
            //     this.ox = this.x;
            //     this.oy = this.y;
                
            //     this.goto = null;
            //     // console.log(dist, this.goto);
            //     this.t = 0;
            //     this.trail = [];
            // }
        } else {
            this.t2 += speed * delta;
        }
    }

    draw(ctx, img) {
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);
        // for (let i = this.trail.length - 1; i >= 0; --i) {
        let opacity = 0.80;
        let scale = 1;
        for (let i = 0; i < this.trail.length; ++i) {
            ctx.save();
            // ctx.globalAlpha = 0.5 - i / 10;
            ctx.globalAlpha = 0.16 + i * 0.16;
            // scale = 0.5 + i * 0.0714;
            scale = 0.7 + i * 0.1;
            let w = this.w * scale;
            let h = this.h * scale;

            let adjX = (this.w - w) / 2;
            let adjY = (this.h - h) / 2;

            ctx.drawImage(img, this.clipX, 0, this.clipW, this.clipH, this.trail[i][0] + adjX, this.trail[i][1] + adjY, w, h);
            ctx.restore();
            // console.log(this.trail[i].x)
        }
        // ctx.beginPath();
        // ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 15.3125, 0, 2 * Math.PI);
        // ctx.stroke();
    }

    drawScale(ctx, img, scale, x, y) {
        let w = this.w * scale;
        let h = this.h * scale;

        let adjX = (this.w - w) / 2;
        let adjY = (this.h - h) / 2;

        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, x + adjX, y + adjY, w, h);
    }

    drawTo(ctx, img, x, y) {
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, x, y, this.w, this.h);
        for (let i = this.trail.length - 1; i >= 0; --i) {
            ctx.save();
            ctx.globalAlpha = 0.5 - i / 10;
            ctx.drawImage(img, this.clipX, 0, this.clipW, this.clipH, this.trail[i][0], this.trail[i][1], this.w, this.h);
            ctx.restore();
            // console.log(this.trail[i].x)
        }
       
    }

    dynamicdraw(ctx, img, x, y, w, h, cw, ch) {
        ctx.drawImage(img, this.clipX, 0, cw, ch, x, y, w, h);
    }
}