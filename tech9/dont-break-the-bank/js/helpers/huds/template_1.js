class Template_1 {
    constructor(ctx, w, h, sx, sy) {
        
        this.isMuted = false;
        this.txt = new Text(ctx, w, h); 
        this.txt.setScale(sx, sy); 

        this.volumeOn = true;

        let volumePosX = 20;
        let volumePosY = 35;

        this.volume = new StaticSprite(volumePosX, volumePosY, 55, 55, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        this.mute = new StaticSprite(volumePosX, volumePosY, 55, 55, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

        let paddingX = 20 * sx + this.volume.w;
        let paddingY = 10 * sy;

        this.timecircle = new StaticSprite(10 + paddingX, 10, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.timecircle.cw, AM.images.timecircle.ch, 'timecircle');
        this.stopwatch = new StaticSprite(10 + paddingX, 10, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.stopwatch.cw, AM.images.stopwatch.ch, 'stopwatch');

        this.life = new StaticSprite(0, 10, 60 * 1.5, 60 * 1.5, 0, 0, AM.images.life.cw, AM.images.life.ch, 'life');
        this.coin0 = new StaticSprite(0, 0, 60, 60, 0, 0, AM.images.coin_0.cw, AM.images.coin_0.ch, 'coin_0');
        
        let gameoverAdjY = 180;

        this.shine = new StaticSprite(0, 80 + gameoverAdjY, 352, 290, 0, 0, AM.images.shine.cw, AM.images.shine.ch, 'shine');
        this.pigscore = new StaticSprite(0, 140 + gameoverAdjY, 120 * 2, 90 * 2, 0, 0, AM.images.pigscore.cw, AM.images.pigscore.ch, 'pigscore');

        

        // this.volume = new StaticSprite(30, this.timecircle.h + 20, 25 * 2, 25 * 2, 0, 0, AM.images.volume.cw, AM.images.volume.ch, 'volume');
        // this.mute = new StaticSprite(30, this.timecircle.h + 20, 25 * 2, 25 * 2, 0, 0, AM.images.mute.cw, AM.images.mute.ch, 'mute');

        rescaleAll(this.timecircle, sx, sy);
        rescaleAll(this.stopwatch, sx, sy);
        rescaleAll(this.life, sx, sy);
        rescaleAll(this.coin0, sx, sy);
        rescaleAll(this.shine, sx, sy);
        rescaleAll(this.pigscore, sx, sy);
        rescaleAll(this.volume, sx, sy);
        rescaleAll(this.mute, sx, sy);
        
        

        this.timeProgressBar = new ProgressBar(this.timecircle.w / 2 + paddingX / 1.5, this.timecircle.h / 2 - 30 * sx / 2 + paddingY, 200 * sx, 45 * sy);
        this.timeProgressBar.progress = 100;

        let scorebarWidth = 200 * sx + 70 * sy;

        this.scoreBar = new ProgressBar(w / 2 - scorebarWidth / 2, 20 * sy, 200 * sx, 70 * sy, '#15441D');
        this.scoreBar.progress = 100;

        this.coin0.x = this.scoreBar.x + 10 * scaleX;
        this.coin0.y = this.scoreBar.y + this.scoreBar.h / 2 - this.coin0.h / 2;

        let txtY = 32 * sy;
        // if (isMobile()) txtY = 12 * sy;
        let scoreTxtW = 80 * 1.5;
        // let scorebarWidth = this.scoreBar.w + this.scoreBar.h;


        this.txt.addText('score', '00.00', 'bold', 20, 'Montserrat', this.scoreBar.x + scorebarWidth / 2 + 20 * sx, this.scoreBar.y + 10 * sy, scoreTxtW, 30 * 1.5, '#fff', true); 
        // let adjX = isMobile() ? this.scoreBar.h : this.scoreBar.h / 2;
        // this.txt.centerTo('score', this.scoreBar.x + this.scoreBar.w - this.txt.texts['score'].w + 20 * scaleX, this.scoreBar.y, this.scoreBar.w + this.scoreBar.h / 2, this.scoreBar.h);
        // this.txt.centerTo('score', this.scoreBar.x + this.scoreBar.w - this.txt.texts['score'].w + 20 * sx, this.scoreBar.y, this.scoreBar.w + this.scoreBar.h / 2, this.scoreBar.h);

        // adjX = isMobile() ? 50 : 0;
        // console.log(adjX);

        // this.lifebar = new ProgressBar(w - this.life.w - 100 * sx / 2 - 25 * sy - adjX, this.life.h / 2 - 25 * sx / 2 + paddingY, 160 * sx, 35 * sy);
        this.lifebar = new ProgressBar(w - 260 * sx, this.life.h / 2 - 25 * sx / 2 + paddingY, 160 * sx, 35 * sy);
        this.lifebar.progress = 100;

        this.life.x = this.lifebar.x - this.life.w / 2;

        this.txt.addText('time', '90', 'bold', 20, 'Montserrat', 0, this.timecircle.y, 30 * 1.5, 30 * 1.5, '#000', true); 
        this.txt.centerTo('time', this.timecircle.x, this.timecircle.y, this.timecircle.w, this.timecircle.h);

        // this.txt.addText('x', 'x', 'normal', 20, 'Montserrat', 
        //     w / 2, topHUDInfo.score.y + (scoreAdjY + 2) * scaleY, 20, topHUD.score.fontH, '#fff', true); 

        // this.txt.addText('score', '00', (isMobile ? 'normal' : 'bold'), topHUD.score.fontS, 'Montserrat', 
        // w / 2 + 50 * scaleX, topHUDInfo.score.y + scoreAdjY * scaleY, topHUD.score.fontW, topHUD.score.fontH, '#fff', true);

        //#15441D
        // alert(h + ' ' + this.txt.texts['score'].h + ' ' + this.txt.texts['score'].y);

        // gameover
        this.txt.addText('complete', 'Complete!', 'bold', 30, 'Montserrat', w / 2, this.shine.y - 50 * sy, 180 * 2, 35 * 2, '#fff', true);
        this.txt.addText('total', '$00.00', 'bold', 30, 'Montserrat', w / 2, this.shine.y + this.shine.h - 25 * sy, 100 * 2, 35 * 2, '#fff', true);
        this.txt.addText('reset', 'Tap to play again.', 'bold', 30, 'Montserrat', w / 2, h / 2, 700, 100, '#fff', true);
        this.shine.x = w / 2 - this.shine.w / 2;
        this.pigscore.x = w / 2 - this.pigscore.w / 2;
    }

    draw(ctx) {
        this.timeProgressBar.draw(ctx);
        this.scoreBar.draw(ctx, 100);
        this.lifebar.draw(ctx);
        this.timecircle.draw(ctx);
        this.stopwatch.draw(ctx);
        this.coin0.draw(ctx);
        this.life.draw(ctx);
        if (this.volumeOn) {
            this.volume.draw(ctx);
        } else {
            this.mute.draw(ctx);
        }
        
        this.txt.draw('time');
        this.txt.draw('score');

        // ctx.beginPath();
        // ctx.rect(this.txt.texts['score'].x, this.txt.texts['score'].y, this.txt.texts['score'].w, this.txt.texts['score'].h);
        // ctx.stroke();

        // ctx.font = 'bold 20px Montserrat';
        // ctx.textAlign = 'left';
        // ctx.textBaseline = 'top';
        // ctx.fillStyle = '#f00';
        // ctx.fillText('text', 0, 0);
    }

    gameover(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        this.shine.draw(ctx);
        this.pigscore.draw(ctx);
        this.txt.draw('complete');
        this.txt.draw('total');
        // this.txt.draw('reset');
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