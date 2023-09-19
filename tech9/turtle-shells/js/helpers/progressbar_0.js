class ProgressBar {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.progress = 0;
    }

    draw(ctx) {
        const { x, y, w, h } = this;
        let p = this.progress;
    
        const grd = ctx.createLinearGradient(0, 0, 0, p);
        
        grd.addColorStop(0, "#4ED20E");
        grd.addColorStop(0.5, "#83DF56");
        grd.addColorStop(1, "#59DC19");

        /* To visalize ------------------------------------------------------*/
        ctx.beginPath();
        ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 * Math.PI);
        ctx.lineTo(w + x, y);
        ctx.arc((h / 2) + w + x, h / 2 + y, h / 2, 3 / 2 * Math.PI, Math.PI / 2);
        ctx.lineTo(h / 2 + x, h + y);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        /* ------------------------------------------------------------------*/

        ctx.beginPath();
        ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 * Math.PI);
        ctx.lineTo(w + x, y);
        ctx.arc((h / 2) + this.progress + x, h / 2 + y, h / 2, 3 / 2 * Math.PI, Math.PI / 2);
        ctx.lineTo(h / 2 + x, h + y);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.closePath();
    
        // ctx.beginPath();
        // ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
        // ctx.lineTo(p - 2 * w + x, y);
        // ctx.arc(p - (w / 2) + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
        // ctx.lineTo(h / 2 + x, h + y);
        // ctx.fillStyle = grd;
        // ctx.fill();
    }

    update(delta, progress) {
        this.progress = this.w * (progress / 100);
    }

    // drawProgress() {
    //     const { w } = topHUDInfo.timer;
    //     const { x, y, h, max } = topHUDInfo.timer.progress;
    //     let p = showTarget ? max * scaleX : (max * scaleX * (timer.timer / (9.0 * 24)));
    
    //     // if ((h / 2) - p > 0) {
    //     //     p = 0;
    //     // }
    
    //     // const grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
    //     const grd = ctx.createLinearGradient(0, 0, 0, p);
    //     // grd.addColorStop(0, "#F8E7CD");
    //     // grd.addColorStop(1, "#FEB466"); 
    
    //     let percent = p / (max * scaleX);
        
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
    
    //     if(p <= h){
    //         // ctx.beginPath();
    //         // ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
    //         // ctx.save();
    //         // ctx.scale(-1, 1);
    //         // ctx.arc((h / 2) - p + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
    //         // ctx.restore();
    //         // ctx.fillStyle = grd;
    //         // ctx.fill();
    //     } else {
    //         ctx.beginPath();
    //         ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    //         ctx.lineTo(p - 2 * h + x, 0 + y);
    //         ctx.arc(p - (h / 2) + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    //         ctx.lineTo(h / 2 + x, h + y);
    //         ctx.fillStyle = grd;
    //         ctx.fill();
    //     }
    // }
}