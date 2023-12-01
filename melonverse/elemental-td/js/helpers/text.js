class Text {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.texts = [];
        this.sx = 1;
        this.sy = 1;

        this.cw = w;
        this.ch = h;
    }

    addText(id, str, weight, fontH, font, x, y, w, h, color, isCentered) {
        let text = { id, str, weight, fontH, font, x, y, w, h, color };

        this.calculateScaledPosition(text);

        if (isCentered) {
            text.x -= text.width / 2;
        }

        this.texts[id] = text;
    }

    centerTo(id, x, y, w, h) {
        this.texts[id].x += x + w / 2;
        this.texts[id].y = y + h / 2 - this.texts[id].h / 2;
    }

    follow(id, x, y, w, h) {
        this.texts[id].x = x + w / 2;
        this.texts[id].y = y + h / 2 - this.texts[id].h / 2;
    }

    setScale(sx, sy) {
        this.sx = sx;
        this.sy = sy;
    }

    calculateScaledPosition(text) {
        this.ctx.save();

        this.ctx.font = text.weight + ' ' + text.fontH + 'px ' + text.font;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        let txtWidth = this.ctx.measureText(text.str).width;
        // console.log(txtWidth);

        // text.x *= this.sx;
        // text.y *= this.sy;
        text.w *= this.sx;
        text.h *= this.sy;

        text.sx = text.w / txtWidth;
        text.sy = text.h / text.fontH;

        // console.log(text.sx, txtWidth, text.w)

        // text.sx = this.sx;
        // text.sy = this.sy;

        text.rectW = txtWidth;
        text.width = txtWidth * text.sx;

        this.ctx.restore();

        // text.x += text.w / 2;
    }

    setPosition() {

    }

    center(obj) {

    }

    draw(id) {
        const { str, weight, fontH, font, x, y, w, h, sx, sy, color, width, rectW } = this.texts[id];

        this.ctx.save();

        this.ctx.font = weight + ' ' + fontH + 'px ' + font;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        this.ctx.translate(x, y);
        
        this.ctx.scale(sx, sy);

        // ctx.translate(hMargin, 0);

        this.ctx.fillStyle = color;
        this.ctx.fillText(str, 0, 0);

        
        // this.ctx.beginPath();
        // this.ctx.rect(x, y, rectW, fontH - 4 * this.sy);
        // this.ctx.stroke();

        this.ctx.restore();

        
        
    }

    drawRot(id, rotX, rotY, cardW, cardH) {
        const { str, weight, fontH, font, x, y, w, h, sx, sy, color, width, rectW } = this.texts[id];

        this.ctx.save();

        this.ctx.font = weight + ' ' + fontH + 'px ' + font;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        let cx = cardW / 2 - this.ctx.measureText(str).width / 2;
        let cy = cardH / 2 - fontH / 2;

        // this.ctx.translate(cx + rotX, cy + rotY);
        
        // this.ctx.scale(1, 1);

        // ctx.translate(hMargin, 0);

        

        // this.ctx.strokeStyle = '#000';
        // this.ctx.lineWidth = '5';
        // this.ctx.beginPath();
        // this.ctx.rect(cx, cy, this.ctx.measureText(str).width, h);
        // this.ctx.stroke();

        

        this.ctx.fillStyle = color;
        this.ctx.fillText(str, cx + rotX, cy + rotY);

        this.ctx.restore();

        
        
    }
}