import { createContext } from "react";

export const ThirdwebThemeContext = /* @__PURE__ */ createContext<
  "light" | "dark" | undefined
>(undefined);
