import "@ethersproject/shims";
import "@walletconnect/react-native-compat";

if (typeof BigInt === "undefined") {
  global.BigInt = require("big-integer");
}
if (typeof Buffer === "undefined") {
  global.Buffer = require("buffer").Buffer;
}

// @ts-ignore: Unreachable code error
global.process.version = "v0.9";
if (typeof process === "undefined") {
  global.process = require("process");
}
global.btoa = global.btoa || require("base-64").encode;
global.atob = global.atob || require("base-64").decode;
