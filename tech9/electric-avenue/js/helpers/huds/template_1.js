class Template_1 {
    constructor(ctx, w, h, sx, sy) {
        this.isMuted = false;
        this.txt = new Text(ctx, w, h); 
        this.txt.setScale(sx, sy); 

        this.health = 100;
        this.decayRate = -1;
        this.redChargeAdjY = 10 * sy;
        this.gameoverChargeAdj = isMobile() ? 10 * sx : 25 * sx;

        this.centerX = w / 2;
        
        this.isWin = true;

        this.volumeOn = true;

        let multiplier = 1.5;
        let multiplier2 = 2.5;
        this.timecircle = new StaticSprite(50, 20, 60 * multiplier, 60 * multiplier, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        this.stopwatch = new StaticSprite(50, 20, 60 * multiplier, 60 * multiplier, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');

        this.complete = new StaticSprite(0, 50, AM.images.complete.cw * multiplier2, AM.images.complete.ch * multiplier2, 0, 0, AM.images.complete.cw, AM.images.complete.ch, 'complete');
        this.yourscore = new StaticSprite(0, 200, AM.images.yourscore.cw * multiplier2, AM.images.yourscore.ch * multiplier2, 0, 0, AM.images.yourscore.cw, AM.images.yourscore.ch, 'yourscore');

        this.volume = new StaticSprite(25, 25, 55, 55, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        this.mute = new StaticSprite(25, 25, 55, 55, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

        this.initBattery();
        this.initBattery2();
        this.initMiniBattery(sx);

        rescaleAll(this.battery_rect, sx, sy);
        rescaleAll(this.battery_top, sx, sy);
        rescaleAll(this.battery_logo, sx, sy);
        rescaleAll(this.battery_charge_lime, sx, sy);
        rescaleAll(this.battery_charge_red, sx, sy);

        rescaleAll(this.battery_rect2, sx, sy);
        rescaleAll(this.battery_top2, sx, sy);
        rescaleAll(this.battery_logo2, sx, sy);
        rescaleAll(this.battery_charge_lime2, sx, sy);
        rescaleAll(this.battery_charge_red2, sx, sy);

        this.chargeHeight = this.battery_charge_lime.h;
        
        
        this.battery_rect.x = w - this.battery_rect.w * 1.25;
        this.battery_top.x = this.battery_rect.x + this.battery_rect.w / 2 - this.battery_top.w / 2;
        this.battery_logo.x = this.battery_rect.x + this.battery_rect.w / 2 - this.battery_logo.w / 2;
        this.battery_charge_lime.x = this.battery_rect.x + 2.5 * sx;
        this.battery_charge_red.x = this.battery_rect.x + 2.5 * sx;

        this.battery_rect.y = 30 * sy;
        this.battery_charge_lime.y = this.battery_rect.y + 4.5 * sy;
        this.battery_top.y = this.battery_rect.y - this.battery_top.h;
        this.battery_logo.y = this.battery_rect.y + this.battery_rect.h / 2 - this.battery_logo.h / 2;
        this.chargeY = this.battery_charge_lime.y;

        // gameover battery
        this.battery_rect2.x = w / 2 - this.battery_rect2.w * 1.25 / 2;
        this.battery_top2.x = this.battery_rect2.x - this.battery_rect2.w * 0.9;
        this.battery_logo2.x = this.battery_rect2.x + this.battery_rect2.w / 2 - this.battery_logo2.w / 2;
        this.battery_charge_lime2.x = this.battery_rect2.x + 2.5 * sx;
        this.battery_charge_red2.x = this.battery_rect2.x + 2.5 * sx;
        this.chargeHeight2 = this.battery_charge_lime2.h;
        

        this.battery_rect2.y = 320 * sy;
        this.battery_charge_lime2.y = this.battery_rect2.y + 4.5 * sy;
        this.battery_top2.y = 460 * sy;
        this.battery_logo2.y = this.battery_rect2.y + this.battery_rect2.h / 2 - this.battery_logo2.h / 2;
        this.chargeY2 = this.battery_charge_lime2.y - this.battery_charge_lime2.w + 30 * sy;
        
        this.battery_rect2.resetOX();
        this.battery_top2.resetOX();
        this.battery_logo2.resetOX();
        this.battery_charge_lime2.resetOX();
        this.battery_charge_red2.resetOX();

        // mini battery
        
        this.miniChargeHeight = this.mini_battery_charge_lime.h;

        this.mini_battery_rect.x = 1135 * sx;
        this.mini_battery_top.x = this.mini_battery_rect.x + this.mini_battery_rect.w / 2 - this.mini_battery_top.w / 2;
        this.mini_battery_logo.x = this.mini_battery_rect.x + this.mini_battery_rect.w / 2 - this.mini_battery_logo.w / 2;
        this.mini_battery_charge_lime.x = this.mini_battery_rect.x + 2.5 * sx;
        this.mini_battery_charge_red.x = this.mini_battery_charge_lime.x;

        this.mini_battery_rect.y = 480 * sy;
        this.mini_battery_charge_lime.y = this.mini_battery_rect.y + 4 * sy;
        this.mini_battery_charge_red.y = this.mini_battery_charge_lime.y;
        this.mini_battery_top.y = this.mini_battery_rect.y - this.mini_battery_top.h;
        this.mini_battery_logo.y = this.mini_battery_rect.y + this.mini_battery_rect.h / 2 - this.mini_battery_logo.h / 2;
        // this.mini_chargeY = this.mini_battery_charge_lime.y;
        this.miniChargeY = this.mini_battery_charge_lime.y;
        //

        rescaleAll(this.timecircle, sx, sy);
        rescaleAll(this.stopwatch, sx, sy);
        rescaleAll(this.complete, sx, sy);
        rescaleAll(this.yourscore, sx, sy);
        
        rescaleAll(this.volume, sx, sy);
        rescaleAll(this.mute, sx, sy);


        let paddingX = 50 * sx;
        let paddingY = 22 * sy;

        let pbW = 200 * sx;

        this.timecircle.x = w / 2 - pbW / 2 - this.timecircle.w / 2;
        this.stopwatch.x = this.timecircle.x;

        this.timeProgressBar = new ProgressBar(this.timecircle.x + paddingX, this.timecircle.h / 2 - 35 * sx / 2 + paddingY, pbW, 40 * sy);
        this.timeProgressBar.progress = 100;

        this.txt.addText('time', '90', 'bold', 25, 'Montserrat', 0, 0, 45, 45, '#000', true); 
        this.txt.centerTo('time', this.timecircle.x, this.timecircle.y, this.timecircle.w, this.timecircle.h);


        // gameover
        this.txt.addText('score', this.health + '%', 'bold', 30, 'Montserrat', w / 2, 300 * sy, 150, 55, '#fff', true);
        this.txt.addText('reset', 'Tap to play again.', 'bold', 30, 'Montserrat', w / 2, h * 0.65, 500, 40, '#fff', true);

        this.complete.x = w / 2 - this.complete.w / 2;
        this.yourscore.x = w / 2 - this.yourscore.w / 2;

        // this.updateGameoverBattery(-70);
        // this.txt.texts['score'].str = this.health + '%';
        this.updateBattery(-60);
    }

    initMiniBattery(sx) {
        let mul = 0.80 * sx;
        this.mini_battery_rect = new StaticSprite(0, 0, AM.images.battery_rect.cw * mul, AM.images.battery_rect.ch * mul, 0, 0, AM.images.battery_rect.cw, AM.images.battery_rect.ch, 'battery_rect');
        this.mini_battery_top = new StaticSprite(0, 0, AM.images.battery_top.cw * mul, AM.images.battery_top.ch * mul, 0, 0, AM.images.battery_top.cw, AM.images.battery_top.ch, 'battery_top');
        this.mini_battery_logo = new StaticSprite(0, 0, AM.images.battery_logo.cw * mul, AM.images.battery_logo.ch * mul, 0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 'battery_logo');
        this.mini_battery_charge_lime = new StaticSprite(0, 0, AM.images.battery_charge_lime.cw * mul - 3, AM.images.battery_charge_lime.ch * mul - 4, 0, 0, AM.images.battery_charge_lime.cw, AM.images.battery_charge_lime.ch, 'battery_charge_lime');
        this.mini_battery_charge_red = new StaticSprite(0, 0, AM.images.battery_charge_red.cw * mul - 3, AM.images.battery_charge_red.ch * mul - 4, 0, 0, AM.images.battery_charge_red.cw, AM.images.battery_charge_red.ch, 'battery_charge_red');
        // this.battery_logo = new StaticSprite(0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 'battery_logo');
    }

    drawMiniBattery(ctx) {
        this.mini_battery_rect.draw(ctx);
        this.mini_battery_top.draw(ctx);
        // this.mini_battery_charge_lime.draw(ctx);
        if (this.health > 20) {
            this.mini_battery_charge_lime.draw(ctx);
        } else {
            this.mini_battery_charge_red.draw(ctx);
        }

        this.mini_battery_logo.draw(ctx);
    }

    updateMiniBattery(val) {
        this.health += val;
        if (this.health > 100) this.health = 100;
        else if (this.health < 0) this.health = 100;

        this.mini_battery_charge_lime.h = this.miniChargeHeight * (this.health / 100);
        
        this.mini_battery_charge_lime.y = this.miniChargeY + (this.miniChargeHeight - this.mini_battery_charge_lime.h);

        this.mini_battery_charge_red.h = this.mini_battery_charge_lime.h;
        this.mini_battery_charge_red.y = this.mini_battery_charge_lime.y;
    }

    decayMiniBattery(delta) {
        this.updateMiniBattery(this.decayRate * delta);
    }

    initBattery() {
        let mul = 2.5;
        this.battery_rect = new StaticSprite(0, 0, AM.images.battery_rect.cw * mul, AM.images.battery_rect.ch * mul, 0, 0, AM.images.battery_rect.cw, AM.images.battery_rect.ch, 'battery_rect');
        this.battery_top = new StaticSprite(0, 0, AM.images.battery_top.cw * mul, AM.images.battery_top.ch * mul, 0, 0, AM.images.battery_top.cw, AM.images.battery_top.ch, 'battery_top');
        this.battery_logo = new StaticSprite(0, 0, AM.images.battery_logo.cw * mul, AM.images.battery_logo.ch * mul, 0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 'battery_logo');
        this.battery_charge_lime = new StaticSprite(0, 0, AM.images.battery_charge_lime.cw * mul - 6, AM.images.battery_charge_lime.ch * mul - 6, 0, 0, AM.images.battery_charge_lime.cw, AM.images.battery_charge_lime.ch, 'battery_charge_lime');
        this.battery_charge_red = new StaticSprite(0, 0, AM.images.battery_charge_lime.cw * mul - 6, AM.images.battery_charge_lime.ch * mul - 6, 0, 0, AM.images.battery_charge_red.cw, AM.images.battery_charge_red.ch, 'battery_charge_red');
        // this.battery_logo = new StaticSprite(0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 'battery_logo');
    }

    drawBattery(ctx) {
        this.battery_rect.draw(ctx);
        this.battery_top.draw(ctx);
        if (this.health > 20) {
            this.battery_charge_lime.draw(ctx);
        } else {
            this.battery_charge_red.draw(ctx);
        }
        
        this.battery_logo.draw(ctx);
    }

    initBattery2() {
        let mul = 2.5;
        this.battery_rect2 = new StaticSprite(0, 0, AM.images.battery_rect.cw * mul, AM.images.battery_rect.ch * mul, 0, 0, AM.images.battery_rect.cw, AM.images.battery_rect.ch, 'battery_rect');
        this.battery_top2 = new StaticSprite(0, 0, AM.images.battery_top.cw * mul, AM.images.battery_top.ch * mul, 0, 0, AM.images.battery_top.cw, AM.images.battery_top.ch, 'battery_top');
        this.battery_logo2 = new StaticSprite(0, 0, AM.images.battery_logo.cw * mul, AM.images.battery_logo.ch * mul, 0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 'battery_logo');
        this.battery_charge_lime2 = new StaticSprite(0, 0, AM.images.battery_charge_lime.cw * mul - 6, AM.images.battery_charge_lime.ch * mul - 6, 0, 0, AM.images.battery_charge_lime.cw, AM.images.battery_charge_lime.ch, 'battery_charge_lime');
        this.battery_charge_red2 = new StaticSprite(0, 0, AM.images.battery_charge_lime.cw * mul - 6, AM.images.battery_charge_lime.ch * mul - 6, 0, 0, AM.images.battery_charge_red.cw, AM.images.battery_charge_red.ch, 'battery_charge_red');
        // this.battery_logo = new StaticSprite(0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 'battery_logo');
    }

    drawBatteryRotate(ctx, radians) {
        this.battery_rect2.drawRotate(ctx, radians);
        this.battery_top2.drawRotate(ctx, radians);

        if (this.health > 20) {
            this.battery_charge_lime2.drawRotate(ctx, radians);
        } else {
            this.battery_charge_red2.drawRotate(ctx, radians);
        }
        
        this.battery_logo2.drawRotate(ctx, radians);
    }

    updateGameoverBattery() {
        // this.health += val;
        // if (this.health > 100) this.health = 100;
        // else if (this.health < 0) this.health = 0;

        let percent = this.health / 100;
        
        
        this.battery_charge_lime2.h = this.chargeHeight2 * percent;
        let p2 = ((this.chargeHeight2 - this.battery_charge_lime2.h) / this.chargeHeight2);

        this.battery_charge_lime2.x = this.battery_charge_lime2.ox + (this.chargeHeight2 - this.battery_charge_lime2.h) / 2;
        this.battery_charge_lime2.y = this.battery_charge_lime2.oy + (this.battery_charge_lime2.w * p2 + this.gameoverChargeAdj * p2);

        this.battery_charge_red2.x = this.battery_charge_lime2.x;
        this.battery_charge_red2.h = this.battery_charge_lime2.h;
        this.battery_charge_red2.y = this.battery_charge_lime2.y;

        this.txt.texts['score'].str = Math.floor(this.health) + '%';
    }

    updateBattery(val) {
        this.health += val;
        if (this.health > 100) this.health = 100;
        else if (this.health < 0) this.health = 0;

        let percent = this.health / 100;
        this.battery_charge_lime.h = this.chargeHeight * percent;
        this.battery_charge_lime.y = this.chargeY + (this.chargeHeight - this.battery_charge_lime.h);

        this.battery_charge_red.h = this.battery_charge_lime.h;
        this.battery_charge_red.y = this.battery_charge_lime.y;
    }

    decay(delta) {
        this.updateBattery(this.decayRate * delta);
    }

    draw(ctx) {
        this.timeProgressBar.draw(ctx);
        
        this.timecircle.draw(ctx);
        this.stopwatch.draw(ctx);
        
        if (this.volumeOn) {
            this.volume.draw(ctx);
        } else {
            this.mute.draw(ctx);
        }

        
        
        this.txt.draw('time');

        this.drawBattery(ctx);
        // this.txt.draw('score');
    }

    gameover(ctx) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        this.complete.draw(ctx);
        this.yourscore.draw(ctx);
        
        this.drawBatteryRotate(ctx, -90);
        
        this.txt.draw('score');
        this.txt.draw('reset');
    }
}

// {
//     "id": "a_fish_5",
//     "src": "fishes/animated/5",
//     "ext": "png",
//     "cw": 500,
//     "ch": 220
// },
// {
//     "id": "a_fish_6",
//     "src": "fishes/animated/6",
//     "ext": "png",
//     "cw": 505,
//     "ch": 222
// },
// {
//     "id": "a_fish_7",
//     "src": "fishes/animated/7",
//     "ext": "png",
//     "cw": 505,
//     "ch": 274
// },
// {
//     "id": "a_fish_8",
//     "src": "fishes/animated/8",
//     "ext": "png",
//     "cw": 505,
//     "ch": 280
// },