const gravity = 0.3;
const friction = 1.0;
const shapes = ['circle', 'square', 'triangle', 'star'];
const neonColors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff6600', '#ff0000', '#ff69b4'];

// UI shape selection
let selectedShape = 'random';
// document.getElementById('shapeSelect').addEventListener('change', e => {
//   selectedShape = e.target.value;
// });

class ShapeParticle {
  constructor(x, y) {
    this.alpha = 0;
    this.reset(x, y);
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 12 + 20;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = Math.random() * -8 - 4;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.3;
    this.alpha = 1;
    this.shape = selectedShape === 'random'
      ? shapes[Math.floor(Math.random() * shapes.length)]
      : selectedShape;
    this.color = neonColors[Math.floor(Math.random() * neonColors.length)];
  }

  update() {
    if (this.alpha <= 0) return;
    this.vy += gravity;
    this.vx *= friction;
    this.vy *= friction;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.alpha -= 0.01;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.strokeStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = this.alpha;
    ctx.lineWidth = 2;

    ctx.beginPath();
    switch (this.shape) {
      case 'circle':
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        break;
      case 'square':
        ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
        break;
      case 'triangle':
        drawTriangle(ctx, this.size);
        break;
      case 'star':
        drawStar(ctx, 5, this.size / 2, this.size);
        break;
    }
    ctx.stroke();
    ctx.restore();
  }
}

// Pool
const poolSize = 50;
let particles = Array.from({ length: poolSize }, () => new ShapeParticle(-1000, -1000));
let nextParticleIndex = 0;

function drawTriangle(ctx, size) {
  const h = size * Math.sqrt(3) / 2;
  ctx.moveTo(-size / 2, h / 2);
  ctx.lineTo(size / 2, h / 2);
  ctx.lineTo(0, -h / 2);
  ctx.closePath();
}

function drawStar(ctx, points, innerRadius, outerRadius) {
  const step = Math.PI / points;
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function explode(x, y, shape = 'random', count = 30) {
    selectedShape = shape;
    
    for (let i = 0; i < count; i++) {
        const p = particles[nextParticleIndex];
        p.reset(x, y);
        nextParticleIndex = (nextParticleIndex + 1) % poolSize;
    }
}