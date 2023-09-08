class Template_1 {
    constructor(ctx, w, h, sx, sy) {
        this.isMuted = false;
        this.txt = new Text(ctx, w, h); 
        this.txt.setScale(sx, sy); 

        this.health = 100;

        this.centerX = w / 2;
        
        this.isWin = true;
        let multiplier2 = 2;

        this.volumeOn = true;
        let waterW = 1108 * sx;
        let duckW = AM.images.duck.cw * 0.25 * sx;
        let duckX = w / 2 - waterW / 2 + waterW - duckW * 3.5;
        // this.timecircle = new StaticSprite(50, 20, 60 * multiplier, 60 * multiplier, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        // this.stopwatch = new StaticSprite(50, 20, 60 * multiplier, 60 * multiplier, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');
        this.duck = new StaticSprite(duckX, 20, duckW, AM.images.duck.ch * 0.25 * sy, 0, 0, AM.images.duck.cw, AM.images.duck.ch, 'duck');

        this.volume = new StaticSprite(65, 10 * sy, 35, 35, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        this.mute = new StaticSprite(65, 10 * sy, 35, 35, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

        this.complete = new StaticSprite(0, 50, AM.images.complete.cw * multiplier2, AM.images.complete.ch * multiplier2, 0, 0, AM.images.complete.cw, AM.images.complete.ch, 'complete');
        this.yourscore = new StaticSprite(0, 80, AM.images.yourscore.cw * multiplier2, AM.images.yourscore.ch * multiplier2, 0, 0, AM.images.yourscore.cw, AM.images.yourscore.ch, 'yourscore');

        // rescaleAll(this.timecircle, sx, sy);
        // rescaleAll(this.stopwatch, sx, sy);
        
        rescaleAll(this.volume, sx, sy);
        rescaleAll(this.mute, sx, sy);
        rescaleAll(this.complete, sx, sy);
        rescaleAll(this.yourscore, sx, sy);


        let paddingX = 50 * sx;
        let paddingY = 22 * sy;

        let pbW = 150 * sx;
        let pbH = 70 * sx;

        // this.timecircle.x = w / 2 - pbW / 2 - this.timecircle.w / 2;
        // this.stopwatch.x = this.timecircle.x;

        // this.timeProgressBar = new ProgressBar(this.timecircle.x + paddingX, this.timecircle.h / 2 - 35 * sx / 2 + paddingY, pbW, 40 * sy);
        this.timeProgressBar = new ProgressBar(w / 2 - pbW / 2, 20 * sy, pbW, pbH, '#9F51FE');
        this.timeProgressBar.progress = 100;

        let txtW = 170;
        let txtH = 40;
        let diff = Math.abs((this.timeProgressBar.w + this.timeProgressBar.h));
        
        this.txt.addText('time', 'TIME: 90', 'bold', 25, 'Montserrat', this.timeProgressBar.x + diff, 35 * sy, txtW, txtH, '#fff', false); 
        this.txt.texts['time'].x = this.timeProgressBar.x + (this.timeProgressBar.w + this.timeProgressBar.h) / 2 - this.txt.texts['time'].w / 2;
        // this.txt.centerTo('time', this.timeProgressBar.x, this.timeProgressBar.y, this.timeProgressBar.w, this.timeProgressBar.h);
        console.log(this.timeProgressBar.w, this.timeProgressBar.w + this.timeProgressBar.h / 2, this.txt.texts['time'].w);

        // gameover
        this.txt.addText('score', 'x 00', 'bold', 30, 'Montserrat', this.duck.x + this.duck.w * 2, this.duck.y + 10 * sy, 120, 50, '#fff', true);
        this.txt.addText('reset', 'Tap to play again.', 'bold', 30, 'Montserrat', w / 2, h * 0.65, 500, 40, '#fff', true);

        this.txt.addText('score2', '00', 'bold', 30, 'Montserrat', w / 2 - 10 * sx, this.yourscore.y + this.yourscore.h - 40 * sy, 130, 85, '#fff', true);

        this.complete.x = w / 2 - this.complete.w / 2;
        this.yourscore.x = w / 2 - this.yourscore.w / 2;
        // this.updateGameoverBattery(-70);
        // this.txt.texts['score'].str = this.health + '%';
    }

    

    draw(ctx) {
        this.timeProgressBar.draw(ctx);
        
        // this.timecircle.draw(ctx);
        // this.stopwatch.draw(ctx);
        this.duck.draw(ctx);
        
        if (this.volumeOn) {
            this.volume.draw(ctx);
        } else {
            this.mute.draw(ctx);
        }

        // ctx.strokeStyle = '#000';
        // ctx.strokeRect(this.txt.texts['time'].x, this.txt.texts['time'].y, this.txt.texts['time'].w, this.txt.texts['time'].h);

        // ctx.strokeStyle = '#000';
        // ctx.strokeRect(this.timeProgressBar.x, this.timeProgressBar.y, this.timeProgressBar.w + this.timeProgressBar.h, this.timeProgressBar.h);
        
        
        this.txt.draw('time');
        this.txt.draw('score');
    }

    gameover(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        this.complete.draw(ctx);
        this.yourscore.draw(ctx);
        
        this.txt.draw('score2');
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