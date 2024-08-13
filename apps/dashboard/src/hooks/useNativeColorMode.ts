"use client";

import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useColorModeValue } from "@chakra-ui/react";

export function useNativeColorMode() {
  const activeColorMode = useColorModeValue("light", "dark");
  useIsomorphicLayoutEffect(() => {
    document
      .getElementById("tw-body-root")
      ?.style.setProperty("color-scheme", activeColorMode);
  }, [activeColorMode]);
  return undefined;
}
