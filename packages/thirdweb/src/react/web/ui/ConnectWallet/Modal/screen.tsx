"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useConnectUI } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { useActiveAccount } from "../../../hooks/wallets/useActiveAccount.js";
import { reservedScreens } from "../constants.js";

type Screen = string | Wallet;

export type ScreenSetup = {
  screen: Screen;
  setScreen: (newSreen: Screen) => void;
  initialScreen: Screen;
};

export const ScreenSetupContext = /* @__PURE__ */ createContext<
  ScreenSetup | undefined
>(undefined);

/**
 * @internal
 */
export function useSetupScreen() {
  const { wallets, connectModal } = useConnectUI();

  let initialScreen: Screen = reservedScreens.main;

  const socialLogin = wallets.find(
    (w) => w.id === "embedded" || w.id === "inApp",
  );

  if (wallets.length === 1 && wallets[0]) {
    initialScreen = wallets[0];
  } else if (
    connectModal.size === "wide" &&
    !connectModal.welcomeScreen &&
    socialLogin
  ) {
    initialScreen = socialLogin;
  }

  const [screen, setScreen] = useState<string | Wallet>(initialScreen);
  const prevInitialScreen = useRef(initialScreen);
  const activeAccount = useActiveAccount();

  // when the initial screen changes, reset the screen to the initial screen ( if the modal is closed )
  useEffect(() => {
    if (initialScreen !== prevInitialScreen.current) {
      prevInitialScreen.current = initialScreen;
      setScreen(initialScreen);
    }
  }, [initialScreen]);

  // if on signature screen and suddenly the wallet is disconnected, go back to the main screen
  useEffect(() => {
    if (!activeAccount && screen === reservedScreens.signIn) {
      setScreen(reservedScreens.main);
    }
  }, [activeAccount, screen]);

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
  const ctx = useContext(ScreenSetupContext);
  if (!ctx) {
    throw new Error(
      "useScreenContext must be used within a <ScreenProvider />",
    );
  }
  return ctx;
}
