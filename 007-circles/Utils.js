class Utils {
  static map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
  // returns value from [min, max), inclusive min, exclusive max
  static randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  // returns integer [min, max)
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
