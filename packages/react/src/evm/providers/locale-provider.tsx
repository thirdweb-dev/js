import { createContext, useContext } from "react";
import { ThirdwebLocale, enDefault } from "../locales/en";

export const ThirdwebLocaleContext = /* @__PURE__ */ (() =>
  createContext<ThirdwebLocale>(enDefault()))();

export function useTWLocale() {
  return useContext(ThirdwebLocaleContext);
}
