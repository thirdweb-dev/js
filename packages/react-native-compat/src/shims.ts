import "@ethersproject/shims";
import "@walletconnect/react-native-compat";

if (typeof BigInt === "undefined") {
  global.BigInt = require("big-integer");
}
if (typeof Buffer === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  global.Buffer = require("buffer").Buffer;
}

// @ts-expect-error - this works(?)
global.process.version = "v0.9";
if (typeof process === "undefined") {
  global.process = require("process");
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
global.btoa = global.btoa || require("base-64").encode;
// eslint-disable-next-line @typescript-eslint/no-var-requires
global.atob = global.atob || require("base-64").decode;
