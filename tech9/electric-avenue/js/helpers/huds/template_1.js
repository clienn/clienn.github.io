class Template_1 {
    constructor(ctx, w, h, sx, sy, splashInfo) {
        this.isMuted = false;
        this.txt = new Text(ctx, w, h); 
        this.txt.setScale(sx, sx); 

        this.w = w;
        this.h = h;

        this.sx = sx;
        this.sy = sy;
        this.splashInfo = splashInfo;

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
        let adjY = 120;
        this.complete = new StaticSprite(0, 50 + adjY, AM.images.complete.cw * multiplier2, AM.images.complete.ch * multiplier2, 0, 0, AM.images.complete.cw, AM.images.complete.ch, 'complete');
        this.yourscore = new StaticSprite(0, 200 + adjY, AM.images.yourscore.cw * multiplier2, AM.images.yourscore.ch * multiplier2, 0, 0, AM.images.yourscore.cw, AM.images.yourscore.ch, 'yourscore');

        // this.volume = new StaticSprite(34, 45, 55 * 1.8, 55 * 1.8, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        // this.mute = new StaticSprite(34, 45, 55 * 1.8, 55 * 1.8, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

        // rescaleSize(this.volume, sx, sx);
        // rescalePos(this.volume, sx, sy);

        // rescaleSize(this.mute, sx, sx);
        // rescalePos(this.mute, sx, sy);

        // let watch_w = AM.images.watch.cw * 2.20;
        // let watch_h = AM.images.watch.ch * 2.20;
    
        // this.watch = new StaticSprite(0, 0, watch_w, watch_h, 0, 0, AM.images.watch.cw, AM.images.watch.ch, 'watch');
        // rescaleSize(this.watch, sx, sx);

        // let progressbar_w = AM.images.progressbar.cw * 3;
        // let progressbar_h = AM.images.progressbar.ch * 2.5;
    
        // this.progressbar = new StaticSprite(0, 0, progressbar_w, progressbar_h, 0, 0, AM.images.progressbar.cw, AM.images.progressbar.ch, 'progressbar');
        // rescaleSize(this.progressbar, sx, sx);

        // let timerprogress_w = AM.images.timeprogress.cw * 3;
        // let timerprogress_h = AM.images.timeprogress.ch * 2.5;
    
        // this.timeprogress = new StaticSprite(0, 0, timerprogress_w, timerprogress_h, 0, 0, AM.images.timeprogress.cw, AM.images.timeprogress.ch, 'timeprogress');
        // rescaleSize(this.timeprogress, sx, sx);

        // this.watch.x = this.volume.x + this.volume.w + 50 * scaleX;
        // this.watch.y = 35 * sy;

        // this.progressbar.x = this.watch.x + this.watch.w / 2;
        // this.progressbar.y = this.watch.y + this.watch.h / 2 - this.progressbar.h / 2 + 10 * sy;

        // this.timeprogress.w = this.timeprogress.w - this.watch.w / 2;

        // this.timeprogress.ow = this.timeprogress.w;
        // this.timeprogress.oh = this.timeprogress.h;

        // this.timeprogress.x = this.progressbar.x + this.watch.w / 2 - 5 * sx;
        // this.timeprogress.y = this.progressbar.y + this.progressbar.h / 2 - this.timeprogress.h / 2;

        // let numbers_w = AM.images.numbers_black.cw * 2;
        // let numbers_h = AM.images.numbers_black.ch * 2;
        // this.timernumbers = [];
        // this.timernumbers[0] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.numbers_black.cw, AM.images.numbers_black.ch, 'numbers_black');
        // rescaleSize(this.timernumbers[0], sx, sx);
        // this.timernumbers[0].x = this.watch.x + this.watch.w / 2 - (this.timernumbers[0].w * 2 - this.timernumbers[0].w * 0.46) / 2;
        // this.timernumbers[0].y = this.watch.y + this.watch.h / 2 - this.timernumbers[0].h / 2 + 9 * sx;

        // this.timernumbers[1] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.numbers_black.cw, AM.images.numbers_black.ch, 'numbers_black');
        // rescaleSize(this.timernumbers[1], sx, sx);
        // this.timernumbers[1].x = this.timernumbers[0].x + this.timernumbers[0].w - this.timernumbers[0].w * 0.45;
        // this.timernumbers[1].y = this.timernumbers[0].y;

        this.initHUD();
        this.setGameoverScreen();

        let numbers_w = AM.images.endscore.cw * 1.25;
        let numbers_h = AM.images.endscore.ch * 1.25;
        this.endscore = [];
        this.endscore[0] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        this.endscore[1] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        this.endscore[2] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        this.endscore[3] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        rescaleSize(this.endscore[0], sx, sx);
        rescaleSize(this.endscore[1], sx, sx);
        rescaleSize(this.endscore[2], sx, sx);
        rescaleSize(this.endscore[3], sx, sx);

        this.initBattery();
        this.initBattery2();
        this.initMiniBattery(sx);

        rescaleSize(this.battery_rect, sx, sx);
        rescalePos(this.battery_rect, sx, sy);

        rescaleSize(this.battery_top, sx, sx);
        rescalePos(this.battery_top, sx, sy);

        rescaleSize(this.battery_logo, sx, sx);
        rescalePos(this.battery_logo, sx, sy);

        rescaleSize(this.battery_charge_lime, sx, sx);
        rescalePos(this.battery_charge_lime, sx, sy);

        rescaleSize(this.battery_charge_red, sx, sx);
        rescalePos(this.battery_charge_red, sx, sy);

        rescaleSize(this.battery_rect2, sx, sx);
        rescalePos(this.battery_rect2, sx, sy);

        rescaleSize(this.battery_top2, sx, sx);
        rescalePos(this.battery_top2, sx, sy);

        rescaleSize(this.battery_logo2, sx, sx);
        rescalePos(this.battery_logo2, sx, sy);

        rescaleSize(this.battery_charge_lime2, sx, sx);
        rescalePos(this.battery_charge_lime2, sx, sy);

        rescaleSize(this.battery_charge_red2, sx, sx);
        rescalePos(this.battery_charge_red2, sx, sy);

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
        

        this.battery_rect2.y = 440 * sy;
        this.battery_charge_lime2.y = this.battery_rect2.y + 4.5 * sy;
        this.battery_top2.y = 580 * sy;
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

        rescaleSize(this.timecircle, sx, sx);
        rescalePos(this.timecircle, sx, sy);

        rescaleSize(this.stopwatch, sx, sx);
        rescalePos(this.stopwatch, sx, sy);

        rescaleSize(this.complete, sx, sx);
        rescalePos(this.complete, sx, sy);

        rescaleSize(this.yourscore, sx, sx);
        rescalePos(this.yourscore, sx, sy);
        
        


        let paddingX = 50 * sx;
        let paddingY = 22 * sy;

        let pbW = 200 * sx;

        this.timecircle.x = w / 2 - pbW / 2 - this.timecircle.w / 2;
        this.stopwatch.x = this.timecircle.x;

        this.timeProgressBar = new ProgressBar(this.timecircle.x + paddingX, this.timecircle.h / 2 - 35 * sx / 2 + paddingY, pbW, 40 * sx);
        this.timeProgressBar.progress = 100;

        this.txt.addText('time', '90', 'bold', 25, 'Montserrat', 0, 0, 45, 45, '#000', true); 
        this.txt.centerTo('time', this.timecircle.x, this.timecircle.y, this.timecircle.w, this.timecircle.h);


        // gameover
        this.txt.addText('score', this.health + '%', 'bold', 30, 'Montserrat', w / 2, 420 * sy, 150, 55, '#fff', true);
        this.txt.addText('reset', 'Tap to play again.', 'bold', 30, 'Montserrat', w / 2, h * 0.65, 500, 40, '#fff', true);

        this.complete.x = w / 2 - this.complete.w / 2;
        this.yourscore.x = w / 2 - this.yourscore.w / 2;

        // this.updateGameoverBattery(-70);
        // this.txt.texts['score'].str = this.health + '%';
        this.updateBattery(-60);
    }

    initHUD() {
        const { w, h, sx, sy } = this;

        let volumePosX = 34;
        let volumePosY = 45;

        this.volume = new StaticSprite(volumePosX, volumePosY, 55 * 1.80, 55 * 1.80, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        this.mute = new StaticSprite(volumePosX, volumePosY, 55 * 1.80, 55 * 1.80, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

        let score_rect_w = AM.images.score_rect.cw * 2;
        let score_rect_h = AM.images.score_rect.ch * 2;
    
        this.score_rect = new StaticSprite(0, 0, score_rect_w, score_rect_h, 0, 0, AM.images.score_rect.cw, AM.images.score_rect.ch, 'score_rect');
        rescaleSize(this.score_rect, sx, sx);
        // this.score_rect.x = w - (this.score_rect.w + 20 * sx);
        this.score_rect.x = w / 2 - this.score_rect.w / 2;
        this.score_rect.y = 35 * sy;

        let numbers_w = AM.images.numbers_white.cw * 2.7;
        let numbers_h = AM.images.numbers_white.ch * 2.4;
        this.numbers = [];
        this.numbers[0] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.numbers_white.cw, AM.images.numbers_white.ch, 'numbers_white');
        rescaleSize(this.numbers[0], sx, sx);
        this.numbers[0].x = this.score_rect.x + this.score_rect.w - this.numbers[0].w * 1.75;
        this.numbers[0].y = this.score_rect.y + this.score_rect.h / 2 - this.numbers[0].h / 2 - 3 * sy;

        this.numbers[1] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.numbers_white.cw, AM.images.numbers_white.ch, 'numbers_white');
        rescaleSize(this.numbers[1], sx, sx);
        this.numbers[1].x = this.numbers[0].x + this.numbers[0].w - this.numbers[0].w * 0.43;
        this.numbers[1].y = this.score_rect.y + this.score_rect.h / 2 - this.numbers[1].h / 2 - 3 * sy;

        let watch_w = AM.images.watch.cw * 2.20;
        let watch_h = AM.images.watch.ch * 2.20;
    
        this.watch = new StaticSprite(0, 0, watch_w, watch_h, 0, 0, AM.images.watch.cw, AM.images.watch.ch, 'watch');
        rescaleSize(this.watch, sx, sx);

        let progressbar_w = AM.images.progressbar.cw * 3;
        let progressbar_h = AM.images.progressbar.ch * 2.5;
    
        this.progressbar = new StaticSprite(0, 0, progressbar_w, progressbar_h, 0, 0, AM.images.progressbar.cw, AM.images.progressbar.ch, 'progressbar');
        rescaleSize(this.progressbar, sx, sx);

        let timerprogress_w = AM.images.timeprogress.cw * 3;
        let timerprogress_h = AM.images.timeprogress.ch * 2.5;
    
        this.timeprogress = new StaticSprite(0, 0, timerprogress_w, timerprogress_h, 0, 0, AM.images.timeprogress.cw, AM.images.timeprogress.ch, 'timeprogress');
        rescaleSize(this.timeprogress, sx, sx);
        

        rescaleSize(this.volume, sx, sx);
        rescalePos(this.volume, sx, sy);

        rescaleSize(this.mute, sx, sx);
        rescalePos(this.mute, sx, sy);

        this.watch.x = this.volume.x + this.volume.w + 50 * scaleX;
        this.watch.y = 35 * sy;

        this.progressbar.x = this.watch.x + this.watch.w / 2;
        this.progressbar.y = this.watch.y + this.watch.h / 2 - this.progressbar.h / 2 + 10 * sy;

        this.timeprogress.w = this.timeprogress.w - this.watch.w / 2;

        this.timeprogress.ow = this.timeprogress.w;
        this.timeprogress.oh = this.timeprogress.h;

        this.timeprogress.x = this.progressbar.x + this.watch.w / 2 - 5 * sx;
        this.timeprogress.y = this.progressbar.y + this.progressbar.h / 2 - this.timeprogress.h / 2;

        numbers_w = AM.images.numbers_black.cw * 2;
        numbers_h = AM.images.numbers_black.ch * 2;
        this.timernumbers = [];
        this.timernumbers[0] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.numbers_black.cw, AM.images.numbers_black.ch, 'numbers_black');
        rescaleSize(this.timernumbers[0], sx, sx);
        this.timernumbers[0].x = this.watch.x + this.watch.w / 2 - (this.timernumbers[0].w * 2 - this.timernumbers[0].w * 0.46) / 2;
        this.timernumbers[0].y = this.watch.y + this.watch.h / 2 - this.timernumbers[0].h / 2 + 9 * sx;

        this.timernumbers[1] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.numbers_black.cw, AM.images.numbers_black.ch, 'numbers_black');
        rescaleSize(this.timernumbers[1], sx, sx);
        this.timernumbers[1].x = this.timernumbers[0].x + this.timernumbers[0].w - this.timernumbers[0].w * 0.45;
        this.timernumbers[1].y = this.timernumbers[0].y;
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

    updateTimerSprite(time, gameDuration) {
        let timer = parseInt(time);
        let percentage = timer / gameDuration;
        this.timeprogress.w = this.timeprogress.ow * percentage;
        this.timernumbers[0].clipX = this.timernumbers[0].clipW * time[0];
        this.timernumbers[1].clipX = this.timernumbers[1].clipW * time[1];
    }

    draw(ctx) {
        // this.timeProgressBar.draw(ctx);
        
        // this.timecircle.draw(ctx);
        // this.stopwatch.draw(ctx);

        this.progressbar.draw(ctx);
        this.timeprogress.draw(ctx);
        this.watch.draw(ctx);
        this.timernumbers[0].draw(ctx);
        this.timernumbers[1].draw(ctx);
        
        if (this.volumeOn) {
            this.volume.draw(ctx);
        } else {
            this.mute.draw(ctx);
        }

        
        
        // this.txt.draw('time');

        this.drawBattery(ctx);
        // this.txt.draw('score');
    }

    setGameoverScreen() {
        const { w, h, sx, sy } = this;
        let adjY = isTablet() ? 260 : 0;
        adjY *= sx;

        // let numbers_w = AM.images.endscore.cw * 1.25;
        // let numbers_h = AM.images.endscore.ch * 1.25;
        // this.endscore = [];
        // this.endscore[0] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        // this.endscore[1] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        // rescaleSize(this.endscore[0], sx, sx);
        // rescaleSize(this.endscore[1], sx, sx);

        let intersect_w = AM.images.intersect.cw * 1.5;
        let intersect_h = AM.images.intersect.ch * 1.5;
        this.intersect = new StaticSprite(0, 0, intersect_w, intersect_h, 0, 0, AM.images.intersect.cw, AM.images.intersect.ch, 'intersect');
        rescaleSize(this.intersect, sx, sx);

        this.intersect.x = w / 2 - this.intersect.w / 2 - 15 * sx;
        this.intersect.y = this.splashInfo.y + 30 * sx + adjY;
        this.intersectT = 0;

        let key = isPremium ? 'premium_endscreen_buttons' : 'endscreen_buttons';
        let endscreenButtonsW = AM.images[key].cw * 1;
        let endscreenButtonsH = AM.images[key].ch * 1;
        this.endscreenButtons = new StaticSprite(0, 0, endscreenButtonsW, endscreenButtonsH, 0, 0, AM.images[key].cw, AM.images[key].ch, key);
        rescaleSize(this.endscreenButtons, sx, sx);

        this.endscreenButtons.x = w / 2 - this.endscreenButtons.w / 2;
        adjY = isPremium ? this.endscreenButtons.h * 1.25 : this.endscreenButtons.h * 1.10;
        if (isTablet()) {
            adjY += (isPremium ? 200 : 150) * sx;
        }
        this.endscreenButtons.y = h - adjY - this.splashInfo.y / 2;
    }

    updateGameoverScore(splashInfo) {
        let adjY = isTablet() ? 310 : 0;
        adjY *= this.sx;

        score = Math.ceil(this.health).toString();

        if (this.health < 10) {
            this.endscore[0].clipX = this.endscore[0].clipW * score;
            this.endscore[3].clipX = this.endscore[1].clipW * 12;

            this.endscore[0].x = this.w / 2 - this.endscore[0].w;
            this.endscore[0].y = 200 * splashInfo.sx + splashInfo.y + adjY;

            this.endscore[3].x = this.endscore[0].x + this.endscore[1].w * 0.95;
            this.endscore[3].y = this.endscore[0].y;
        } else if (this.health < 100) {
            this.endscore[0].clipX = this.endscore[0].clipW * score[0];
            this.endscore[1].clipX = this.endscore[1].clipW * score[1];
            this.endscore[3].clipX = this.endscore[1].clipW * 12;

            this.endscore[0].x = this.w / 2 - this.endscore[0].w * 1.5;
            this.endscore[0].y = 200 * splashInfo.sx + splashInfo.y + adjY;

            this.endscore[1].x = this.endscore[0].x + this.endscore[1].w * 0.85;
            this.endscore[1].y = this.endscore[0].y;

            this.endscore[3].x = this.endscore[0].x + this.endscore[1].w * 2 * 0.95;
            this.endscore[3].y = this.endscore[0].y;
        } else {
            this.endscore[0].clipX = this.endscore[0].clipW * score[0];
            this.endscore[1].clipX = this.endscore[1].clipW * score[1];
            this.endscore[2].clipX = this.endscore[1].clipW * score[2];
            this.endscore[3].clipX = this.endscore[1].clipW * 12;

            this.endscore[0].x = this.w / 2 - this.endscore[0].w * 2;
            this.endscore[0].y = 200 * splashInfo.sx + splashInfo.y + adjY;

            this.endscore[1].x = this.endscore[0].x + this.endscore[1].w * 0.85;
            this.endscore[1].y = this.endscore[0].y;

            this.endscore[2].x = this.endscore[0].x + this.endscore[1].w * 2 * 0.85;
            this.endscore[2].y = this.endscore[0].y;

            this.endscore[3].x = this.endscore[0].x + this.endscore[1].w * 3 * 0.95;
            this.endscore[3].y = this.endscore[0].y;
        }
        
        
    }

    drawIntersect(delta) {

        this.intersectT += 10 * delta;
        // let rotateZ = 
        ctx.save();
        // Untransformed draw position
        const position = {x: this.intersect.x, y: this.intersect.y};
        // In degrees
        const rotation = { x: 0, y: 0, z: this.intersectT};
        // Rotation relative to here (this is the center of the image)
        const rotPt = { x: this.intersect.w / 2, y: this.intersect.h / 2 };
        // const rotPt = { x: rx, y: ry };

        ctx.setTransform(new DOMMatrix()
            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
            .rotateSelf(rotation.x, rotation.y, rotation.z)
        );
        
        ctx.drawImage(AM.images.intersect.img, this.intersect.clipX, this.intersect.clipY, this.intersect.clipW, this.intersect.clipH, -rotPt.x, -rotPt.y, this.intersect.w, this.intersect.h);
        ctx.restore();
    }

    gameover(ctx, splashInfo, delta) {
        // ctx.save();
        // ctx.globalAlpha = 1;
        // ctx.fillStyle = '#000';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.restore();

        // this.complete.draw(ctx);
        // this.yourscore.draw(ctx);
        
        // this.drawBatteryRotate(ctx, -90);
        
        // this.txt.draw('score');

        this.updateGameoverScore(splashInfo);

        ctx.drawImage(AM.images.endscreen.img, 0, 0, AM.images.endscreen.cw, AM.images.endscreen.ch, splashInfo.x, splashInfo.y, splashInfo.w, splashInfo.h);
        
        this.drawIntersect(delta);
        
        this.endscore[0].draw(ctx);
        if (this.health > 9) {
            this.endscore[1].draw(ctx);
            if (this.health == 100) {
                this.endscore[2].draw(ctx);
            }
        }
        this.endscore[3].draw(ctx);

        this.endscreenButtons.draw(ctx);
        
        // this.txt.draw('reset');
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