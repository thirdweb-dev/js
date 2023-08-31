import { useState, createContext, useContext } from "react";
import { defaultModalTitle } from "../../wallet/ConnectWallet/constants";

type BoolSetter = (value: boolean) => void;

type ModalConfig = {
  title: string;
  theme: "light" | "dark";
  data: any;
  modalSize: "wide" | "compact";
};

const WalletModalOpen = /* @__PURE__ */ createContext(false);
const SetWalletModalOpen = /* @__PURE__ */ createContext<
  BoolSetter | undefined
>(undefined);

export const ModalConfigCtx = /* @__PURE__ */ createContext<ModalConfig>({
  title: "",
  theme: "dark",
  data: undefined,
  modalSize: "wide",
});

export const SetModalConfigCtx = /* @__PURE__ */ createContext<
  React.Dispatch<React.SetStateAction<ModalConfig>>
>(() => {});

export const WalletUIStatesProvider = (
  props: React.PropsWithChildren<{ theme?: "light" | "dark" }>,
) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: defaultModalTitle,
    theme: props.theme || "dark",
    data: undefined,
    modalSize: "wide",
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
