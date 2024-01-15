class Joystick {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.r2 = r - 5;
        this.r3 = r * 0.40;

        // let tmp = r;
        let d = r / 2;
        this.rect = {
            x: x - d,
            y: y - d,
            dim: r
        }

        this.startAngle = 0;
        this.endAngle = 2 * Math.PI;

        this.mx = 0;
        this.my = 0;
        this.prevMx = 0;
        this.prevMy = 0;

        this.moveLimit = r - this.r3;

        let dim = r * 2;
        this.hitbox = {
            x: x - r,
            y: y - r,
            w: dim,
            h: dim,
        }

        this.active = false;
        this.dx = 0;
        this.dy = 0;

        this.vx = 0;
        this.vy = 0;

        this.lastDirection = {
            x: 0,
            y: 0
        }

        this.maxVx = 0;
        this.minVx = 0;

        this.percentageX = 0;
        this.moveByPercentX = 0;

        this.on = true;

        // this.totalDistX = 0;
    }

    update(x, y) {
        // if (this.active) {
            if (x > this.maxVx) {
                this.maxVx = x;
            } else if (x < this.minVx) {
                this.maxVx = x;
            }

            this.prevMx = this.mx;
            this.prevMy = this.my;

            this.mx += x;
            if (this.mx > this.moveLimit) {
                this.mx = this.moveLimit;
            } else if (this.mx < -this.moveLimit) {
                this.mx = -this.moveLimit;
            }

            this.my -= y;
            if (this.my > this.moveLimit) {
                this.my = this.moveLimit;
            } else if (this.my < -this.moveLimit) {
                this.my = -this.moveLimit;
            }

            this.percentageX = this.mx / this.moveLimit;
        // }
    }

    drawHitbox() {
        const { x, y, w, h } = this.hitbox;
        ctx.save();
        ctx.strokeStyle = '#fff'; 
        ctx.beginPath();
        ctx.rect(x, y, w, h) ;
        ctx.stroke();
        ctx.restore();
    }

    touchUp() {
        this.mx = 0;
        this.my = 0;
        this.active = false;
    }

    draw(ctx) {
        if (joystick.on) {
            ctx.save();

            ctx.globalAlpha = 0.2 + 0.25;
            ctx.fillStyle = '#000';

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, this.startAngle, this.endAngle);
            ctx.fill();

            ctx.globalAlpha = 0.25 + 0.25;
            ctx.fillStyle = '#fff';

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r2, this.startAngle, this.endAngle);
            ctx.fill();

            ctx.save();
            // Untransformed draw position
            const position = {x: this.rect.x, y: this.rect.y};
            // In degrees
            const rotation = { x: 0, y: 0, z: 45};
            // Rotation relative to here (this is the center of the image)
            // const rotPt = { x: this.w / 2, y: this.h / 2 };
            const rotPt = { x: this.rect.dim / 2, y: this.rect.dim / 2 };

            ctx.setTransform(new DOMMatrix()
                .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
                .rotateSelf(rotation.x, rotation.y, rotation.z)
            );

            ctx.strokeStyle = '#fff';
            ctx.beginPath();
            ctx.rect(-rotPt.x, -rotPt.x, this.rect.dim, this.rect.dim);
            ctx.stroke();
            
            ctx.restore();

            ctx.globalAlpha = 0.55 + 0.25;
            ctx.fillStyle = '#89CFF0';

            ctx.beginPath();
            ctx.arc(this.x + this.mx, this.y + this.my, this.r3, this.startAngle, this.endAngle);
            ctx.fill();

            ctx.restore();
        }
        

        // this.drawHitbox();
    }
}