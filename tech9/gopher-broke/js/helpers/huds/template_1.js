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

        this.canvasWidth = w;

        this.carrotIDX = 0;
        this.gopherIDX = 0;
        
        this.isWin = true;

        this.remainingGophers = [1, 1, 1];
        this.remainingCarrots = [1, 1, 1];

        this.volumeOn = true;
        this.initHUD();
        this.setGameoverScreen();

        // let volumeAdjX = 7;
        // let volumeAdjY = 25;

        // this.volume = new StaticSprite(volumeAdjX, volumeAdjY, 55 * 1.5, 55 * 1.5, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        // this.mute = new StaticSprite(volumeAdjX, volumeAdjY, 55 * 1.5, 55 * 1.5, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

        // volumeAdjX += 10 * sx;
        // volumeAdjY -= 7 * sy;

        // this.timecircle = new StaticSprite(this.volume.w + volumeAdjX, volumeAdjY, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        // // this.timecircle = new StaticSprite(this.volume.w + volumeAdjX, 20, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        // this.stopwatch = new StaticSprite(this.volume.w + volumeAdjX, volumeAdjY, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');
        // // this.stopwatch = new StaticSprite(this.volume.w + volumeAdjX, 20, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');

        this.gopher = new StaticSprite(0, 0, 75 * 1.5, 75 * 1.5, 0, 0, AM.images.gopher.cw, AM.images.gopher.ch, 'gopher');
        this.carrot_score = new StaticSprite(0, 0, 65 * 1.5, 75 * 1.5, 0, 0, AM.images.carrot_score.cw, AM.images.carrot_score.ch, 'carrot_score');
        
        this.lose = new StaticSprite(0, 0, AM.images.lose.cw * 1.5, AM.images.lose.ch * 1.5, 0, 0, AM.images.lose.cw, AM.images.lose.ch, 'lose');
        this.win = new StaticSprite(0, 0, AM.images.win.cw * 1.5, AM.images.win.ch * 1.5, 0, 0, AM.images.win.cw, AM.images.win.ch, 'win');
        // this.pigscore = new StaticSprite(0, 80, 120, 90, 0, 0, AM.images.pigscore.cw, AM.images.pigscore.ch, 'pigscore');

        
        // rescaleAll(this.timecircle, sx, sy);
        // rescaleAll(this.stopwatch, sx, sy);
        rescalePos(this.gopher, sx, sy);
        rescaleSize(this.gopher, sx, sx);

        rescalePos(this.carrot_score, sx, sy);
        rescaleSize(this.carrot_score, sx, sx);

        rescaleAll(this.lose, sx, sy);
        rescaleAll(this.win, sx, sy);
        // rescaleAll(this.volume, sx, sy);
        // rescaleAll(this.mute, sx, sy);

        this.lose.x = w / 2 - this.lose.w / 2;
        this.win.x = w / 2 - this.win.w / 2;

        this.lose.y = h / 2 - this.lose.h / 2 - 100 * sy;
        this.win.y = h / 2 - this.win.h / 2 - 100 * sy;

        let gopherW = this.gopher.w;
        let gopherH = this.gopher.h;

        this.gopherPos = [
            [w / 2 - gopherW / 2 - gopherW, 20 * sy, gopherW, gopherH],
            [w / 2 - gopherW / 2, 20 * sy, gopherW, gopherH],
            [w / 2 - gopherW / 2 + gopherW, 20 * sy, gopherW, gopherH]
        ];

        let carroScorePad = 60 * sx;
        let carroScoreDist = 60 * sx;

        this.carrotScorerPos = [
            [w - carroScorePad - carroScoreDist * 3, 20 * sy, this.carrot_score.w, this.carrot_score.h],
            [w - carroScorePad - carroScoreDist * 2, 20 * sy, this.carrot_score.w, this.carrot_score.h],
            [w - carroScorePad - carroScoreDist, 20 * sy, this.carrot_score.w, this.carrot_score.h]
        ];
        
        let paddingX = 50 * sx;
        let paddingY = 22 * sy;

        // this.timeProgressBar = new ProgressBar(this.timecircle.w / 2 + paddingX, this.timecircle.h / 2 - 30 * sx / 2 + paddingY, 150 * sx, 35 * sy);
        // this.timeProgressBar = new ProgressBar(this.timecircle.x + this.timecircle.w / 2, this.timecircle.y + this.timecircle.h / 2 - 35 / 2 * sy, 150 * sx, 35 * sy);
        // this.timeProgressBar.progress = 100;


        // this.txt.addText('time', '30', 'bold', 20, 'Montserrat', 0, 0, 30 * 1.5, 30 * 1.5, '#000', true); 
        // this.txt.centerTo('time', this.timecircle.x, this.timecircle.y, this.timecircle.w, this.timecircle.h);


        // // gameover
        // this.txt.addText('complete', 'Complete!', 'bold', 30, 'Montserrat', w / 2, 35 * sy, 180, 35, '#fff', true);
        // this.txt.addText('reset', 'Tap to play again.', 'bold', 30, 'Montserrat', w / 2, h / 2, 500, 40, '#fff', true);

        // let y = this.win.y + this.win.h - 70 * sy;
        // this.txt.addText('scorelabel', 'You scored:', 'bold', 30, 'Montserrat', w / 2, y, 170, 30, '#fff', true);
        
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

        let key = 'return_home';
        // let key = isPremium ? 'premium_endscreen_buttons' : 'endscreen_buttons';
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

    updateFinalScore(score) {
        let y = this.win.y + this.win.h - 70 * this.sy;
        this.txt.addText('total', score, 'bold', 30, 'Montserrat', this.canvasWidth / 2, y + 45 * this.sy, 55, 40, '#fff', true);
    }

    draw(ctx) {
        // this.timeProgressBar.draw(ctx);
        
        // this.timecircle.draw(ctx);
        // this.stopwatch.draw(ctx);
        
        // if (this.volumeOn) {
        //     this.volume.draw(ctx);
        // } else {
        //     this.mute.draw(ctx);
        // }
        // this.score_rect.draw(ctx);
        // this.numbers[0].draw(ctx);
        // this.numbers[1].draw(ctx);

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

        for (let i = 0; i < this.gopherPos.length; ++i) {
            if (this.remainingGophers[i]) {
                this.gopher.dynamicDraw(ctx, this.gopherPos[i][0], this.gopherPos[i][1], this.gopherPos[i][2], this.gopherPos[i][3], AM.images.gopher.cw, AM.images.gopher.ch, 'gopher');
            } else {
                this.gopher.dynamicDraw(ctx, this.gopherPos[i][0], this.gopherPos[i][1], this.gopherPos[i][2], this.gopherPos[i][3], AM.images.gopher_x.cw, AM.images.gopher_x.ch, 'gopher_x');
            }
            
        }

        for (let i = 0; i < this.carrotScorerPos.length; ++i) {
            if (this.remainingCarrots[i]) {
                this.carrot_score.dynamicDraw(ctx, this.carrotScorerPos[i][0], this.carrotScorerPos[i][1], this.carrotScorerPos[i][2], this.carrotScorerPos[i][3], AM.images.carrot_score.cw, AM.images.carrot_score.ch, 'carrot_score');
            } else {
                this.carrot_score.dynamicDraw(ctx, this.carrotScorerPos[i][0], this.carrotScorerPos[i][1], this.carrotScorerPos[i][2], this.carrotScorerPos[i][3], AM.images.carrot_score_x.cw, AM.images.carrot_score_x.ch, 'carrot_score_x');
            }
        }
        
        // this.txt.draw('time');
        // this.txt.draw('score');
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

        // // this.lose.draw(ctx);
        // if (this.isWin) {
        //     this.win.draw(ctx);
        // } else {
        //     this.lose.draw(ctx);
        // }

        // this.txt.draw('scorelabel');
        // this.txt.draw('total');
        
        // this.txt.draw('reset');
        // this.updateGameoverScore(splashInfo, '30');

        ctx.drawImage(AM.images.endscreen.img, 0, 0, AM.images.endscreen.cw, AM.images.endscreen.ch, splashInfo.x, splashInfo.y, splashInfo.w, splashInfo.h);

        this.drawIntersect(delta);
        
        this.endscore[0].draw(ctx);
        this.endscore[1].draw(ctx);
        // this.txt.draw('score2');
        // this.txt.draw('reset');

        this.endscreenButtons.draw(ctx);
    }
}