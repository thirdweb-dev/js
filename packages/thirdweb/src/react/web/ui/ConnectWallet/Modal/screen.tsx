import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useWalletConnectionCtx } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
// import type { WalletConfig } from "../../../../core/types/wallets.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/wallet-hooks.js";
import { ModalConfigCtx } from "../../../providers/wallet-ui-states-provider.js";
import { reservedScreens } from "../constants.js";

type Screen = string | Wallet;

const inAppWalletId = "inApp";

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
  const wallets = useWalletConnectionCtx().wallets;
  const modalConfig = useContext(ModalConfigCtx);

  let initialScreen: Screen = reservedScreens.main;

  const socialLogin = wallets.find((w) => w.id === inAppWalletId);

  if (wallets.length === 1 && wallets[0]) {
    initialScreen = wallets[0];
  } else if (
    modalConfig.modalSize === "wide" &&
    !modalConfig.welcomeScreen &&
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
