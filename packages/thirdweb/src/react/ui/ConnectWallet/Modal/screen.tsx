import { createContext, useState, useRef, useEffect, useContext } from "react";
import { reservedScreens } from "../constants.js";
import { useThirdwebProviderProps } from "../../../hooks/others/useThirdwebProviderProps.js";
import type { WalletConfig } from "../../../types/wallets.js";
import { useActiveWallet } from "../../../providers/wallet-provider.js";

type Screen = string | WalletConfig;

export const ScreenContext = /* @__PURE__ */ createContext<Screen | undefined>(
  undefined,
);

/**
 * @internal
 */
export function useScreen() {
  const walletConfigs = useThirdwebProviderProps().wallets;
  const initialScreen =
    (walletConfigs.length === 1 && !walletConfigs[0]?.selectUI
      ? walletConfigs[0]
      : reservedScreens.main) || reservedScreens.main;

  const [screen, setScreen] = useState<string | WalletConfig>(initialScreen);
  const prevInitialScreen = useRef(initialScreen);
  const wallet = useActiveWallet();

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

/**
 * @internal
 */
export function useScreenContext() {
  const screen = useContext(ScreenContext);
  if (!screen) {
    throw new Error(
      "useScreenContext must be used within a <ScreenProvider />",
    );
  }
  return screen;
}
