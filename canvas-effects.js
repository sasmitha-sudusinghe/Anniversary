// Romantic Canvas Effects: Falling Petals, Twinkling Stars, Cursor Trail & Celebration Fireworks

class RomanticCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.petals = [];
    this.stars = [];
    this.particles = [];
    this.fireworks = [];
    this.trailParticles = [];
    
    this.mouse = { x: -100, y: -100, isMoving: false };
    this.mouseTimer = null;
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Track cursor for glowing stardust trail
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.spawnTrail(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        this.mouse.x = t.clientX;
        this.mouse.y = t.clientY;
        this.spawnTrail(t.clientX, t.clientY);
      }
    }, { passive: true });

    // Seed stars & petals
    this.createStars();
    this.createPetals();

    // Start animation loop
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createStars() {
    this.stars = [];
    const count = Math.floor((this.width * this.height) / 7000);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
      });
    }
  }

  createPetals() {
    this.petals = [];
    const count = Math.min(35, Math.floor(this.width / 40));
    for (let i = 0; i < count; i++) {
      this.petals.push(this.createPetal(true));
    }
  }

  createPetal(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: Math.random() * 12 + 8,
      speedY: Math.random() * 1.2 + 0.8,
      speedX: Math.random() * 1.0 - 0.5,
      angle: Math.random() * 360,
      spinSpeed: (Math.random() * 1.5 - 0.75) * 0.02,
      swayOffset: Math.random() * 100,
      swaySpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.4 + 0.6,
      color: Math.random() > 0.3 ? '#ffb7c5' : (Math.random() > 0.5 ? '#f49ac2' : '#ffd1dc')
    };
  }

  spawnTrail(x, y) {
    if (Math.random() > 0.4) return;
    this.trailParticles.push({
      x: x + (Math.random() * 14 - 7),
      y: y + (Math.random() * 14 - 7),
      radius: Math.random() * 2.5 + 1,
      color: Math.random() > 0.5 ? '#ffd700' : '#ff9ebb',
      alpha: 1,
      decay: Math.random() * 0.03 + 0.02,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8 - 0.5
    });
  }

  // Trigger celebration explosion (hearts + sparkles)
  celebrate(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 60) {
    const colors = ['#ff4d79', '#ff85a2', '#ffd1dc', '#ffd700', '#ff9ebb', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.012,
        isHeart: Math.random() > 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1
      });
    }
  }

  drawHeart(ctx, x, y, size, color, alpha, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    // Top left curve
    ctx.bezierCurveTo(
      -size / 2, -size / 2,
      -size, topCurveHeight / 2,
      0, size
    );
    // Top right curve
    ctx.bezierCurveTo(
      size, topCurveHeight / 2,
      size / 2, -size / 2,
      0, topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawPetal(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.opacity;

    const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, p.size);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, p.color);
    grad.addColorStop(1, 'rgba(235, 110, 150, 0.3)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw twinkling stars
    this.stars.forEach(star => {
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 0.95 || star.alpha < 0.2) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }
      this.ctx.save();
      this.ctx.fillStyle = `rgba(255, 245, 220, ${star.alpha})`;
      this.ctx.shadowBlur = star.radius * 3;
      this.ctx.shadowColor = 'rgba(255, 230, 180, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    // 2. Draw falling petals
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.swayOffset) * 0.8 + p.speedX;
      p.swayOffset += p.swaySpeed;
      p.angle += p.spinSpeed;

      this.drawPetal(this.ctx, p);

      if (p.y > this.height + 30 || p.x < -30 || p.x > this.width + 30) {
        this.petals[i] = this.createPetal(false);
      }
    }

    // 3. Draw cursor trail
    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const tp = this.trailParticles[i];
      tp.x += tp.vx;
      tp.y += tp.vy;
      tp.alpha -= tp.decay;

      if (tp.alpha <= 0) {
        this.trailParticles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = tp.alpha;
      this.ctx.fillStyle = tp.color;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = tp.color;
      this.ctx.beginPath();
      this.ctx.arc(tp.x, tp.y, tp.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 4. Draw celebration particles & hearts
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.12; // gravity
      pt.vx *= 0.98;
      pt.alpha -= pt.decay;
      pt.rotation += pt.rotSpeed;

      if (pt.alpha <= 0 || pt.y > this.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      if (pt.isHeart) {
        this.drawHeart(this.ctx, pt.x, pt.y, pt.size, pt.color, pt.alpha, pt.rotation);
      } else {
        this.ctx.save();
        this.ctx.globalAlpha = pt.alpha;
        this.ctx.fillStyle = pt.color;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = pt.color;
        this.ctx.beginPath();
        this.ctx.arc(pt.x, pt.y, pt.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.canvasEffects = new RomanticCanvas('ambient-canvas');
});
