import type { JWTString } from "./types.js";

export function isJWT(str: string): str is JWTString {
  return str.split(".").length === 3;
}
