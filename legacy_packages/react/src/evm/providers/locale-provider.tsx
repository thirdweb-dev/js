import { createContext, useContext } from "react";
import { enDefault } from "../locales/en";
import { ThirdwebLocale } from "../locales/types";

export const ThirdwebLocaleContext = /* @__PURE__ */ (() =>
  createContext<ThirdwebLocale>(enDefault()))();

export function useTWLocale() {
  return useContext(ThirdwebLocaleContext);
}
