import "@ethersproject/shims";
import "@walletconnect/react-native-compat";
import "react-native-get-random-values";

if (typeof BigInt === "undefined") {
  global.BigInt = require("big-integer");
}
if (typeof Buffer === "undefined") {
  global.Buffer = require("buffer").Buffer;
}
global.btoa = global.btoa || require("base-64").encode;
global.atob = global.atob || require("base-64").decode;
