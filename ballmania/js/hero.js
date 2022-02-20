class Hero {
    constructor(x, y, radius, boundX) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 0.45;
        this.isMoving = false;

        this.sprite = null;
        this.fps = 60 / 1000;
        this.frames = 8;
        this.frameX = 0;
        this.frameY = 0;

        // this.clipX = 35;
        this.clipX = 0;
        // this.clipY = 55;
        this.clipY = 0;

        this.clipW = 64;
        this.clipH = 64;

        this.w = 64;
        this.h = 64;

        this.collsionW = this.w / 4;

        this.boundX = boundX - this.collsionW;

        this.heroX = this.x - this.w / 2;
        this.heroY = this.y - this.h / 2;
    }

    setSprite(img) {
        this.sprite = img;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    initMovement(direction) {
        this.direction = direction;
        this.isMoving = direction ? true : false;

        if (this.direction < 0) this.frameY = 2;
        else if (this.direction > 0) this.frameY = 0;
    }

    move(delta) {
        if (this.isMoving) {
            this.x += this.speed * delta * this.direction;
            this.heroX = this.x - this.w / 2;
        }
    }

    update(delta) {
        if (this.isMoving) {
            this.frameX = Math.floor(this.frameX + this.fps * delta) % this.frames;
        } else {
            this.frameX = 0;
        }
    }

    draw(ctx) {
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        // ctx.fillStyle = '#000000';
        // ctx.fill();
        if (this.sprite) {

            
            ctx.drawImage(
                this.sprite, 
                this.clipX + this.frameX * this.clipW, 
                this.clipY + this.frameY * this.clipH, 
                this.clipW, 
                this.clipH, 
                this.heroX, 
                this.heroY, 
                this.w, 
                this.h
            );
        }

        // ctx.lineWidth = 1;
        // ctx.strokeStyle = '#000000';
        // ctx.stroke();
    }
}