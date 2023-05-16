import { useState, createContext, useContext } from "react";

type BoolSetter = (value: boolean) => void;
type ThemeSetter = (value: "light" | "dark") => void;

const WalletModalOpen = createContext(false);
const SetWalletModalOpen = createContext<BoolSetter | undefined>(undefined);

const ModalThemeContext = createContext<"light" | "dark">("dark");
const SetModalThemeContext = createContext<ThemeSetter | undefined>(undefined);

export const WalletUIStatesProvider = (
  props: React.PropsWithChildren<{ theme?: "light" | "dark" }>,
) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const [modalTheme, setModalTheme] = useState(props.theme || "dark");

  return (
    <WalletModalOpen.Provider value={isWalletModalOpen}>
      <SetWalletModalOpen.Provider value={setIsWalletModalOpen}>
        <ModalThemeContext.Provider value={modalTheme}>
          <SetModalThemeContext.Provider value={setModalTheme}>
            {props.children}
          </SetModalThemeContext.Provider>
        </ModalThemeContext.Provider>
      </SetWalletModalOpen.Provider>
    </WalletModalOpen.Provider>
  );
};

export const useIsWalletModalOpen = () => {
  return useContext(WalletModalOpen);
};

export const useSetIsWalletModalOpen = () => {
  const context = useContext(SetWalletModalOpen);
  if (context === undefined) {
    throw new Error(
      "useSetWalletModalOpen must be used within a ThirdwebProvider",
    );
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
