import { createContext } from "react";

export const ThirdwebThemeContext = createContext<"light" | "dark" | undefined>(
  undefined,
);
