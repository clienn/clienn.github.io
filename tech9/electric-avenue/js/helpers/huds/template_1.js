class Template_1 {
    constructor(ctx, w, h, sx, sy) {
        this.isMuted = false;
        this.txt = new Text(ctx, w, h); 
        this.txt.setScale(sx, sy); 

        this.health = 100;
        this.decayRate = -1;
        
        this.isWin = true;

        this.volumeOn = true;

        let multiplier = 1.5;
        this.timecircle = new StaticSprite(50, 20, 60 * multiplier, 60 * multiplier, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        this.stopwatch = new StaticSprite(50, 20, 60 * multiplier, 60 * multiplier, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');

        this.volume = new StaticSprite(65, this.timecircle.h + 27, 35, 35, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        this.mute = new StaticSprite(65, this.timecircle.h + 27, 35, 35, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

        this.initBattery();
        this.initMiniBattery(sx);

        rescaleAll(this.battery_rect, sx, sy);
        rescaleAll(this.battery_top, sx, sy);
        rescaleAll(this.battery_logo, sx, sy);
        rescaleAll(this.battery_charge_lime, sx, sy);

        this.chargeHeight = this.battery_charge_lime.h;
        
        
        this.battery_rect.x = w - this.battery_rect.w * 1.25;
        this.battery_top.x = this.battery_rect.x + this.battery_rect.w / 2 - this.battery_top.w / 2;
        this.battery_logo.x = this.battery_rect.x + this.battery_rect.w / 2 - this.battery_logo.w / 2;
        this.battery_charge_lime.x = this.battery_rect.x + 2.5 * sx;

        this.battery_rect.y = 30 * sy;
        this.battery_charge_lime.y = this.battery_rect.y + 4.5 * sy;
        this.battery_top.y = this.battery_rect.y - this.battery_top.h;
        this.battery_logo.y = this.battery_rect.y + this.battery_rect.h / 2 - this.battery_logo.h / 2;
        this.chargeY = this.battery_charge_lime.y;

        // mini battery
        
        this.miniChargeHeight = this.mini_battery_charge_lime.h;

        this.mini_battery_rect.x = 1135 * sx;
        this.mini_battery_top.x = this.mini_battery_rect.x + this.mini_battery_rect.w / 2 - this.mini_battery_top.w / 2;
        this.mini_battery_logo.x = this.mini_battery_rect.x + this.mini_battery_rect.w / 2 - this.mini_battery_logo.w / 2;
        this.mini_battery_charge_lime.x = this.mini_battery_rect.x + 2.5 * sx;

        this.mini_battery_rect.y = 480 * sy;
        this.mini_battery_charge_lime.y = this.mini_battery_rect.y + 4 * sy;
        this.mini_battery_top.y = this.mini_battery_rect.y - this.mini_battery_top.h;
        this.mini_battery_logo.y = this.mini_battery_rect.y + this.mini_battery_rect.h / 2 - this.mini_battery_logo.h / 2;
        // this.mini_chargeY = this.mini_battery_charge_lime.y;
        this.miniChargeY = this.mini_battery_charge_lime.y;
        //

        rescaleAll(this.timecircle, sx, sy);
        rescaleAll(this.stopwatch, sx, sy);
        
        rescaleAll(this.volume, sx, sy);
        rescaleAll(this.mute, sx, sy);


        let paddingX = 50 * sx;
        let paddingY = 22 * sy;

        let pbW = 200 * sx;

        this.timecircle.x = w / 2 - pbW / 2 - this.timecircle.w / 2;
        this.stopwatch.x = this.timecircle.x;

        this.timeProgressBar = new ProgressBar(this.timecircle.x + paddingX, this.timecircle.h / 2 - 35 * sx / 2 + paddingY, pbW, 40 * sy);
        this.timeProgressBar.progress = 60;

        this.txt.addText('time', '90', 'bold', 25, 'Montserrat', 0, 0, 45, 45, '#000', true); 
        this.txt.centerTo('time', this.timecircle.x, this.timecircle.y, this.timecircle.w, this.timecircle.h);


        // gameover
        this.txt.addText('complete', 'Complete!', 'bold', 30, 'Montserrat', w / 2, 35 * sy, 180, 35, '#fff', true);
        this.txt.addText('reset', 'Tap to play again.', 'bold', 30, 'Montserrat', w / 2, h / 2, 500, 40, '#fff', true);

        // this.updateBattery(-10);
    }

    initMiniBattery(sx) {
        let mul = 0.80 * sx;
        this.mini_battery_rect = new StaticSprite(0, 0, AM.images.battery_rect.cw * mul, AM.images.battery_rect.ch * mul, 0, 0, AM.images.battery_rect.cw, AM.images.battery_rect.ch, 'battery_rect');
        this.mini_battery_top = new StaticSprite(0, 0, AM.images.battery_top.cw * mul, AM.images.battery_top.ch * mul, 0, 0, AM.images.battery_top.cw, AM.images.battery_top.ch, 'battery_top');
        this.mini_battery_logo = new StaticSprite(0, 0, AM.images.battery_logo.cw * mul, AM.images.battery_logo.ch * mul, 0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 'battery_logo');
        this.mini_battery_charge_lime = new StaticSprite(0, 0, AM.images.battery_charge_lime.cw * mul - 3, AM.images.battery_charge_lime.ch * mul - 4, 0, 0, AM.images.battery_charge_lime.cw, AM.images.battery_charge_lime.ch, 'battery_charge_lime');
        // this.battery_logo = new StaticSprite(0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 'battery_logo');
    }

    drawMiniBattery(ctx) {
        this.mini_battery_rect.draw(ctx);
        this.mini_battery_top.draw(ctx);
        this.mini_battery_charge_lime.draw(ctx);
        this.mini_battery_logo.draw(ctx);
    }

    updateMiniBattery(val) {
        this.health += val;
        if (this.health > 100) this.health = 100;
        else if (this.health < 0) this.health = 100;

        this.mini_battery_charge_lime.h = this.miniChargeHeight * (this.health / 100);
        this.mini_battery_charge_lime.y = this.miniChargeY + (this.miniChargeHeight - this.mini_battery_charge_lime.h);
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
        // this.battery_logo = new StaticSprite(0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 0, 0, AM.images.battery_logo.cw, AM.images.battery_logo.ch, 'battery_logo');
    }

    drawBattery(ctx) {
        this.battery_rect.draw(ctx);
        this.battery_top.draw(ctx);
        this.battery_charge_lime.draw(ctx);
        this.battery_logo.draw(ctx);
    }

    updateBattery(val) {
        this.health += val;
        if (this.health > 100) this.health = 100;
        else if (this.health < 0) this.health = 0;

        this.battery_charge_lime.h = this.chargeHeight * (this.health / 100);
        this.battery_charge_lime.y = this.chargeY + (this.chargeHeight - this.battery_charge_lime.h);
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

        // this.lose.draw(ctx);
        
        
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