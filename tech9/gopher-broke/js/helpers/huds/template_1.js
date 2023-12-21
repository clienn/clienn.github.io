class Template_1 {
    constructor(ctx, w, h, sx, sy) {
        this.isMuted = false;
        this.txt = new Text(ctx, w, h); 
        this.txt.setScale(sx, sy); 

        this.sx = sx;
        this.sy = sy;

        this.canvasWidth = w;

        this.carrotIDX = 0;
        this.gopherIDX = 0;
        
        this.isWin = true;

        this.remainingGophers = [1, 1, 1];
        this.remainingCarrots = [1, 1, 1];

        this.volumeOn = true;

        let volumeAdjX = 2;
        let volumeAdjY = 45;

        this.volume = new StaticSprite(volumeAdjX, volumeAdjY, 35 * 1.5, 35 * 1.5, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        this.mute = new StaticSprite(volumeAdjX, volumeAdjY, 35 * 1.5, 35 * 1.5, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

        this.timecircle = new StaticSprite(this.volume.w + volumeAdjX, 20, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        this.stopwatch = new StaticSprite(this.volume.w + volumeAdjX, 20, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');

        this.gopher = new StaticSprite(0, 0, 75 * 1.5, 75 * 1.5, 0, 0, AM.images.gopher.cw, AM.images.gopher.ch, 'gopher');
        this.carrot_score = new StaticSprite(0, 0, 65 * 1.5, 75 * 1.5, 0, 0, AM.images.carrot_score.cw, AM.images.carrot_score.ch, 'carrot_score');
        
        this.lose = new StaticSprite(0, 0, AM.images.lose.cw * 1.5, AM.images.lose.ch * 1.5, 0, 0, AM.images.lose.cw, AM.images.lose.ch, 'lose');
        this.win = new StaticSprite(0, 0, AM.images.win.cw * 1.5, AM.images.win.ch * 1.5, 0, 0, AM.images.win.cw, AM.images.win.ch, 'win');
        // this.pigscore = new StaticSprite(0, 80, 120, 90, 0, 0, AM.images.pigscore.cw, AM.images.pigscore.ch, 'pigscore');

        
        rescaleAll(this.timecircle, sx, sy);
        rescaleAll(this.stopwatch, sx, sy);
        rescaleAll(this.gopher, sx, sy);
        rescaleAll(this.carrot_score, sx, sy);
        rescaleAll(this.lose, sx, sy);
        rescaleAll(this.win, sx, sy);
        rescaleAll(this.volume, sx, sy);
        rescaleAll(this.mute, sx, sy);

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

        this.timeProgressBar = new ProgressBar(this.timecircle.w / 2 + paddingX, this.timecircle.h / 2 - 30 * sx / 2 + paddingY, 150 * sx, 35 * sy);
        this.timeProgressBar.progress = 100;


        this.txt.addText('time', '30', 'bold', 20, 'Montserrat', 0, 0, 30 * 1.5, 30 * 1.5, '#000', true); 
        this.txt.centerTo('time', this.timecircle.x, this.timecircle.y, this.timecircle.w, this.timecircle.h);


        // gameover
        this.txt.addText('complete', 'Complete!', 'bold', 30, 'Montserrat', w / 2, 35 * sy, 180, 35, '#fff', true);
        this.txt.addText('reset', 'Tap to play again.', 'bold', 30, 'Montserrat', w / 2, h / 2, 500, 40, '#fff', true);

        let y = this.win.y + this.win.h - 70 * sy;
        this.txt.addText('scorelabel', 'You scored:', 'bold', 30, 'Montserrat', w / 2, y, 170, 30, '#fff', true);
        
    }

    updateFinalScore(score) {
        let y = this.win.y + this.win.h - 70 * this.sy;
        this.txt.addText('total', score, 'bold', 30, 'Montserrat', this.canvasWidth / 2, y + 45 * this.sy, 55, 40, '#fff', true);
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
        
        this.txt.draw('time');
        // this.txt.draw('score');
    }

    gameover(ctx) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        // this.lose.draw(ctx);
        if (this.isWin) {
            this.win.draw(ctx);
        } else {
            this.lose.draw(ctx);
        }

        this.txt.draw('scorelabel');
        this.txt.draw('total');
        
        // this.txt.draw('reset');
    }
}