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

        this.volumeOn = true;
        // this.volume = new StaticSprite(7, 25, 55 * 1.5, 55 * 1.5, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        // this.mute = new StaticSprite(7, 25, 55 * 1.5, 55 * 1.5, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');
        // // this.timecircle = new StaticSprite(10, 10, 60, 60, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        // // this.stopwatch = new StaticSprite(10, 10, 60, 60, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');
        // this.hourglass = new StaticSprite(this.volume.x + this.volume.w + 10, this.volume.y + this.volume.h / 2 - 90 / 2, 60, 80, 0, 0, AM.images.hourglass.cw, AM.images.hourglass.ch, 'hourglass');

        // // this.life = new StaticSprite(0, 10, 60, 60, 0, 0, AM.images.life.cw, AM.images.life.ch, 'life');
        // this.star = new StaticSprite(0, 0, 60, 60, 0, 0, AM.images.star.cw, AM.images.star.ch, 'star');
        // // this.emptystar = new StaticSprite(0, 0, 60, 60, 0, 0, AM.images.emptystar.cw, AM.images.emptystar.ch, 'emptystar');
        // let adjY = 170;
        // this.shine = new StaticSprite(0, adjY, 309, 309, 0, 0, AM.images.shine.cw, AM.images.shine.ch, 'shine');
        // this.rays = new StaticSprite(0, adjY, 309, 309, 0, 0, AM.images.rays.cw, AM.images.rays.ch, 'rays');
        // this.complete = new StaticSprite(0, 50 + adjY, 370, 50, 0, 0, AM.images.complete.cw, AM.images.complete.ch, 'complete');
        // // this.pigscore = new StaticSprite(0, 80, 120, 90, 0, 0, AM.images.pigscore.cw, AM.images.pigscore.ch, 'pigscore');

        this.initHUD();
        this.setGameoverScreen();
        

        // rescaleSize(this.hourglass, sx, sx);
        // rescalePos(this.hourglass, sx, sy);

        // rescaleSize(this.complete, sx, sx);
        // rescalePos(this.complete, sx, sy);
        // // rescaleAll(this.life, sx, sy);
        // rescaleSize(this.star, sx, sx);
        // rescalePos(this.star, sx, sy);
        // // rescaleAll(this.emptystar, sx, sy);
        // rescaleSize(this.shine, sx, sx);
        // rescalePos(this.shine, sx, sy);

        // rescaleSize(this.rays, sx, sx);
        // rescalePos(this.rays, sx, sy);
        // // rescaleAll(this.pigscore, sx, sy);
        // rescaleSize(this.volume, sx, sx);
        // rescalePos(this.volume, sx, sy);

        // rescaleSize(this.mute, sx, sx);
        // rescalePos(this.mute, sx, sy);
        
        // let paddingX = 15 * sx;
        // let paddingY = 10 * sy;

        // this.complete.x = w / 2 - this.complete.w / 2;
        // this.shine.x = w / 2 - this.shine.w / 2;
        // this.rays.x = w / 2 - this.rays.w / 2;

        
        
        // this.timeProgressBar = new ProgressBar(this.hourglass.x + paddingX * 2, this.hourglass.y + this.hourglass.h / 2 - 45 * sy / 2 + paddingY, 160 * sx, 35 * sx);
        // // this.timeProgressBar = new ProgressBar(this.hourglass.x + paddingX * 2, this.hourglass.h / 2 - 30 * sx / 2 + paddingY, 160 * sx, 35 * sy);
        // this.timeProgressBar.progress = 100;

        // this.scoreBar = new ProgressBar(w / 2 - 50 * sx / 2 - 70 * sy, paddingY, 50 * sx, 70 * sx, '#00ABC8');
        // this.scoreBar.progress = 100;
        

        // this.star.x = this.scoreBar.x + paddingX / 2;
        // this.star.y = this.scoreBar.y + this.scoreBar.h / 2 - this.star.h / 2;

        // this.txt.addText('score', '00', 'bold', 20, 'Montserrat', 0, 0, 40, 40, '#fff', true); 
        // let adjX = isMobile() ? this.scoreBar.h : this.scoreBar.h / 2;
        // this.txt.centerTo('score', this.scoreBar.x + this.scoreBar.w / 2 + adjX + paddingX, this.scoreBar.y, this.scoreBar.w + this.scoreBar.h / 2, this.scoreBar.h);

        // adjX = isMobile() ? 50 : 0;
        // // console.log(adjX);

        // // this.lifebar = new ProgressBar(w - this.life.w - 100 * sx / 2 - 25 * sy - adjX, this.life.h / 2 - 25 * sx / 2 + paddingY, 100 * sx, 25 * sy);
        // // this.lifebar.progress = 100;

        // // this.life.x = this.lifebar.x - this.life.w / 2;

        // this.txt.addText('time', '90', 'normal', 20, 'Montserrat', 0, 0, 30, 30, '#000', true); 
        // this.txt.centerTo('time', this.hourglass.x, this.hourglass.y, this.hourglass.w, this.hourglass.h);

        // // this.txt.addText('x', 'x', 'normal', 20, 'Montserrat', 
        // //     w / 2, topHUDInfo.score.y + (scoreAdjY + 2) * scaleY, 20, topHUD.score.fontH, '#fff', true); 

        // // this.txt.addText('score', '00', (isMobile ? 'normal' : 'bold'), topHUD.score.fontS, 'Montserrat', 
        // // w / 2 + 50 * scaleX, topHUDInfo.score.y + scoreAdjY * scaleY, topHUD.score.fontW, topHUD.score.fontH, '#fff', true);

        // //#15441D
        // // this.shine.y = this.complete.y + this.complete.h + this.star.h * 2;
        // this.shine.y = this.complete.y + this.complete.h;
        // this.rays.y = this.shine.y;

        // // gameover
        // this.txt.addText('yourscore', 'Your Score!', 'bold', 30, 'Montserrat', w / 2, this.complete.y + this.complete.h + 40 * scaleY, 175, 30, '#fff', true);
        // // this.txt.addText('yourscore', 'Your Score!', 'bold', 30, 'Montserrat', w / 2, this.complete.y + this.complete.h + this.star.h * 3, 175, 30, '#fff', true);
        // // this.txt.addText('total', '00', 'bold', 30, 'Montserrat', w / 2, this.complete.y + this.complete.h + this.star.h * 3.7, 150, 125, '#fff', true);
        // this.txt.addText('betterluck', 'Better Luck Next Time', 'bold', 30, 'Montserrat', w / 2, this.complete.y + this.complete.h + this.star.h * 4 + 120 * sy, 350, 25, '#F78A3B', true);
        // this.txt.addText('reset', 'Tap to play again.', 'bold', 30, 'Montserrat', w / 2, h / 1.5, 500, 40, '#fff', true);
        // // this.shine.x = w / 2 - this.shine.w / 2;
        // // this.pigscore.x = w / 2 - this.pigscore.w / 2;

        // let starW = 100 * scaleX;
        // let starH = 100 * scaleY;
        // this.starPos = [
        //     [w / 2 - starW / 2 - starW, this.complete.y + this.complete.h + this.star.h, starW, starH],
        //     [w / 2 - starW / 2, this.complete.y + this.complete.h + this.star.h - this.star.w / 2, starW, starH],
        //     [w / 2 - starW / 2 + starW, this.complete.y + this.complete.h + this.star.h, starW, starH]
        // ];

        // this.scoreBar.w = 100;

        // // this.updateFinalScore(10);
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

        // console.log(this.score_rect.x, this.score_rect.y);

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

        // console.log()
    }

    updateGameoverScore(splashInfo, score) {
        let adjY = isTablet() ? 310 : 0;
        adjY *= this.sx;

        this.endscore[0].clipX = this.endscore[0].clipW * score[0];
        this.endscore[1].clipX = this.endscore[1].clipW * score[1];

        this.endscore[0].x = this.w / 2 - this.endscore[0].w;
        this.endscore[0].y = 200 * splashInfo.sx + splashInfo.y + adjY;

        this.endscore[1].x = this.endscore[0].x + this.endscore[1].w * 0.85;
        this.endscore[1].y = this.endscore[0].y;
        
    }

    updateScoreSprite(score) {
        this.numbers[0].clipX = this.numbers[0].clipW * score[0];
        this.numbers[1].clipX = this.numbers[1].clipW * score[1];
    }

    updateTimerSprite(time, gameDuration) {
        let timer = parseInt(time);
        let percentage = timer / gameDuration;
        this.timeprogress.w = this.timeprogress.ow * percentage;
        this.timernumbers[0].clipX = this.timernumbers[0].clipW * time[0];
        this.timernumbers[1].clipX = this.timernumbers[1].clipW * time[1];
    }

    setGameoverScreen() {
        const { w, h, sx, sy } = this;
        let adjY = isTablet() ? 260 : 0;
        adjY *= sx;

        let numbers_w = AM.images.endscore.cw * 1.25;
        let numbers_h = AM.images.endscore.ch * 1.25;
        this.endscore = [];
        this.endscore[0] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        this.endscore[1] = new StaticSprite(0, 0, numbers_w, numbers_h, 0, 0, AM.images.endscore.cw, AM.images.endscore.ch, 'endscore');
        rescaleSize(this.endscore[0], sx, sx);
        rescaleSize(this.endscore[1], sx, sx);

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

    updateFinalScore(score) {
        // this.txt.addText('total', zeroPad(Math.floor(score), 2), 'bold', 30, 'Montserrat', this.w / 2, this.complete.y + this.complete.h + this.star.h * 3.7, 150, 125, '#fff', true);
        this.txt.addText('total', zeroPad(Math.floor(score), 2), 'bold', 30, 'Montserrat', this.w / 2, this.complete.y + this.complete.h + 125 * 0.8 * scaleY, 150, 125, '#fff', true);
    }

    draw(ctx) {
        // this.timeProgressBar.draw(ctx);
        // this.scoreBar.draw(ctx);
        
        // this.hourglass.draw(ctx);
        // this.star.draw(ctx);
        // // this.life.draw(ctx);
        // if (this.volumeOn) {
        //     this.volume.draw(ctx);
        // } else {
        //     this.mute.draw(ctx);
        // }
        
        // // this.txt.draw('time');
        // this.txt.draw('score');

        this.score_rect.draw(ctx);
        this.numbers[0].draw(ctx);
        this.numbers[1].draw(ctx);

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
        // ctx.globalAlpha = 0.85;
        // ctx.fillStyle = '#000';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.restore();

        // this.shine.draw(ctx);
        // this.rays.draw(ctx);
        // this.complete.draw(ctx);

        // let totalScore = parseInt(this.txt.texts['total'].str);
        // let total = Math.floor(totalScore / 8);

        // // for (let i = 0; i < this.starPos.length; ++i) {
        // //     if (i <= total && totalScore > 0) {
        // //         this.star.dynamicDraw(ctx, this.starPos[i][0], this.starPos[i][1], this.starPos[i][2], this.starPos[i][3], AM.images.star.cw, AM.images.star.ch, 'star');
        // //     } else {
        // //         this.star.dynamicDraw(ctx, this.starPos[i][0], this.starPos[i][1], this.starPos[i][2], this.starPos[i][3], AM.images.emptystar.cw, AM.images.emptystar.ch, 'emptystar');
        // //     }
        // // }
        
        // // this.pigscore.draw(ctx);
        // this.txt.draw('yourscore');
        // this.txt.draw('total');

        // if (totalScore == 0)
        //     this.txt.draw('betterluck');

        // this.txt.draw('reset');

        // this.updateGameoverScore(splashInfo, '00');

        ctx.drawImage(AM.images.endscreen.img, 0, 0, AM.images.endscreen.cw, AM.images.endscreen.ch, splashInfo.x, splashInfo.y, splashInfo.w, splashInfo.h);

        this.drawIntersect(delta);
        
        this.endscore[0].draw(ctx);
        this.endscore[1].draw(ctx);
        // this.txt.draw('score2');
        // this.txt.draw('reset');

        this.endscreenButtons.draw(ctx);
    }
}