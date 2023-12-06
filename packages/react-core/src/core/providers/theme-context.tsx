import { createContext } from "react";

/**
 * @internal
 */
export const ThirdwebThemeContext = /* @__PURE__ */ createContext<
  "light" | "dark" | undefined
>(undefined);
