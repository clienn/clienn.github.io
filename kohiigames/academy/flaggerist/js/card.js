class Card {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.ox = x;
        this.oy = y;
        this.w = w;
        this.h = h;
        this.color = color;

        this.inner = {
            w: w * 0.95,
            h: h * 0.95,
        }

        this.zRotate = 0;
        this.startRotation = false;
        this.rotationVel = 0;
        this.rotationStatus = 0;

        this.lineWidth = 40;

        this.rotAnchor = {
            x: 0,
            y: 0
        }

        this.mid = {
            x: w / 2,
            y: h / 2.5
        }

        this.txt = null;
        this.flagCode = '';
    }

    initRotation(v) {
        this.startRotation = true;
        this.rotationStatus = 1;
        this.rotationVel = v;

        if (v > 0) {
            this.rotAnchor.x = this.w;
            this.rotAnchor.y = this.h;
        } else {
            this.rotAnchor.x = 0;
            this.rotAnchor.y = this.h;
        }
        
    }

    setText(str) {
        this.txt.addText('text', str, 'normal', 20, 'Montserrat', 0, 0, 200, 45, '#000', false);
        // this.txt.centerTo('text', this.x, this.y, this.w, this.h);

        // this.txt.texts['text'].x = (this.w / 2 - this.txt.texts['text'].w / 2);
        // this.txt.texts['text'].y = this.y + (this.h / 2 - this.txt.texts['text'].h / 2);
    }

    drawFlag(flagInfo, rx, ry) {
        const { w, h, container } = flagInfo;
        let x = this.w / 2 - w / 2;
        let y = this.h / 3 - h / 2;
        let cx = this.w / 2 - container.w / 2;
        let cy = this.h / 3 - container.h / 2;
        ctx.drawImage(AM.images[this.flagCode].img, x + rx, y + ry, w, h);
        ctx.drawImage(AM.images.flagContainer.img, cx + rx, cy + ry, container.w, container.h);
    }

    drawOuter(ctx, flagInfo) {
        ctx.save();
        // Untransformed draw position
        const position = {x: this.x, y: this.y};
        // In degrees
        const rotation = { x: 0, y: 0, z: this.zRotate};
        // Rotation relative to here (this is the center of the image)
        // const rotPt = { x: this.w / 2, y: this.h / 2 };
        const rotPt = { x: this.rotAnchor.x, y: this.rotAnchor.y };

        ctx.setTransform(new DOMMatrix()
            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
            .rotateSelf(rotation.x, rotation.y, rotation.z)
        );

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.roundRect(-rotPt.x, -rotPt.y, this.w, this.h, [20]);
        ctx.stroke();
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(-rotPt.x, -rotPt.y, this.w, this.h, [20]);
        ctx.fill();

        this.drawFlag(flagInfo, -rotPt.x, -rotPt.y);

        // ctx.font = 'bold 24px Montserrat';
        // ctx.textAlign = 'left';
        // ctx.textBaseline = 'top';
        // ctx.fillStyle = '#000';
        // ctx.fillText(this.txt, -rotPt.x + this.mid.x, -rotPt.y + this.mid.y);
        this.txt.drawRot('text', -rotPt.x, -rotPt.y, this.w, this.h);

        // ctx.beginPath();
        // ctx.rect(this.txt.texts['text'].x, this.txt.texts['text'].y, this.txt.texts['text'].w, this.txt.texts['text'].h);
        // ctx.stroke();

        ctx.restore();
    }

    update(delta) {
        if (this.startRotation) {
            this.x += this.rotationVel * delta;
            
            this.zRotate += this.rotationVel * delta; 

            if (Math.abs(this.x) > 60 && Math.abs(this.zRotate) > 90) {
                this.zRotate = 0;
                this.startRotation = false;
                this.rotationVel = 0;
                this.x = this.ox;
                this.rotationStatus = 2;
            }
        }
    }

    draw(ctx, flagInfo) {
        this.drawOuter(ctx, flagInfo);
    }
}