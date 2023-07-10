import { useState, createContext, useContext } from "react";

type BoolSetter = (value: boolean) => void;

type ModalConfig = {
  title: string;
  theme: "light" | "dark";
  data: any;
};

const WalletModalOpen = /* @__PURE__ */ createContext(false);
const SetWalletModalOpen = /* @__PURE__ */ createContext<
  BoolSetter | undefined
>(undefined);

export const ModalConfigCtx = /* @__PURE__ */ createContext<ModalConfig>({
  title: "",
  theme: "dark",
  data: undefined,
});

export const SetModalConfigCtx = /* @__PURE__ */ createContext<
  React.Dispatch<React.SetStateAction<ModalConfig>>
>(() => {});

export const WalletUIStatesProvider = (
  props: React.PropsWithChildren<{ theme?: "light" | "dark" }>,
) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: "Choose your wallet",
    theme: props.theme || "dark",
    data: undefined,
  });

  return (
    <WalletModalOpen.Provider value={isWalletModalOpen}>
      <SetWalletModalOpen.Provider value={setIsWalletModalOpen}>
        <ModalConfigCtx.Provider value={modalConfig}>
          <SetModalConfigCtx.Provider value={setModalConfig}>
            {props.children}
          </SetModalConfigCtx.Provider>
        </ModalConfigCtx.Provider>
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
