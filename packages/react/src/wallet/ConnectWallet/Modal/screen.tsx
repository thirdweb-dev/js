import { WalletConfig, useWallet, useWallets } from "@thirdweb-dev/react-core";
import { createContext, useState, useContext, useEffect, useRef } from "react";
import { reservedScreens } from "../constants";

type Screen = string | WalletConfig;

export const ScreenContext = /* @__PURE__ */ createContext<Screen | undefined>(
  undefined,
);

export function useScreen() {
  const walletConfigs = useWallets();
  const initialScreen =
    (walletConfigs.length === 1 && !walletConfigs[0]?.selectUI
      ? walletConfigs[0]
      : reservedScreens.main) || reservedScreens.main;

  const [screen, setScreen] = useState<string | WalletConfig>(initialScreen);
  const prevInitialScreen = useRef(initialScreen);
  const wallet = useWallet();

  // when the initial screen changes, reset the screen to the initial screen ( if the modal is closed )
  useEffect(() => {
    if (initialScreen !== prevInitialScreen.current) {
      prevInitialScreen.current = initialScreen;
      setScreen(initialScreen);
    }
  }, [initialScreen]);

  // if on signature screen and suddenly the wallet is disconnected, go back to the main screen
  useEffect(() => {
    if (!wallet && screen === reservedScreens.signIn) {
      setScreen(reservedScreens.main);
    }
  }, [wallet, screen]);

  return {
    screen,
    setScreen,
    initialScreen,
  };
}

export function useScreenContext() {
  const screen = useContext(ScreenContext);
  if (!screen) {
    throw new Error(
      "useScreenContext must be used within a <ScreenProvider />",
    );
  }
  return screen;
}
