import { useState, createContext, useContext } from "react";
import { defaultModalTitle } from "../../wallet/ConnectWallet/constants";
import { isMobile } from "../utils/isMobile";
import { ThemeOptions } from "../../design-system";

type BoolSetter = (value: boolean) => void;

export type ModalConfig = {
  title: string;
  theme: "light" | "dark";
  themeOptions?: ThemeOptions;
  data: any;
  modalSize: "wide" | "compact";
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
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
  props: React.PropsWithChildren<{
    theme?: "light" | "dark";
    themeOptions?: ThemeOptions;
    modalSize: "wide" | "compact";
    title?: string;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  }>,
) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const _isMobile = isMobile();

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: props.title || defaultModalTitle,
    theme: props.theme || "dark",
    data: undefined,
    modalSize: _isMobile ? "compact" : props.modalSize,
    themeOptions: props.themeOptions,
    termsOfServiceUrl: props.termsOfServiceUrl,
    privacyPolicyUrl: props.privacyPolicyUrl,
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
