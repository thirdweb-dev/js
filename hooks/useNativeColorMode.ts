import { useColorModeValue } from "@chakra-ui/system";
import { useEffect } from "react";

export function useNativeColorMode() {
  const activeColorMode = useColorModeValue("light", "dark");
  useEffect(() => {
    document
      .getElementById("tw-body-root")
      ?.style.setProperty("color-scheme", activeColorMode);
  }, [activeColorMode]);
  return undefined;
}
