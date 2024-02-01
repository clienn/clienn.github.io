class Template_1 {
    constructor(ctx, w, h, sx, sy, splashInfo) {
        
        this.isMuted = false;
        this.txt = new Text(ctx, w, h); 
        this.txt.setScale(sx, sy); 

        this.w = w;
        this.h = h;
        this.sx = sx;
        this.sy = sy;
        this.splashInfo = splashInfo;

        this.finalScore = 0;

        this.volumeOn = true;

        this.initHUD();
        this.setGameoverScreen();

        // let volumePosX = 7;
        // let volumePosY = 25;

        // this.volume = new StaticSprite(volumePosX, volumePosY, 55 * 1.5, 55 * 1.5, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        // this.mute = new StaticSprite(volumePosX, volumePosY, 55 * 1.5, 55 * 1.5, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

        let paddingX = 20 * sx + this.volume.w;
        let paddingY = 10 * sy;

        // this.timecircle = new StaticSprite(this.volume.x + this.volume.w + 10, this.volume.y + this.volume.h / 2 - 90 / 2, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        // // this.timecircle = new StaticSprite(10 + paddingX, 10, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        // this.stopwatch = new StaticSprite(this.volume.x + this.volume.w + 10, this.volume.y + this.volume.h / 2 - 90 / 2, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');
        // // this.stopwatch = new StaticSprite(10 + paddingX, 10, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');

        // this.life = new StaticSprite(0, 0, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.life.cw, AM.images.life.ch, 'life');
        this.healthbar = new StaticSprite(0, 0, AM.images.healthbar.cw, AM.images.healthbar.ch, 0, 0, AM.images.healthbar.cw, AM.images.healthbar.ch, 'healthbar');
        // this.coin0 = new StaticSprite(0, 0, 60, 60, 0, 0, AM.images.coin_0.cw, AM.images.coin_0.ch, 'coin_0');
        
        // let gameoverAdjY = 180;

        // this.shine = new StaticSprite(0, 80 + gameoverAdjY, 352, 290, 0, 0, AM.images.shine.cw, AM.images.shine.ch, 'shine');
        // this.pigscore = new StaticSprite(0, 140 + gameoverAdjY, 120 * 2, 90 * 2, 0, 0, AM.images.pigscore.cw, AM.images.pigscore.ch, 'pigscore');

        

        // this.volume = new StaticSprite(30, this.timecircle.h + 20, 25 * 2, 25 * 2, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        // this.mute = new StaticSprite(30, this.timecircle.h + 20, 25 * 2, 25 * 2, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

        // rescaleAll(this.timecircle, sx, sy);
        // rescaleAll(this.stopwatch, sx, sy);
        rescaleSize(this.healthbar, sx, sx);

        // rescaleSize(this.life, sx, sx);
        // rescalePos(this.life, sx, sy);
        // rescaleAll(this.coin0, sx, sy);
        // rescaleAll(this.shine, sx, sy);
        // rescaleAll(this.pigscore, sx, sy);
        // rescaleAll(this.volume, sx, sy);
        // rescaleAll(this.mute, sx, sy);
        
        

        // this.timeProgressBar = new ProgressBar(this.timecircle.x + this.timecircle.w / 2, this.timecircle.y + this.timecircle.h / 2 - 45 / 2 * scaleY, 200 * sx, 45 * sy);
        // // this.timeProgressBar = new ProgressBar(this.timecircle.w / 2 + paddingX / 1.5, this.timecircle.h / 2 - 30 * sx / 2 + paddingY, 200 * sx, 45 * sy);
        // this.timeProgressBar.progress = 100;

        // let scorebarWidth = 200 * sx + 70 * sy;

        // this.scoreBar = new ProgressBar(w / 2 - scorebarWidth / 2, 20 * sy, 200 * sx, 70 * sy, '#15441D');
        // this.scoreBar.progress = 100;

        // this.coin0.x = this.scoreBar.x + 10 * scaleX;
        // this.coin0.y = this.scoreBar.y + this.scoreBar.h / 2 - this.coin0.h / 2;

        // let txtY = 32 * sy;
        // // if (isMobile()) txtY = 12 * sy;
        // let scoreTxtW = 80 * 1.5;
        // // let scorebarWidth = this.scoreBar.w + this.scoreBar.h;


        // this.txt.addText('score', '00.00', 'bold', 20, 'Montserrat', this.scoreBar.x + scorebarWidth / 2 + 20 * sx, this.scoreBar.y + 10 * sy, scoreTxtW, 30 * 1.5, '#fff', true); 
        // let adjX = isMobile() ? this.scoreBar.h : this.scoreBar.h / 2;
        // this.txt.centerTo('score', this.scoreBar.x + this.scoreBar.w - this.txt.texts['score'].w + 20 * scaleX, this.scoreBar.y, this.scoreBar.w + this.scoreBar.h / 2, this.scoreBar.h);
        // this.txt.centerTo('score', this.scoreBar.x + this.scoreBar.w - this.txt.texts['score'].w + 20 * sx, this.scoreBar.y, this.scoreBar.w + this.scoreBar.h / 2, this.scoreBar.h);

        // adjX = isMobile() ? 50 : 0;
        // console.log(adjX);

        // this.lifebar = new ProgressBar(w - this.life.w - 100 * sx / 2 - 25 * sy - adjX, this.life.h / 2 - 25 * sx / 2 + paddingY, 160 * sx, 35 * sy);
        // this.lifebar = new ProgressBar(w - 260 * sx, this.score_rect.y + this.life.h / 2 - 35 * sx / 2, 160 * sx, 35 * sx);
        // // this.lifebar.y = this.score_rect.y;
        // this.lifebar.progress = 100;

        // this.life.x = this.lifebar.x - this.life.w / 2;
        // this.life.y = this.score_rect.y;

        this.healthbar.x = w * 0.98 - this.healthbar.w;
        this.healthbar.y = this.score_rect.y;

        // this.txt.addText('time', '90', 'bold', 20, 'Montserrat', 0, this.timecircle.y, 30 * 1.5, 30 * 1.5, '#000', true); 
        // this.txt.centerTo('time', this.timecircle.x, this.timecircle.y, this.timecircle.w, this.timecircle.h);

        // this.txt.addText('x', 'x', 'normal', 20, 'Montserrat', 
        //     w / 2, topHUDInfo.score.y + (scoreAdjY + 2) * scaleY, 20, topHUD.score.fontH, '#fff', true); 

        // this.txt.addText('score', '00', (isMobile ? 'normal' : 'bold'), topHUD.score.fontS, 'Montserrat', 
        // w / 2 + 50 * scaleX, topHUDInfo.score.y + scoreAdjY * scaleY, topHUD.score.fontW, topHUD.score.fontH, '#fff', true);

        //#15441D
        // alert(h + ' ' + this.txt.texts['score'].h + ' ' + this.txt.texts['score'].y);

        // gameover
        // this.txt.addText('complete', 'Complete!', 'bold', 30, 'Montserrat', w / 2, this.shine.y - 50 * sy, 180 * 2, 35 * 2, '#fff', true);
        // this.txt.addText('total', '$00.00', 'bold', 30, 'Montserrat', w / 2, this.shine.y + this.shine.h - 25 * sy, 100 * 2, 35 * 2, '#fff', true);
        // this.txt.addText('reset', 'Tap to play again.', 'bold', 30, 'Montserrat', w / 2, h / 2, 700, 100, '#fff', true);
        // this.shine.x = w / 2 - this.shine.w / 2;
        // this.pigscore.x = w / 2 - this.pigscore.w / 2;
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

        let numbers_w = AM.images.numbers_white.cw * 1;
        let numbers_h = AM.images.numbers_white.ch * 1;
        this.numbers = [];
        this.numbers[0] = new StaticSprite(0, 0, numbers_w, numbers_h, AM.images.numbers_white.cw * 11, 0, AM.images.numbers_white.cw, AM.images.numbers_white.ch, 'numbers_white');
        rescaleSize(this.numbers[0], sx, sx);
        this.numbers[0].x = this.score_rect.x + this.score_rect.w - this.numbers[0].w * 4.50;
        this.numbers[0].y = this.score_rect.y + this.score_rect.h / 2 - this.numbers[0].h / 2 - 3 * sy;

        this.numbers[1] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.numbers_white.cw, AM.images.numbers_white.ch, 'numbers_white');
        rescaleSize(this.numbers[1], sx, sx);
        this.numbers[1].x = this.numbers[0].x + this.numbers[0].w - this.numbers[0].w * 0.35;
        this.numbers[1].y = this.score_rect.y + this.score_rect.h / 2 - this.numbers[1].h / 2 - 3 * sy;

        this.numbers[2] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.numbers_white.cw, AM.images.numbers_white.ch, 'numbers_white');
        rescaleSize(this.numbers[2], sx, sx);
        this.numbers[2].x = this.numbers[1].x + this.numbers[0].w - this.numbers[0].w * 0.35;
        this.numbers[2].y = this.score_rect.y + this.score_rect.h / 2 - this.numbers[1].h / 2 - 3 * sy;

        this.numbers[3] = new StaticSprite(0, 0, numbers_w, numbers_h, AM.images.numbers_white.cw * 10, 0, AM.images.numbers_white.cw, AM.images.numbers_white.ch, 'numbers_white');
        rescaleSize(this.numbers[3], sx, sx);
        this.numbers[3].x = this.numbers[2].x + this.numbers[0].w - this.numbers[0].w * 0.45;
        this.numbers[3].y = this.score_rect.y + this.score_rect.h / 2 - this.numbers[1].h / 2 - 3 * sy;

        this.numbers[4] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.numbers_white.cw, AM.images.numbers_white.ch, 'numbers_white');
        rescaleSize(this.numbers[4], sx, sx);
        this.numbers[4].x = this.numbers[3].x + this.numbers[0].w - this.numbers[0].w * 0.45;
        this.numbers[4].y = this.score_rect.y + this.score_rect.h / 2 - this.numbers[1].h / 2 - 3 * sy;

        this.numbers[5] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.numbers_white.cw, AM.images.numbers_white.ch, 'numbers_white');
        rescaleSize(this.numbers[5], sx, sx);
        this.numbers[5].x = this.numbers[4].x + this.numbers[0].w - this.numbers[0].w * 0.35;
        this.numbers[5].y = this.score_rect.y + this.score_rect.h / 2 - this.numbers[1].h / 2 - 3 * sy;

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

    setGameoverScreen() {
        const { w, h, sx, sy } = this;
        let adjY = isTablet() ? 260 : 0;
        adjY *= sx;

        let numbers_w = AM.images.endscore.cw * 1.25;
        let numbers_h = AM.images.endscore.ch * 1.25;
        this.endscore = [];
        this.endscore[0] = new StaticSprite(0, 0, numbers_w, numbers_h, AM.images.endscore.cw * 11, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        this.endscore[1] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        this.endscore[2] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        this.endscore[3] = new StaticSprite(0, 0, numbers_w, numbers_h, AM.images.endscore.cw * 10, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        this.endscore[4] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        this.endscore[5] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        rescaleSize(this.endscore[0], sx, sx);
        rescaleSize(this.endscore[1], sx, sx);
        rescaleSize(this.endscore[2], sx, sx);
        rescaleSize(this.endscore[3], sx, sx);
        rescaleSize(this.endscore[4], sx, sx);
        rescaleSize(this.endscore[5], sx, sx);

        let intersect_w = AM.images.intersect.cw * 1.5;
        let intersect_h = AM.images.intersect.ch * 1.5;
        this.intersect = new StaticSprite(0, 0, intersect_w, intersect_h, 0, 0, AM.images.intersect.cw, AM.images.intersect.ch, 'intersect');
        rescaleSize(this.intersect, sx, sx);

        this.intersect.x = w / 2 - this.intersect.w / 2 - 15 * sx;
        this.intersect.y = this.splashInfo.y + 30 * sx + adjY;
        this.intersectT = 0;

        // let key = isPremium ? 'premium_endscreen_buttons' : 'endscreen_buttons';
        let key = 'return_home';
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

    updateScoreSprite(score) {
        let str = score.split('.');
        this.numbers[1].clipX = this.numbers[0].clipW * str[0][0];
        this.numbers[2].clipX = this.numbers[1].clipW * str[0][1];

        this.numbers[4].clipX = this.numbers[0].clipW * str[1][0];
        this.numbers[5].clipX = this.numbers[1].clipW * str[1][1];
    }

    updateTimerSprite(time, gameDuration) {
        let timer = parseInt(time);
        let percentage = timer / gameDuration;
        this.timeprogress.w = this.timeprogress.ow * percentage;
        this.timernumbers[0].clipX = this.timernumbers[0].clipW * time[0];
        this.timernumbers[1].clipX = this.timernumbers[1].clipW * time[1];
    }

    updateGameoverScore(splashInfo, score) {
        let adjY = isTablet() ? 310 : 0;
        adjY *= this.sx;

        // this.endscore[0].clipX = this.endscore[0].clipW * score[0];
        // this.endscore[1].clipX = this.endscore[1].clipW * score[1];
        this.finalScore = score;
        let mid = this.w / 2 - this.endscore[0].w * 5 / 2.2;
        if (score < 10) {
            mid = this.w / 2 - this.endscore[0].w * 4 / 2.2
        }

        let str = score.split('.');
        this.endscore[1].clipX = this.endscore[0].clipW * str[0][0];
        this.endscore[2].clipX = this.endscore[1].clipW * str[0][1];

        this.endscore[4].clipX = this.endscore[0].clipW * str[1][0];
        this.endscore[5].clipX = this.endscore[1].clipW * str[1][1];

        this.endscore[0].x = mid;
        this.endscore[0].y = 200 * splashInfo.sx + splashInfo.y + adjY;

        this.endscore[1].x = this.endscore[0].x + this.endscore[0].w - this.endscore[0].w * 0.35;
        this.endscore[1].y = this.endscore[0].y;

        if (score < 10) {
            this.endscore[2].x = this.endscore[0].x + this.endscore[0].w - this.endscore[0].w * 0.20;
        } else {
            this.endscore[2].x = this.endscore[1].x + this.endscore[0].w - this.endscore[0].w * 0.20;
        }
        this.endscore[2].y = this.endscore[0].y;

        this.endscore[3].x = this.endscore[2].x + this.endscore[0].w - this.endscore[0].w * 0.45;
        this.endscore[3].y = this.endscore[0].y;

        this.endscore[4].x = this.endscore[3].x + this.endscore[0].w - this.endscore[0].w * 0.45;
        this.endscore[4].y = this.endscore[0].y;

        this.endscore[5].x = this.endscore[4].x + this.endscore[0].w - this.endscore[0].w * 0.20;
        this.endscore[5].y = this.endscore[0].y;
    }

    draw(ctx) {
        this.score_rect.draw(ctx);
        this.numbers[0].draw(ctx);
        this.numbers[1].draw(ctx);
        this.numbers[2].draw(ctx);
        this.numbers[3].draw(ctx);
        this.numbers[4].draw(ctx);
        this.numbers[5].draw(ctx);

        this.progressbar.draw(ctx);
        this.timeprogress.draw(ctx);
        this.watch.draw(ctx);
        this.timernumbers[0].draw(ctx);
        this.timernumbers[1].draw(ctx);
        // this.duck.draw(ctx);
        
        if (this.volumeOn) {
            this.volume.draw(ctx);
        } else {
            this.mute.draw(ctx);
        }

        // this.timeProgressBar.draw(ctx);
        // this.scoreBar.draw(ctx, 100);
        
        // this.timecircle.draw(ctx);
        // this.stopwatch.draw(ctx);
        // this.coin0.draw(ctx);

        // this.lifebar.draw(ctx);
        // this.life.draw(ctx);

        this.healthbar.draw(ctx);
        // if (this.volumeOn) {
        //     this.volume.draw(ctx);
        // } else {
        //     this.mute.draw(ctx);
        // }
        
        // this.txt.draw('time');
        // this.txt.draw('score');

        // ctx.beginPath();
        // ctx.rect(this.txt.texts['score'].x, this.txt.texts['score'].y, this.txt.texts['score'].w, this.txt.texts['score'].h);
        // ctx.stroke();

        // ctx.font = 'bold 20px Montserrat';
        // ctx.textAlign = 'left';
        // ctx.textBaseline = 'top';
        // ctx.fillStyle = '#f00';
        // ctx.fillText('text', 0, 0);
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

    updateHealthbar(health) {
        let clipY = (4 - Math.floor(health / 25)) * AM.images.healthbar.ch;
        // console.log(health)
        this.healthbar.clipY = clipY;
    }

    gameover(ctx, splashInfo, delta) {
        // ctx.save();
        // ctx.globalAlpha = 0.85;
        // ctx.fillStyle = '#000';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.restore();

        // this.shine.draw(ctx);
        // this.pigscore.draw(ctx);
        // this.txt.draw('complete');
        // this.txt.draw('total');
        // this.txt.draw('reset');

        // this.updateGameoverScore(splashInfo, '10.23');
        // this.updateGameoverScore(splashInfo, '05.20');
        // this.updateGameoverScore(splashInfo, '99.22');

        ctx.drawImage(AM.images.endscreen.img, 0, 0, AM.images.endscreen.cw, AM.images.endscreen.ch, splashInfo.x, splashInfo.y, splashInfo.w, splashInfo.h);

        this.drawIntersect(delta);
        
        this.endscore[0].draw(ctx);

        if (this.finalScore >= 10) {
            this.endscore[1].draw(ctx);
        }
        
        this.endscore[2].draw(ctx);
        this.endscore[3].draw(ctx);
        this.endscore[4].draw(ctx);
        this.endscore[5].draw(ctx);
        // this.txt.draw('score2');
        // this.txt.draw('reset');

        this.endscreenButtons.draw(ctx);
    }

    // draw(ctx) {
    //     const { x, y, w, h } = topHUDInfo.timer;
        
    //     ctx.drawImage(images.timecircle.obj.img, 0, 0, topHUD.timer.timecircle.cw, 
    //         topHUD.timer.timecircle.ch, x, y, topHUD.timer.timecircle.w, topHUD.timer.timecircle.h);
    
    //     ctx.drawImage(images.stopwatch.obj.img, 0, 0, topHUD.timer.stopwatch.cw, 
    //         topHUD.timer.stopwatch.ch, x, y, topHUD.timer.stopwatch.w, topHUD.timer.stopwatch.h);
        
    //     let volumeKey = 'mute';
    //     if (volumeOn) {
    //         volumeKey = 'volume';
    //     }
    
    //     ctx.drawImage(images[volumeKey].obj.img, 0, 0, volumeInfo.cw, 
    //         volumeInfo.ch, volumeInfo.x, volumeInfo.y + y, volumeInfo.w, volumeInfo.h);

        
    //     let timeText = showTarget ? '09' : zeroPad(Math.floor(timer.timer / 24), 2);

    //     TXT.texts[TEXT_ID.TOPTIMER].str = timeText;
    //     TXT.draw(TEXT_ID.TOPTIMER);
    // }

    // drawScoreHUD() {
    //     const { x, y, w, h, pw } = topHUDInfo.score;
    //     const p = pw;
        
    //     /* To visalize ------------------------------------------------------*/
    //     ctx.beginPath();
    //     ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    //     ctx.lineTo(w + x, 0 + y);
    //     ctx.arc((h / 2) + w + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    //     ctx.lineTo(h / 2 + x, h + y);
    //     ctx.strokeStyle = '#fff';
    //     ctx.lineWidth = 5;
    //     ctx.stroke();
    //     ctx.closePath();
    
    //     ctx.beginPath();
    //     ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    //     ctx.lineTo(w + x, 0 + y);
    //     ctx.arc((h / 2) + w + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    //     ctx.lineTo(h / 2 + x, h + y);
    //     ctx.fillStyle = '#569E1A';
    //     // ctx.lineWidth = 5;
    //     ctx.fill();
    //     ctx.closePath();
    //     /* ------------------------------------------------------------------*/
    
    
    //     // ctx.beginPath();
    //     // ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    //     // ctx.lineTo(p - 2 * h + x, 0 + y);
    //     // ctx.arc(p - (h / 2) + x, h / 2 + y, h / 2, 3 / 2 * Math.PI,Math.PI / 2);
    //     // ctx.lineTo(h / 2 + x, h + y);
    //     // ctx.fillStyle = "#569E1A";
    //     // ctx.fill();
    //     // ctx.strokeStyle = '#fff';
    //     // ctx.stroke();
    
    //     ctx.drawImage(images.turtleshine.obj.img, 0, 0, topHUD.score.turtleshine.cw, 
    //         topHUD.score.turtleshine.ch, x + 5 * scaleX, y, topHUD.score.turtleshine.w, topHUD.score.turtleshine.h);
    
    //     // TM.draw(textList.scoreX.obj);
    //     TXT.draw(TEXT_ID.SCOREX);
    //     // textList.scoreN.obj.str = zeroPad(score, 2);
    //     // TM.draw(textList.scoreN.obj);
    //     TXT.texts[TEXT_ID.SCORE].str = zeroPad(score, 2);
    //     TXT.draw(TEXT_ID.SCORE);
    // }
    
    // drawProgress() {
    //     const { w } = topHUDInfo.timer;
    //     // let w =
    //     const { x, y, h, max } = topHUDInfo.timer.progress;
    //     // let p = showTarget ? max * scaleX : (max * scaleX * (timer.timer / (9.0 * 24)));
    //     let p = showTarget ? w : (w * (timer.timer / (9.0 * 24)));
    
    //     // if ((h / 2) - p > 0) {
    //     //     p = 0;
    //     // }
    
    //     // const grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
    //     const grd = ctx.createLinearGradient(0, 0, 0, p);
    //     // grd.addColorStop(0, "#F8E7CD");
    //     // grd.addColorStop(1, "#FEB466"); 
    
    //     let percent = p / (max * scaleX);
    
    //     // let pColor = '';
    
    //     // if (percent > 0.7) {
    //     //     pColor = '#4ED20E';
    //     // } else if (percent > 0.20) {
    //     //     pColor = '#83DF56';
    //     // } else {
    //     //     pColor = '#fb2121';
    //     // }
        
    //     if (percent > 0.7) {
    //         grd.addColorStop(0, "#4ED20E");
    //         grd.addColorStop(0.5, "#83DF56");
    //         grd.addColorStop(1, "#59DC19");
    //     } else {
    //         grd.addColorStop(0, "#fb2121");
    //         grd.addColorStop(0.5, "#f9a139");
    //         grd.addColorStop(1, "#fb2121");
    //     }
    
    //     /* To visalize ------------------------------------------------------*/
    //     ctx.beginPath();
    //     ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    //     ctx.lineTo(w + x, 0 + y);
    //     ctx.arc((h / 2) + w + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    //     ctx.lineTo(h / 2 + x, h + y);
    //     ctx.strokeStyle = '#fff';
    //     ctx.lineWidth = 3;
    //     ctx.stroke();
    //     ctx.closePath();
    //     /* ------------------------------------------------------------------*/
    
    //     ctx.beginPath();
    //     ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    //     ctx.lineTo(w + x, 0 + y);
    //     ctx.arc((h / 2) + p + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    //     ctx.lineTo(h / 2 + x, h + y);
    //     ctx.fillStyle = grd;
    //     ctx.fill();
    //     ctx.closePath();
    
    //     // if(p <= h){
    //     //     // ctx.beginPath();
    //     //     // ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
    //     //     // ctx.save();
    //     //     // ctx.scale(-1, 1);
    //     //     // ctx.arc((h / 2) - p + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
    //     //     // ctx.restore();
    //     //     // ctx.fillStyle = grd;
    //     //     // ctx.fill();
    //     // } else {
    //     //     ctx.beginPath();
    //     //     ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    //     //     ctx.lineTo(p - 2 * h + x, 0 + y);
    //     //     ctx.arc(p - (h / 2) + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    //     //     ctx.lineTo(h / 2 + x, h + y);
    //     //     // ctx.fillStyle = grd;
    //     //     ctx.fillStyle = pColor;
    //     //     ctx.fill();
    //     // }
    // }
}