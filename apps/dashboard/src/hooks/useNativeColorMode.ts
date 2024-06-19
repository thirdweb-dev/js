import { useColorModeValue } from "@chakra-ui/react";
import { useLayoutEffect } from "react";

export function useNativeColorMode() {
  const activeColorMode = useColorModeValue("light", "dark");
  useLayoutEffect(() => {
    document
      .getElementById("tw-body-root")
      ?.style.setProperty("color-scheme", activeColorMode);
  }, [activeColorMode]);
  return undefined;
}
