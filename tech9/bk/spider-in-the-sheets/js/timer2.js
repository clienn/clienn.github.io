class Timer {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;

        this.speed = 0.00002;

        this.timer = 360;
        this.div = 360 / 3;
        this.fontSize = 70;
        this.adjX = [30, 40];

        this.colors = ['#fb2121', '#f9a139', '#b1dd47'];
    }

    setTimer(seconds) {
        this.timer = seconds * 24;
        this.div = this.timer / 3;
    }

    draw(ctx) {
        ctx.beginPath();

        ctx.strokeStyle = this.colors[Math.floor(this.timer / this.div)];
        ctx.lineWidth = '10';
        
        ctx.arc(this.x, this.y, this.r, (Math.PI / 180) * 270, (Math.PI / 180) * (270 + this.timer), false);
        ctx.stroke();

        ctx.font = this.fontSize + "px arial";
        ctx.fillStyle = '#2f2f2f';
        ctx.textBaseline = 'top'; // important!

        let t = Math.floor(this.timer / 24)
        let adjX = this.adjX[0];
        if (t > 9) adjX = this.adjX[1];

        ctx.fillText(t, this.x - adjX, this.y - 20);
    }

    tick(delta) {
        if (this.timer > 0) {
            // console.log(this.timer);
            this.timer -= 24 * (delta);
            // console.log(this.timer);
            if (this.timer < 0) this.timer = 0;
        }
    }
}