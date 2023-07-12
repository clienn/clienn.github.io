class Spirte {
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

        this.bucketSize = w;
        this.halfBucketSize = w / 2;
        this.adjX = 0;
        this.d = 0;

        this.pos = 0;
        this.rangeX = 0;
        this.rangeY = 0;

        this.isAnimating = false;
    }

    draw(ctx, img) {
        ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, this.x, this.y, this.w, this.h);

        // ctx.beginPath();
        // ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 15.3125, 0, 2 * Math.PI);
        // ctx.stroke();
    }

    setBucketSize(n) {
        this.bucketSize = n;
        this.halfBucketSize = n / 2;
    }

    move(d) {
        if (d > 0) {
            this.t = 3.2;
            this.et = 6.25;
            this.adjX = this.rangeX;
        } else {
            this.t = 1.6;
            this.et = 4.65;
            this.adjX = -this.rangeX;
            // console.log('test')
        }

        this.d = d;
    }

    goto(dest, jumpHeight) {
        if (!this.isAnimating) {
            let dist = dest - this.pos;
            this.rangeX = this.halfBucketSize * Math.abs(dist);
            this.rangeY = Math.max(this.bucketSize, (this.bucketSize * Math.abs(dist / 2))) + jumpHeight;
            this.pos += dist;
            this.isAnimating = true;
            if (dist < 0) {
                this.move(-1);

            } else {
                this.move(1);
            }
        }
    }

    update(speed, delta) {
        if (this.d != 0) {
            let ax, ay;
            if (this.d > 0) {
                ax = Math.cos(this.t);
                ay = Math.sin(this.t);
            } else {
                ax = Math.sin(this.t);
                ay = Math.cos(this.t);
            }

            if (this.t < this.et) {
                this.t += speed * delta;

                this.x = this.ox + this.adjX + ax * this.rangeX;
                this.y = this.oy + ay * this.rangeY;
            } else {
                // if (this.d > 0) {
                //     this.pos++;
                // } else {
                //     this.pos--;
                // }

                this.d = 0;
                this.isAnimating = false;

                return 1;
            }
        }

        return 0;

        // this.y += vy * delta;
        // this.y = this.oy + (-0.6 * (this.t - 7.5) ** 2 + 1);
        // console.log(-0.6 * (this.t - 7.5) ** 2 + 2);
    }
}