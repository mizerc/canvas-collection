// N-body simulation + Quadtree for spatial partitioning
// https://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation
class QuadTree {
  constructor(x, y, w, h, capacity = 4) {
    this.boundary = { x, y, w, h };
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
    this.nw = null;
    this.ne = null;
    this.sw = null;
    this.se = null;
  }
  getSize() {
    return this.points.length;
  }
  insert(p) {
    if (!p || !p.position) {
      throw new Error("Invalid point, must have position property");
    }

    const { x, y, w, h } = this.boundary;
    // 1) Check if the point is in boundary
    if (
      p.position.x < x ||
      p.position.x > x + w ||
      p.position.y < y ||
      p.position.y > y + h
    ) {
      // Fail to insert, out of bounds
      return false;
    }
    // 2) If there is space in this quad, add the point here
    if (this.getSize() < this.capacity && !this.divided) {
      this.points.push(p);
      // Successful insertion
      return true;
    }
    // 3) Otherwise, subdivide and add the point to whichever child will accept it
    if (!this.divided) {
      this.subdivide();
    }
    // Try inserting into children
    return (
      this.nw.insert(p) ||
      this.ne.insert(p) ||
      this.sw.insert(p) ||
      this.se.insert(p)
    );
  }
  subdivide() {
    const { x, y, w, h } = this.boundary;
    // 1) Compute half width/height
    const hw = w / 2,
      hh = h / 2;
    // 2) Create four children
    this.nw = new QuadTree(x, y, hw, hh, this.capacity);
    this.ne = new QuadTree(x + hw, y, hw, hh, this.capacity);
    this.sw = new QuadTree(x, y + hh, hw, hh, this.capacity);
    this.se = new QuadTree(x + hw, y + hh, hw, hh, this.capacity);
    // 3) Mark as divided
    this.divided = true;
  }
  query(range, found = []) {
    if (!this.intersects(range)) {
      return found;
    }
    // For each particle, check if it's in range of current rectangle
    for (const p of this.points) {
      if (
        p.position.x >= range.x &&
        p.position.x < range.x + range.w &&
        p.position.y >= range.y &&
        p.position.y < range.y + range.h
      ) {
        found.push(p);
      }
    }
    // Query children, using same found array reference
    if (this.divided) {
      this.nw.query(range, found);
      this.ne.query(range, found);
      this.sw.query(range, found);
      this.se.query(range, found);
    }
    // Return the found points
    return found;
  }
  intersects(r) {
    // Just a simple rectangle intersection test
    const b = this.boundary;
    return !(
      r.x > b.x + b.w ||
      r.x + r.w < b.x ||
      r.y > b.y + b.h ||
      r.y + r.h < b.y
    );
  }
  // For Barnes–Hut: compute center of mass and total mass
  computeMass() {
    if (!this.divided) {
      let mx = 0,
        my = 0,
        m = 0;
      for (const p of this.points) {
        mx += p.position.x * p.mass;
        my += p.position.y * p.mass;
        m += p.mass;
      }
      this.mass = m;
      this.com = m > 0 ? new Vec2(mx / m, my / m) : new Vec2(0, 0);
      return { mass: this.mass, com: this.com };
    }
    let M = 0,
      MX = 0,
      MY = 0;
    for (const c of [this.nw, this.ne, this.sw, this.se]) {
      c.computeMass();
      M += c.mass;
      MX += c.com.x * c.mass;
      MY += c.com.y * c.mass;
    }
    this.mass = M;
    this.com = M > 0 ? new Vec2(MX / M, MY / M) : new Vec2(0, 0);
    return { mass: this.mass, com: this.com };
  }
  render(pen) {
    const { x, y, w, h } = this.boundary;
    pen.strokeRect(x, y, w, h, "rgba(0,255,0,0.3)");
    if (this.divided) {
      this.nw.render(pen);
      this.ne.render(pen);
      this.sw.render(pen);
      this.se.render(pen);
    }
  }
}
