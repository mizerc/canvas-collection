function renderDonut(pen, W, H, RX, RY, RZ, R1, R2, K1, K2) {
  const TWO_PI = 6.28;
  const zbuffer = [];
  // FILL BUFFER WITH -INFINITY
  pen.fillArray(zbuffer, W, H, -Infinity);
  for (let tetha = 0; tetha < TWO_PI; tetha += 0.05) {
    for (let phi = 0; phi < TWO_PI; phi += 0.05) {
      // COMPUTE VERTEX OF TORUS
      let vertex = vec3.makeIdentity();
      // FIRST RADIUS OF TORUS (SECTION CIRCLE)
      vertex.x = R1 * m.cos(tetha);
      vertex.y = R1 * m.sin(tetha);
      vertex.z = 0;
      // SECOND RADIUS OF TORUS (PATH CIRCLE)
      vertex.x += R2;
      vertex = m.v3.multiplyV3ByM3(vertex, mat3.makeRotateY(phi));
      // ROTATE TORUS AROUND X, Y, Z AXES
      vertex = m.v3.multiplyV3ByM3(vertex, mat3.makeScale(2, 1, 1));
      vertex = m.v3.multiplyV3ByM3(vertex, mat3.makeRotateX(RX));
      vertex = m.v3.multiplyV3ByM3(vertex, mat3.makeRotateY(RY));
      vertex = m.v3.multiplyV3ByM3(vertex, mat3.makeRotateZ(RZ));
      // MOVE TORUS AWAY FROM CAMERA
      vertex.z += K2;
      // PROJECT 3D POINT TO 2D POINT USING SIMPLE PERSPECTIVE DIVISION
      const px = (vertex.x * K1) / vertex.z;
      const py = (vertex.y * K1) / vertex.z;
      // TRANSLATE 2D POINT TO THE CENTER OF THE CANVAS
      const sx = W / 2 + px;
      const sy = H / 2 - py;
      // LIGHT POSITION
      const light_pos = m.v3.makeIdentity(0, 0, -1);
      // COMPUTE SURFACE NORMAL
      let normal = m.v3.makeIdentity();
      normal.x = R1 * m.cos(tetha);
      normal.y = R1 * m.sin(tetha);
      normal.z = 0;
      normal.x += R2;
      normal = m.v3.multiplyV3ByM3(normal, m.m3.makeRotateY(phi));
      normal = m.v3.multiplyV3ByM3(normal, m.m3.makeScale(2, 1, 1));
      normal = m.v3.multiplyV3ByM3(normal, m.m3.makeRotateX(RX));
      normal = m.v3.multiplyV3ByM3(normal, m.m3.makeRotateY(RY));
      normal = m.v3.multiplyV3ByM3(normal, m.m3.makeRotateZ(RZ));
      // NORMALIZE NORMAL
      const normal_length = Math.sqrt(
        normal.x * normal.x + normal.y * normal.y + normal.z * normal.z
      );
      normal.x /= normal_length;
      normal.y /= normal_length;
      normal.z /= normal_length;
      // COMPUTE LIGHT USING SIMPLE DOT PRODUCT
      const light_intensity = m.v3.dot(light_pos, normal);
      // GO OVER EACH CANVAS PIXEL
      if (sx >= 0 && sx < W && sy >= 0 && sy < H) {
        // TRANSFORM 2D COORDINATES TO 1D INDEX FOR ZBUFFER ARRAY
        const xy_to_index = Math.floor(sx + W * sy);
        // USE ZBUFFER TO KEEP ONLY THE CLOSEST POINTS TO THE CAMERA
        if (vertex.z > zbuffer[xy_to_index]) {
          zbuffer[xy_to_index] = vertex.z;
          // COLORFUL PIXELS BASED ON LIGHT INTENSITY
          const colorList = [
            "white",
            "gray",
            "yellow",
            "orange",
            "red",
            "purple",
            "blue",
          ];
          const color =
            colorList[Math.floor(light_intensity * colorList.length)];
          pen.setPixel(sx, sy, color);
          // BLEND
          // const RANGE = 2;
          // for (let ox = -RANGE; ox <= RANGE; ox++) {
          //   for (let oy = -RANGE; oy <= RANGE; oy++) {
          //     if (ox === 0 && oy === 0) continue;
          //     pen.setPixel(sx + ox, sy + oy, color);
          //   }
          // }
        }
      }
    }
  }
}
