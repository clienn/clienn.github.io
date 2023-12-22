class Template_1 {
    constructor(ctx, w, h, sx, sy) {
        this.isMuted = false;
        this.txt = new Text(ctx, w, h); 
        this.txt.setScale(sx, sy); 
        this.w = w;

        this.volumeOn = true;
        this.volume = new StaticSprite(7, 25, 55 * 1.5, 55 * 1.5, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        this.mute = new StaticSprite(7, 25, 55 * 1.5, 55 * 1.5, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');
        // this.timecircle = new StaticSprite(10, 10, 60, 60, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        // this.stopwatch = new StaticSprite(10, 10, 60, 60, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');
        this.hourglass = new StaticSprite(this.volume.x + this.volume.w + 10, this.volume.y + this.volume.h / 2 - 90 / 2, 60, 80, 0, 0, AM.images.hourglass.cw, AM.images.hourglass.ch, 'hourglass');

        // this.life = new StaticSprite(0, 10, 60, 60, 0, 0, AM.images.life.cw, AM.images.life.ch, 'life');
        this.star = new StaticSprite(0, 0, 60, 60, 0, 0, AM.images.star.cw, AM.images.star.ch, 'star');
        // this.emptystar = new StaticSprite(0, 0, 60, 60, 0, 0, AM.images.emptystar.cw, AM.images.emptystar.ch, 'emptystar');
        let adjY = 170;
        this.shine = new StaticSprite(0, adjY, 309, 309, 0, 0, AM.images.shine.cw, AM.images.shine.ch, 'shine');
        this.rays = new StaticSprite(0, adjY, 309, 309, 0, 0, AM.images.rays.cw, AM.images.rays.ch, 'rays');
        this.complete = new StaticSprite(0, 50 + adjY, 370, 50, 0, 0, AM.images.complete.cw, AM.images.complete.ch, 'complete');
        // this.pigscore = new StaticSprite(0, 80, 120, 90, 0, 0, AM.images.pigscore.cw, AM.images.pigscore.ch, 'pigscore');


        

        rescaleAll(this.hourglass, sx, sy);
        rescaleAll(this.complete, sx, sy);
        // rescaleAll(this.life, sx, sy);
        rescaleAll(this.star, sx, sy);
        // rescaleAll(this.emptystar, sx, sy);
        rescaleAll(this.shine, sx, sy);
        rescaleAll(this.rays, sx, sy);
        // rescaleAll(this.pigscore, sx, sy);
        rescaleAll(this.volume, sx, sy);
        rescaleAll(this.mute, sx, sy);
        
        let paddingX = 15 * sx;
        let paddingY = 10 * sy;

        this.complete.x = w / 2 - this.complete.w / 2;
        this.shine.x = w / 2 - this.shine.w / 2;
        this.rays.x = w / 2 - this.rays.w / 2;

        
        
        this.timeProgressBar = new ProgressBar(this.hourglass.x + paddingX * 2, this.hourglass.y + this.hourglass.h / 2 - 45 * sy / 2 + paddingY, 160 * sx, 35 * sy);
        // this.timeProgressBar = new ProgressBar(this.hourglass.x + paddingX * 2, this.hourglass.h / 2 - 30 * sx / 2 + paddingY, 160 * sx, 35 * sy);
        this.timeProgressBar.progress = 100;

        this.scoreBar = new ProgressBar(w / 2 - 50 * sx / 2 - 70 * sy, paddingY, 50 * sx, 70 * sy, '#00ABC8');
        this.scoreBar.progress = 100;
        

        this.star.x = this.scoreBar.x + paddingX / 2;
        this.star.y = this.scoreBar.y + this.scoreBar.h / 2 - this.star.h / 2;

        this.txt.addText('score', '00', 'bold', 20, 'Montserrat', 0, 0, 40, 40, '#fff', true); 
        let adjX = isMobile() ? this.scoreBar.h : this.scoreBar.h / 2;
        this.txt.centerTo('score', this.scoreBar.x + this.scoreBar.w / 2 + adjX + paddingX, this.scoreBar.y, this.scoreBar.w + this.scoreBar.h / 2, this.scoreBar.h);

        adjX = isMobile() ? 50 : 0;
        // console.log(adjX);

        // this.lifebar = new ProgressBar(w - this.life.w - 100 * sx / 2 - 25 * sy - adjX, this.life.h / 2 - 25 * sx / 2 + paddingY, 100 * sx, 25 * sy);
        // this.lifebar.progress = 100;

        // this.life.x = this.lifebar.x - this.life.w / 2;

        this.txt.addText('time', '90', 'normal', 20, 'Montserrat', 0, 0, 30, 30, '#000', true); 
        this.txt.centerTo('time', this.hourglass.x, this.hourglass.y, this.hourglass.w, this.hourglass.h);

        // this.txt.addText('x', 'x', 'normal', 20, 'Montserrat', 
        //     w / 2, topHUDInfo.score.y + (scoreAdjY + 2) * scaleY, 20, topHUD.score.fontH, '#fff', true); 

        // this.txt.addText('score', '00', (isMobile ? 'normal' : 'bold'), topHUD.score.fontS, 'Montserrat', 
        // w / 2 + 50 * scaleX, topHUDInfo.score.y + scoreAdjY * scaleY, topHUD.score.fontW, topHUD.score.fontH, '#fff', true);

        //#15441D
        // this.shine.y = this.complete.y + this.complete.h + this.star.h * 2;
        this.shine.y = this.complete.y + this.complete.h;
        this.rays.y = this.shine.y;

        // gameover
        this.txt.addText('yourscore', 'Your Score!', 'bold', 30, 'Montserrat', w / 2, this.complete.y + this.complete.h + 40 * scaleY, 175, 30, '#fff', true);
        // this.txt.addText('yourscore', 'Your Score!', 'bold', 30, 'Montserrat', w / 2, this.complete.y + this.complete.h + this.star.h * 3, 175, 30, '#fff', true);
        // this.txt.addText('total', '00', 'bold', 30, 'Montserrat', w / 2, this.complete.y + this.complete.h + this.star.h * 3.7, 150, 125, '#fff', true);
        this.txt.addText('betterluck', 'Better Luck Next Time', 'bold', 30, 'Montserrat', w / 2, this.complete.y + this.complete.h + this.star.h * 4 + 120 * sy, 350, 25, '#F78A3B', true);
        this.txt.addText('reset', 'Tap to play again.', 'bold', 30, 'Montserrat', w / 2, h / 1.5, 500, 40, '#fff', true);
        // this.shine.x = w / 2 - this.shine.w / 2;
        // this.pigscore.x = w / 2 - this.pigscore.w / 2;

        let starW = 100 * scaleX;
        let starH = 100 * scaleY;
        this.starPos = [
            [w / 2 - starW / 2 - starW, this.complete.y + this.complete.h + this.star.h, starW, starH],
            [w / 2 - starW / 2, this.complete.y + this.complete.h + this.star.h - this.star.w / 2, starW, starH],
            [w / 2 - starW / 2 + starW, this.complete.y + this.complete.h + this.star.h, starW, starH]
        ];

        this.scoreBar.w = 100;

        // this.updateFinalScore(10);
    }

    updateFinalScore(score) {
        // this.txt.addText('total', zeroPad(Math.floor(score), 2), 'bold', 30, 'Montserrat', this.w / 2, this.complete.y + this.complete.h + this.star.h * 3.7, 150, 125, '#fff', true);
        this.txt.addText('total', zeroPad(Math.floor(score), 2), 'bold', 30, 'Montserrat', this.w / 2, this.complete.y + this.complete.h + 125 * 0.8 * scaleY, 150, 125, '#fff', true);
    }

    draw(ctx) {
        this.timeProgressBar.draw(ctx);
        this.scoreBar.draw(ctx);
        
        this.hourglass.draw(ctx);
        this.star.draw(ctx);
        // this.life.draw(ctx);
        if (this.volumeOn) {
            this.volume.draw(ctx);
        } else {
            this.mute.draw(ctx);
        }
        
        // this.txt.draw('time');
        this.txt.draw('score');
    }

    gameover(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        this.shine.draw(ctx);
        this.rays.draw(ctx);
        this.complete.draw(ctx);

        let totalScore = parseInt(this.txt.texts['total'].str);
        let total = Math.floor(totalScore / 8);

        // for (let i = 0; i < this.starPos.length; ++i) {
        //     if (i <= total && totalScore > 0) {
        //         this.star.dynamicDraw(ctx, this.starPos[i][0], this.starPos[i][1], this.starPos[i][2], this.starPos[i][3], AM.images.star.cw, AM.images.star.ch, 'star');
        //     } else {
        //         this.star.dynamicDraw(ctx, this.starPos[i][0], this.starPos[i][1], this.starPos[i][2], this.starPos[i][3], AM.images.emptystar.cw, AM.images.emptystar.ch, 'emptystar');
        //     }
        // }
        
        // this.pigscore.draw(ctx);
        this.txt.draw('yourscore');
        this.txt.draw('total');

        // if (totalScore == 0)
        //     this.txt.draw('betterluck');

        // this.txt.draw('reset');
    }
}