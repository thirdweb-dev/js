import { ThemeOverrides, darkTheme, lightTheme } from "@thirdweb-dev/react";
import { useState } from "react";

export function usePlaygroundTheme(selectedTheme: "light" | "dark") {
  const [colorOverrides, setColorOverrides] = useState<
    NonNullable<ThemeOverrides["colors"]>
  >({});
  const themeObj =
    selectedTheme === "light"
      ? lightTheme({
          colors: colorOverrides,
        })
      : darkTheme({
          colors: colorOverrides,
        });

  return {
    colorOverrides,
    setColorOverrides,
    themeObj,
  };
}
