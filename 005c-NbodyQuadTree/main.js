const W = 800;
const H = 800;
class Particle {
  constructor() {
    this.position = new Vec2(0, 0);
    this.velocity = new Vec2(0, 0);
    this.acceleration = new Vec2(0, 0);
    this.force = new Vec2(0, 0);
    this.mass = 10;
    this.qt = null;
  }
  integrate(dtSec) {
    // F = m * a => a = F / m
    this.acceleration.x = this.force.x / this.mass;
    this.acceleration.y = this.force.y / this.mass;
    // Integrate velocity
    this.velocity.x += this.acceleration.x * dtSec;
    this.velocity.y += this.acceleration.y * dtSec;
    // Integrate position
    this.position.x += this.velocity.x * dtSec;
    this.position.y += this.velocity.y * dtSec;
    // Reset force
    this.force = new Vec2(0, 0);
  }
  render(pen) {
    // Particle position
    pen.circle(this.position.x, this.position.y, 1, "white");
    // Particle speed vector
    // pen.line(
    //   this.position.x,
    //   this.position.y,
    //   this.position.x + this.velocity.x,
    //   this.position.y + this.velocity.y,
    //   "red"
    // );
  }
}
class GalaxySimulator {
  constructor(pen) {
    this.pen = pen;
    this.particles = [];
  }
  buildGalaxy(NUM_PARTICLES) {
    const MAX_RADIUS = 180;
    const NUM_ARMS = 3;
    const SPREAD = 1;
    const CORE_RADIUS = 10;
    const G = 1000;
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const p = new Particle();
      // Pick spiral arm
      const armIndex = Math.floor(Math.random() * NUM_ARMS);
      const armOffset = (armIndex / NUM_ARMS) * Math.PI * 2;
      // Radius distribution, dense near center (quadratic curve grow)
      const radius =
        CORE_RADIUS + Math.pow(Math.random(), 2) * (MAX_RADIUS - CORE_RADIUS);
      // Base spiral angle
      let angle = radius * 0.1 + armOffset;
      // Add angular randomness
      angle += (Math.random() - 0.5) * SPREAD;
      // Compute position in galaxy plane
      const x = W / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      const y = H / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
      p.position = new Vec2(x, y);
      // Compute orbital velocity (bigger near center)
      const speed = Math.sqrt(G / (radius + 1)); // +1 avoids div by zero
      // Tangential direction
      const quarterCircle = Math.PI / 2;
      const tangentAngle = angle + quarterCircle;
      const vx = Math.cos(tangentAngle) * speed * (0.9 + Math.random() * 0.2);
      const vy = Math.sin(tangentAngle) * speed * (0.9 + Math.random() * 0.2);
      p.velocity = new Vec2(vx, vy);
      // Vary mass by radius (heavier near core)
      p.mass = 5 + (1 - radius / MAX_RADIUS) * 15;
      this.particles.push(p);
    }
  }
  startLoop = () => {
    window.requestAnimationFrame(this.loop);
  };
  loop = () => {
    const t0 = performance.now();
    this.integrate();
    this.render();
    const t1 = performance.now();
    [`delta: ${t1 - t0}ms`].map((text, idx) => {
      this.pen.text(text, 10, 20 + idx * 20, "white", "16px Arial");
    });
    window.requestAnimationFrame(this.loop);
  };
  integrate = () => {
    const dtSec = 16 / 1000;

    // 1) build quadtree each frame
    this.qt = new QuadTree({ x: 0, y: 0, w: W, h: H }, 4);
    for (let i = 0; i < this.particles.length; i++) {
      this.qt.insert(this.particles[i]);
    }

    // 2) compute forces and integrate motion
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      // Big mass at center of canvas
      const centerX = W / 2;
      const centerY = H / 2;
      const dx = centerX - p.position.x;
      const dy = centerY - p.position.y;
      const distSq = dx * dx + dy * dy;
      const G_CONST = 1000;
      // Avoid divide-by-zero
      if (distSq > 1.0) {
        const F = (G_CONST * p.mass) / distSq;
        const dist = Math.sqrt(distSq);
        const fx = (dx / dist) * F;
        const fy = (dy / dist) * F;
        p.force.x += fx;
        p.force.y += fy;
      }
      // Integrate particle motion
      p.integrate(dtSec);
    }
  };
  render = () => {
    this.pen.clear("black");
    // Draw particles
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].render(this.pen);
    }
    // Draw quadtree
    if (this.qt) {
      this.qt.render(this.pen);
    }
  };
}
window.onload = () => {
  const pen = new Pen(document.getElementById("mycanvas"), W, H);
  const galaxy = new GalaxySimulator(pen);
  galaxy.buildGalaxy(100);
  galaxy.startLoop();
};
