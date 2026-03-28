class Utils {
  // Maps a value from range in to range out
  static map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
  // Returns random float from [min, max), inclusive min, exclusive max.
  static randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  // Returns random integer [min, max).
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
