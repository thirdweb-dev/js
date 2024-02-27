import { WalletConfig, useWallet, useWallets } from "@thirdweb-dev/react-core";
import { createContext, useState, useContext, useEffect, useRef } from "react";
import { reservedScreens } from "../constants";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";

type Screen = string | WalletConfig;

export type ScreenSetup = {
  screen: Screen;
  setScreen: (newSreen: Screen) => void;
  initialScreen: Screen;
};

export const ScreenSetupContext = /* @__PURE__ */ createContext<
  ScreenSetup | undefined
>(undefined);

export function useSetupScreen(): ScreenSetup {
  const walletConfigs = useWallets();
  const modalConfig = useContext(ModalConfigCtx);

  let initialScreen: Screen = reservedScreens.main;

  const socialLogin = walletConfigs.find((w) => w.category === "socialLogin");

  if (
    walletConfigs.length === 1 &&
    walletConfigs[0] &&
    !walletConfigs[0]?.selectUI
  ) {
    initialScreen = walletConfigs[0];
  } else if (
    modalConfig.modalSize === "wide" &&
    !modalConfig.welcomeScreen &&
    socialLogin
  ) {
    initialScreen = socialLogin;
  }

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
  const ctx = useContext(ScreenSetupContext);
  if (!ctx) {
    throw new Error(
      "useScreenContext must be used within a <ScreenProvider />",
    );
  }
  return ctx;
}
