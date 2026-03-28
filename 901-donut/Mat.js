const m = {
  cos: (angle) => Math.cos(angle),
  sin: (angle) => Math.sin(angle),
  // m3 = [a,b,c,d,e,f,g,h,i]
  m3: {
    makeV3: (x, y, z) => [x, y, z],
    makeIdentity: () => [1, 0, 0, 0, 1, 0, 0, 0, 1],
    makeRotateX: (angle) => [
      1,
      0,
      0,
      0,
      Math.cos(angle),
      -Math.sin(angle),
      0,
      Math.sin(angle),
      Math.cos(angle),
    ],
    makeRotateY: (angle) => [
      Math.cos(angle),
      0,
      Math.sin(angle),
      0,
      1,
      0,
      -Math.sin(angle),
      0,
      Math.cos(angle),
    ],
    makeRotateZ: (angle) => [
      Math.cos(angle),
      -Math.sin(angle),
      0,
      Math.sin(angle),
      Math.cos(angle),
      0,
      0,
      0,
      1,
    ],
    makeScale: (x, y, z) => [x, 0, 0, 0, y, 0, 0, 0, z],
    makeTranslate: (x, y, z) => [1, 0, x, 0, 1, y, 0, 0, 1],
    // Multiply two matrices 3x3, returns a new matrix 3x3
    // multiply: (m1, m2) => [m1[0] * m2[0] + m1[1] * m2[3] + m1[2] * m2[6]],
  },
  // v3 = [x,y,z], ie v[0] is always x
  v3arr: {
    // Create a vector with 3 components using array instead of object
    makeIdentity: (x, y, z) => [x, y, z],
    // Rotate a vector around the Z axis, returns a new vector
    makeRotateX: (v, angle) => [
      v[0],
      v[1] * Math.cos(angle) - v[2] * Math.sin(angle),
      v[1] * Math.sin(angle) + v[2] * Math.cos(angle),
    ],
    makeRotateY: (v, angle) => [
      v[0] * Math.cos(angle) + v[2] * Math.sin(angle),
      v[1],
      -v[0] * Math.sin(angle) + v[2] * Math.cos(angle),
    ],
    makeRotateZ: (v, angle) => [
      v[0] * Math.cos(angle) - v[1] * Math.sin(angle),
      v[0] * Math.sin(angle) + v[1] * Math.cos(angle),
      v[2],
    ],
    // Dot of two vectors, returns a scalar
    dot: (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2],
  },
  // v3 = {x,y,z}, v.x is always x
  v3: {
    makeVector: (x, y, z) => ({ x, y, z }),
    makeIdentity: (x, y, z) => ({ x, y, z }),
    makeRotateX: (v, angle) => ({
      x: v.x,
      y: v.y * Math.cos(angle) - v.z * Math.sin(angle),
      z: v.y * Math.sin(angle) + v.z * Math.cos(angle),
    }),
    makeRotateY: (v, angle) => ({
      x: v.x * Math.cos(angle) + v.z * Math.sin(angle),
      y: v.y,
      z: -v.x * Math.sin(angle) + v.z * Math.cos(angle),
    }),
    makeRotateZ: (v, angle) => ({
      x: v.x * Math.cos(angle) - v.y * Math.sin(angle),
      y: v.x * Math.sin(angle) + v.y * Math.cos(angle),
      z: v.x * Math.cos(angle) - v.y * Math.sin(angle),
    }),
    // retorna new v3 = m3 * v3
    // assume v3 is object and m3 is array, return new vec3 as objeto {x, y, z}
    multiplyV3ByM3: (v, m) => ({
      x: m[0] * v.x + m[1] * v.y + m[2] * v.z,
      y: m[3] * v.x + m[4] * v.y + m[5] * v.z,
      z: m[6] * v.x + m[7] * v.y + m[8] * v.z,
    }),
    dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z,
  },
  // v2 = [x,y], v[0] is always x
  v2: {
    identity: (x, y) => [x, y],
    rotate: (v, angle) => [
      v[0] * Math.cos(angle) - v[1] * Math.sin(angle),
      v[0] * Math.sin(angle) + v[1] * Math.cos(angle),
    ],
  },
};
