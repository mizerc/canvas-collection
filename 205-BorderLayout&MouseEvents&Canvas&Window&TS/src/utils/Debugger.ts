export class Debugger {
  static blue(msg: string) {
    console.log(`%c${msg}`, "color: rgb(98, 179, 255);");
  }
  static darkblue(msg: string) {
    console.log(`%c${msg}`, "color: rgb(0, 6, 179);");
  }
  static red(msg: string) {
    console.log(`%c${msg}`, "color: red;");
  }
  static green(msg: string) {
    console.log(`%c${msg}`, "color: green;");
  }
  static yellow(msg: string) {
    console.log(`%c${msg}`, "color: rgb(205, 171, 0);");
  }
  static orange(msg: string) {
    console.log(`%c${msg}`, "color: rgb(205, 123, 0);");
  }
  static purple(msg: string) {
    console.log(`%c${msg}`, "color: rgb(146, 61, 155);");
  }
}
