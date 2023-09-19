class TextManager {
    constructor(ctx) {
        this.ctx = ctx;
    }

    addTextObj(str, font, weight, fontHeight, x, y, w, h, color) {
        return { str, font, weight, fontHeight, x, y, w, h, color };
    }

    generateTextObj(text, sx, sy) {
        var { str, font, weight, fontHeight, x, y, w, h, color } = text;

        let hMargin = 4;
        let txtWidth = this.ctx.measureText(str).width + 2 * hMargin;

        // fontHeight *= sx;
        x *= sx;
        y *= sy;
        w *= sx;
        h *= sy;

        return {
            str: str,
            font: font,
            weight: weight,
            fontHeight: fontHeight,
            ow: w,
            oh: h,
            width: txtWidth,
            x: -txtWidth / 2,
            y: 0,
            tx: x + w / 2,
            ty: y,
            sx: w / txtWidth,
            sy: h / fontHeight,
            color: color,
        };
    }

    draw(text) {
        var hMargin = 4;
        this.ctx.font = text.weight + ' ' + text.fontHeight + 'px ' + text.font;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        this.ctx.save();
        this.ctx.translate(text.tx, text.ty);

        this.ctx.scale(text.sx, text.sy);
        this.ctx.translate(hMargin, 0);
        this.ctx.fillStyle = text.color;
        this.ctx.fillText(text.str, text.x, text.y);
        this.ctx.restore();
    }
}