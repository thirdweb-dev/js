import { type AbiFunction, formatAbiItem } from "abitype";
import { normalizeSignature } from "./normalizeSignature.js";

export const getFunctionSignature = (fn: string | AbiFunction) => {
  return normalizeSignature(typeof fn === "string" ? fn : formatAbiItem(fn));
};
