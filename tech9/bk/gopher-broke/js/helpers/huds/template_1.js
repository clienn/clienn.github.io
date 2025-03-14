class Template_1 {
    constructor(ctx, w, h, sx, sy) {
        this.isMuted = false;
        this.txt = new Text(ctx, w, h); 
        this.txt.setScale(sx, sy); 

        this.carrotIDX = 0;
        this.gopherIDX = 0;
        
        this.isWin = true;

        this.remainingGophers = [1, 1, 1];
        this.remainingCarrots = [1, 1, 1];

        this.volumeOn = true;

        this.timecircle = new StaticSprite(50, 20, 60, 60, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        this.stopwatch = new StaticSprite(50, 20, 60, 60, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');

        this.gopher = new StaticSprite(0, 0, 75, 75, 0, 0, AM.images.gopher.cw, AM.images.gopher.ch, 'gopher');
        this.carrot_score = new StaticSprite(0, 0, 65, 75, 0, 0, AM.images.carrot_score.cw, AM.images.carrot_score.ch, 'carrot_score');
        
        this.lose = new StaticSprite(0, 0, AM.images.lose.cw * 1.5, AM.images.lose.ch * 1.5, 0, 0, AM.images.lose.cw, AM.images.lose.ch, 'lose');
        this.win = new StaticSprite(0, 0, AM.images.win.cw * 1.5, AM.images.win.ch * 1.5, 0, 0, AM.images.win.cw, AM.images.win.ch, 'win');
        // this.pigscore = new StaticSprite(0, 80, 120, 90, 0, 0, AM.images.pigscore.cw, AM.images.pigscore.ch, 'pigscore');


        this.volume = new StaticSprite(65, this.timecircle.h + 27, 35, 35, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        this.mute = new StaticSprite(65, this.timecircle.h + 27, 35, 35, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

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

        let gopherW = this.gopher.w;
        let gopherH = this.gopher.h;

        this.gopherPos = [
            [w / 2 - gopherW / 2 - gopherW, 20, gopherW, gopherH],
            [w / 2 - gopherW / 2, 20, gopherW, gopherH],
            [w / 2 - gopherW / 2 + gopherW, 20, gopherW, gopherH]
        ];

        let carroScorePad = 60 * sx;
        let carroScoreDist = 60 * sx;

        this.carrotScorerPos = [
            [w - carroScorePad - carroScoreDist * 3, 20, this.carrot_score.w, this.carrot_score.h],
            [w - carroScorePad - carroScoreDist * 2, 20, this.carrot_score.w, this.carrot_score.h],
            [w - carroScorePad - carroScoreDist, 20, this.carrot_score.w, this.carrot_score.h]
        ];
        
        let paddingX = 50 * sx;
        let paddingY = 22 * sy;

        this.timeProgressBar = new ProgressBar(this.timecircle.w / 2 + paddingX, this.timecircle.h / 2 - 30 * sx / 2 + paddingY, 100 * sx, 30 * sy);
        this.timeProgressBar.progress = 100;


        this.txt.addText('time', '99', 'normal', 20, 'Montserrat', 0, 0, 30, 30, '#000', true); 
        this.txt.centerTo('time', this.timecircle.x, this.timecircle.y, this.timecircle.w, this.timecircle.h);


        // gameover
        this.txt.addText('complete', 'Complete!', 'bold', 30, 'Montserrat', w / 2, 35 * sy, 180, 35, '#fff', true);
        this.txt.addText('reset', 'Tap to play again.', 'bold', 30, 'Montserrat', w / 2, h / 2, 500, 40, '#fff', true);
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
        
        this.txt.draw('reset');
    }
}