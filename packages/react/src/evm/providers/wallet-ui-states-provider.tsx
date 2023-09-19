import { useState, createContext, useContext } from "react";
import { defaultModalTitle } from "../../wallet/ConnectWallet/constants";
import { isMobile } from "../utils/isMobile";
import { Theme } from "../../design-system";
import { WelcomeScreen } from "../../wallet/ConnectWallet/screens/types";

type BoolSetter = (value: boolean) => void;

export type ModalConfig = {
  title: string;
  theme: "light" | "dark" | Theme;
  data: any;
  modalSize: "wide" | "compact";
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  welcomeScreen?: WelcomeScreen;
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
    theme?: "light" | "dark" | Theme;
    modalSize: "wide" | "compact";
    title?: string;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
    welcomeScreen?: WelcomeScreen;
  }>,
) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const _isMobile = isMobile();

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: props.title || defaultModalTitle,
    theme: props.theme || "dark",
    data: undefined,
    modalSize: _isMobile ? "compact" : props.modalSize,
    termsOfServiceUrl: props.termsOfServiceUrl,
    privacyPolicyUrl: props.privacyPolicyUrl,
    welcomeScreen: props.welcomeScreen,
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
