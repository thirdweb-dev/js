import { useState, createContext, useContext } from "react";

type BoolSetter = (value: boolean) => void;
type ThemeSetter = (value: "light" | "dark") => void;
type Screen =
  | "metamask/connecting"
  | "walletList"
  | "coinbase/connecting"
  | "coinbase/scan"
  | "metamask/scan"
  | "metamask/get-started"
  | "coinbase/get-started"
  | "safe/select-wallet"
  | "safe/form"
  | "wallets/get-started"
  | "deviceWallet/connect";

const SafeConnection = createContext(false);
const SetSafeConnection = createContext<BoolSetter | undefined>(undefined);
const WalletModalOpen = createContext(false);
const SetWalletModalOpen = createContext<BoolSetter | undefined>(undefined);
const ScreenContext = createContext<Screen>("walletList");
const SetScreenContext = createContext<
  React.Dispatch<React.SetStateAction<Screen>> | undefined
>(undefined);
const ModalThemeContext = createContext<"light" | "dark">("dark");
const SetModalThemeContext = createContext<ThemeSetter | undefined>(undefined);

export const WalletUIStatesProvider = (
  props: React.PropsWithChildren<{ theme?: "light" | "dark" }>,
) => {
  const [isConnectingToSafe, setIsConnectingToSafe] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("walletList");
  const [modalTheme, setModalTheme] = useState(props.theme || "dark");

  return (
    <SafeConnection.Provider value={isConnectingToSafe}>
      <SetSafeConnection.Provider value={setIsConnectingToSafe}>
        <WalletModalOpen.Provider value={isWalletModalOpen}>
          <SetWalletModalOpen.Provider value={setIsWalletModalOpen}>
            <ScreenContext.Provider value={screen}>
              <SetScreenContext.Provider value={setScreen}>
                <ModalThemeContext.Provider value={modalTheme}>
                  <SetModalThemeContext.Provider value={setModalTheme}>
                    {props.children}
                  </SetModalThemeContext.Provider>
                </ModalThemeContext.Provider>
              </SetScreenContext.Provider>
            </ScreenContext.Provider>
          </SetWalletModalOpen.Provider>
        </WalletModalOpen.Provider>
      </SetSafeConnection.Provider>
    </SafeConnection.Provider>
  );
};

export const useIsConnectingToSafe = () => {
  return useContext(SafeConnection);
};

export const useIsWalletModalOpen = () => {
  return useContext(WalletModalOpen);
};

export const useSetIsConnectingToSafe = () => {
  const context = useContext(SetSafeConnection);
  if (context === undefined) {
    throw new Error("useSetSafeConnection must be used within a UIProvider");
  }
  return context;
};

export const useSetIsWalletModalOpen = () => {
  const context = useContext(SetWalletModalOpen);
  if (context === undefined) {
    throw new Error("useSetWalletModalOpen must be used within a UIProvider");
  }
  return context;
};

export const useScreen = () => {
  return useContext(ScreenContext);
};

export const useSetScreen = () => {
  const context = useContext(SetScreenContext);
  if (context === undefined) {
    throw new Error("useSetScreen must be used within a UIProvider");
  }
  return context;
};

export const useModalTheme = () => {
  return useContext(ModalThemeContext);
};

export const useSetModalTheme = () => {
  const context = useContext(SetModalThemeContext);
  if (context === undefined) {
    throw new Error("useSetModalTheme must be used within a UIProvider");
  }
  return context;
};
