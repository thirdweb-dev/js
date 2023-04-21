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
  | "deviceWallet/connect"
  | "deviceWallet/export"
  | "smartWallet/form";

type WalletWrapper = false | "safe" | "smartWallet";

const WalletWrapperConnection = createContext<WalletWrapper>(false);
const SetWalletWrapperConnection = createContext<
  ((value: WalletWrapper) => void) | undefined
>(undefined);

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
  const [isConnectingToWalletWrapper, setIsConnectingToWalletWrapper] =
    useState<WalletWrapper>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("walletList");
  const [modalTheme, setModalTheme] = useState(props.theme || "dark");

  return (
    <WalletWrapperConnection.Provider value={isConnectingToWalletWrapper}>
      <SetWalletWrapperConnection.Provider
        value={setIsConnectingToWalletWrapper}
      >
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
      </SetWalletWrapperConnection.Provider>
    </WalletWrapperConnection.Provider>
  );
};

export const useIsConnectingToWalletWrapper = () => {
  return useContext(WalletWrapperConnection);
};

export const useIsWalletModalOpen = () => {
  return useContext(WalletModalOpen);
};

export const useSetIsConnectingToWalletWrapper = () => {
  const context = useContext(SetWalletWrapperConnection);
  if (context === undefined) {
    throw new Error(
      "useSetIsConnectingToWalletWrapper must be used within a UIProvider",
    );
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
