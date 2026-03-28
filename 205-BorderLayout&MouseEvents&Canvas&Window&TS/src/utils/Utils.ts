export class Utils {
  // Maps a value from range in to range out
  static map(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
  ): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  // Returns random float from [min, max), inclusive min, exclusive max.
  static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // Returns random integer [min, max).
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
