class Hero {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.direction = 0;
        this.speed = 0.0;

        this.stopTimer = 0.0;

        this.boundLeft = -1.0 + this.radius;
        this.boundRight = 1.0 - this.radius;

        this.constSpeed = 0.70;

        this.lastDirection = 1;

        this.w = 0.05;
        this.h = 0.15;
    }

    initMovement(direction) {
        this.direction = direction;
        this.stopTimer = 0.0;

        if (direction > 0) {
            this.speed = this.constSpeed;
            this.lastDirection = this.direction;
        } else if (direction < 0) {
            this.speed = -this.constSpeed;
            this.lastDirection = this.direction;
        } else {
            this.speed = 0.0;
        }
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    move(delta) {

        this.x += this.speed * delta;
    
        if (this.x >= this.boundRight) {
            this.setPos(this.boundRight, this.y);
        } else if (this.x <= this.boundLeft) {
            this.setPos(this.boundLeft, this.y);
        }

        

        // if (this.direction == 0) {
        //     this.speed =  Math.max(0.0, this.speed - this.friction * delta);
        // }

        // this.speed = Math.max(0.0, this.speed - this.friction * delta);

        // this.heroX = this.x - this.w / 2;
    }
}