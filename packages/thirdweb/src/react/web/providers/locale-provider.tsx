import { createContext, useContext } from "react";
import { enDefault } from "../ui/locales/en.js";
import type { ThirdwebLocale } from "../ui/locales/types.js";

export const ThirdwebLocaleContext = /* @__PURE__ */ (() =>
  createContext<ThirdwebLocale>(enDefault()))();

/**
 * @internal
 */
export function useTWLocale() {
  return useContext(ThirdwebLocaleContext);
}
