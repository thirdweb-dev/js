"use client";

import { useTheme } from "next-themes";
import { DarkVeil } from "@/components/DarkVeil";

const bgBackground: Record<string, [number, number, number]> = {
  dark: [0, 0, 0],
  light: [250 / 255, 250 / 255, 250 / 255],
};

const hues = {
  light: 65,
  dark: -85,
};

const patternLightnesss = {
  light: -1,
  dark: 0.8,
};

export function BridgeVeil() {
  const theme = useTheme();
  const isLight = theme.theme === "light";
  const patternLightness = isLight
    ? patternLightnesss.light
    : patternLightnesss.dark;
  const hueShift = isLight ? hues.light : hues.dark;
  return (
    <DarkVeil
      backgroundColor={bgBackground[isLight ? "light" : "dark"]}
      patternLightness={patternLightness}
      hueShift={hueShift}
      warpAmount={0.5}
    />
  );
}
