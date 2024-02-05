class Template_1 {
    constructor(ctx, w, h, sx, sy, splashInfo) {
        this.isMuted = true;
        this.volumeOn = true;

        this.txt = new Text(ctx, w, h); 
        this.txt.setScale(sx, sx); 

        this.w = w;
        this.h = h;
        this.sx = sx;
        this.sy = sy;
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

    draw(ctx) {
        // this.score_rect.draw(ctx);
        // this.numbers[0].draw(ctx);
        // this.numbers[1].draw(ctx);

        // this.progressbar.draw(ctx);
        // this.timeprogress.draw(ctx);
        // this.watch.draw(ctx);
        // this.timernumbers[0].draw(ctx);
        // this.timernumbers[1].draw(ctx);
        // // this.duck.draw(ctx);
        
        // if (this.volumeOn) {
        //     this.volume.draw(ctx);
        // } else {
        //     this.mute.draw(ctx);
        // }

        // ctx.strokeStyle = '#000';
        // ctx.strokeRect(this.txt.texts['time'].x, this.txt.texts['time'].y, this.txt.texts['time'].w, this.txt.texts['time'].h);

        // ctx.strokeStyle = '#000';
        // ctx.strokeRect(this.timeProgressBar.x, this.timeProgressBar.y, this.timeProgressBar.w + this.timeProgressBar.h, this.timeProgressBar.h);
        
        
        // this.txt.draw('time');
        // this.txt.draw('score');
    }

    gameover(ctx, splashInfo, delta) {
        // ctx.drawImage(AM.images.endscreen.img, 0, 0, AM.images.endscreen.cw, AM.images.endscreen.ch, splashInfo.x, splashInfo.y, splashInfo.w, splashInfo.h);

        // this.drawIntersect(delta);
        
        // this.endscore[0].draw(ctx);
        // this.endscore[1].draw(ctx);
        // // this.txt.draw('score2');
        // // this.txt.draw('reset');

        // this.endscreenButtons.draw(ctx);
    }
}
