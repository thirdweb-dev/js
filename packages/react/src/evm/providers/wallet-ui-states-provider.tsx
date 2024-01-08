import { useState, createContext, useContext } from "react";
import { isMobile } from "../utils/isMobile";
import { Theme } from "../../design-system";
import { WelcomeScreen } from "../../wallet/ConnectWallet/screens/types";
import { useTWLocale } from "./locale-provider";

type BoolSetter = (value: boolean) => void;

export type ModalConfig = {
  title: string;
  theme: "light" | "dark" | Theme;
  data: any;
  modalSize: "wide" | "compact";
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  welcomeScreen?: WelcomeScreen;
  titleIconUrl?: string;
  auth?: {
    loginOptional?: boolean;
    onLogin?: (token: string) => void;
    onLogout?: () => void;
  };
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
    modalSize?: "wide" | "compact";
    title?: string;
    titleIconUrl?: string;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
    welcomeScreen?: WelcomeScreen;
  }>,
) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const _isMobile = isMobile();
  const locale = useTWLocale();

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: props.title || locale.connectWallet.defaultModalTitle,
    theme: props.theme || "dark",
    data: undefined,
    modalSize: (_isMobile ? "compact" : props.modalSize) || "wide",
    termsOfServiceUrl: props.termsOfServiceUrl,
    privacyPolicyUrl: props.privacyPolicyUrl,
    welcomeScreen: props.welcomeScreen,
    titleIconUrl: props.titleIconUrl,
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

/**
 * Check if the [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal is open or not
 *
 * @example
 * ```tsx
 * const isOpen = useIsWalletModalOpen();
 * ```
 *
 * @returns `true` if the [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) modal is open, `false` otherwise
 * @connectWallet
 */
export const useIsWalletModalOpen = () => {
  return useContext(WalletModalOpen);
};

/**
 * Open or close the [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal
 *
 * @example
 * ```tsx
 * const setIsWalletModalOpen = useSetIsWalletModalOpen();
 *
 * function openModal() {
 *  setIsWalletModalOpen(true);
 * }
 *
 * function closeModal() {
 *  setIsWalletModalOpen(false);
 * }
 *
 * return (
 *   <div>
 *    <button onClick={openModal}>Open Modal</button>
 *    <button onClick={closeModal}>Close Modal</button>
 *   </div>
 * )
 * ```
 *
 * @returns Function to open or close the modal
 * @connectWallet
 */
export const useSetIsWalletModalOpen = () => {
  const context = useContext(SetWalletModalOpen);
  if (context === undefined) {
    throw new Error(
      "useSetWalletModalOpen must be used within a ThirdwebProvider",
    );
  }
  return context;
};
