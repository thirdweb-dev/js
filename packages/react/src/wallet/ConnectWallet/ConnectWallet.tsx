import { Theme, iconSize, spacing } from "../../design-system";
import { ConnectedWalletDetails, type DropDownPosition } from "./Details";
import {
  ThirdwebThemeContext,
  useAddress,
  useConnectionStatus,
  useLogin,
  useLogout,
  useNetworkMismatch,
  useSwitchChain,
  useThirdwebAuthContext,
  useUser,
  useWallet,
  useWalletContext,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useContext, useState } from "react";
import {
  SetModalConfigCtx,
  useSetIsWalletModalOpen,
} from "../../evm/providers/wallet-ui-states-provider";
import { Button } from "../../components/buttons";
import { Spinner } from "../../components/Spinner";
import styled from "@emotion/styled";
import { fadeInAnimation } from "../../components/FadeIn";
import { LockIcon } from "./icons/LockIcon";
import { Flex } from "../../components/basic";
import { shortenAddress } from "../../evm/utils/addresses";
import { SignatureModal } from "./SignatureModal";
import type { NetworkSelectorProps } from "./NetworkSelector";
import { defaultModalTitle } from "./constants";
import { isMobile } from "../../evm/utils/isMobile";
import { CustomThemeProvider } from "../../design-system/CustomThemeProvider";
import { WelcomeScreen } from "./screens/types";

type ConnectWalletProps = {
  className?: string;
  theme?: "dark" | "light" | Theme;

  btnTitle?: string;
  /**
   * Set a custom title for the modal
   * @default "Connect"
   */
  modalTitle?: string;
  /**
   * render a custom button to display the connected wallet details instead of the default button
   */
  detailsBtn?: () => JSX.Element;
  dropdownPosition?: DropDownPosition;
  auth?: {
    loginOptional?: boolean;
    onLogin?: (token: string) => void;
    onLogout?: () => void;
  };

  style?: React.CSSProperties;

  networkSelector?: Omit<NetworkSelectorProps, "theme" | "onClose" | "chains">;

  /**
   * Hide option to request testnet funds for testnets in dropdown
   *
   * @default false
   */
  hideTestnetFaucet?: boolean;

  /**
   * Whether to show "Switch Network" button if the wallet is connected,
   * but it is not connected to the `activeChain` provided in `ThirdwebProvider`
   *
   * Please, note that if you support multiple networks in your app this prop should
   * be set to `false` to allow users to switch between networks.
   *
   * @default false
   */
  switchToActiveChain?: boolean;

  /**
   * Set the size of the modal - `compact` or `wide` on desktop
   *
   * Modal size is always `compact` on mobile
   *
   * @default "wide"
   */
  modalSize?: "compact" | "wide";

  /**
   * If provided, Modal will show a Terms of Service message at the bottom with below link
   */
  termsOfServiceUrl?: string;

  /**
   * If provided, Modal will show a Privacy Policy message at the bottom with below link
   */
  privacyPolicyUrl?: string;

  /**
   * Customize the welcome screen
   *
   * Either provide a component to replace the default screen entirely
   *
   * or an object with title, subtitle and imgSrc to change the content of the default screen
   */
  welcomeScreen?: WelcomeScreen;
};

const TW_CONNECT_WALLET = "tw-connect-wallet";

/**
 * A component that allows the user to connect their wallet.
 *
 * The button must be descendant of `ThirdwebProvider` in order to function.
 */
export const ConnectWallet: React.FC<ConnectWalletProps> = (props) => {
  const activeWallet = useWallet();
  const themeFromProvider = useContext(ThirdwebThemeContext);
  const theme = props.theme || themeFromProvider || "dark";
  const connectionStatus = useConnectionStatus();

  const walletConfigs = useWallets();
  const isLoading =
    connectionStatus === "connecting" || connectionStatus === "unknown";

  const btnTitle = props.btnTitle || "Connect Wallet";
  const setIsWalletModalOpen = useSetIsWalletModalOpen();

  const setModalConfig = useContext(SetModalConfigCtx);

  const address = useAddress();
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const authConfig = useThirdwebAuthContext();
  const { user } = useUser();
  const { login } = useLogin();
  const { logout } = useLogout();
  const isNetworkMismatch = useNetworkMismatch();
  const { activeChainSetExplicitly } = useWalletContext();

  const requiresSignIn = props.auth?.loginOptional
    ? false
    : !!authConfig?.authUrl && !!address && !user?.address;

  const signIn = async () => {
    try {
      setShowSignatureModal(true);
      const token = await login();
      props?.auth?.onLogin?.(token);
    } catch (err) {
      console.error("failed to log in", err);
    }
    setShowSignatureModal(false);
  };

  return (
    <CustomThemeProvider theme={theme}>
      {showSignatureModal && (
        <SignatureModal
          open={showSignatureModal}
          setOpen={setShowSignatureModal}
        />
      )}

      {(() => {
        // wallet is not connected
        if (!activeWallet) {
          // Connect Wallet button
          return (
            <AnimatedButton
              disabled={isLoading}
              className={`${props.className || ""} ${TW_CONNECT_WALLET}`}
              data-theme={theme}
              data-is-loading={isLoading}
              variant="primary"
              type="button"
              style={{
                minWidth: "140px",
                ...props.style,
              }}
              aria-label={
                connectionStatus === "connecting" ? "Connecting" : btnTitle
              }
              onClick={() => {
                let modalSize = props.modalSize || "wide";

                if (isMobile() || walletConfigs.length === 1) {
                  modalSize = "compact";
                }

                setModalConfig({
                  title: props.modalTitle || defaultModalTitle,
                  theme,
                  data: undefined,
                  modalSize,
                  termsOfServiceUrl: props.termsOfServiceUrl,
                  privacyPolicyUrl: props.privacyPolicyUrl,
                  welcomeScreen: props.welcomeScreen,
                });
                setIsWalletModalOpen(true);
              }}
              data-test="connect-wallet-button"
            >
              {isLoading ? <Spinner size="sm" color="base1" /> : btnTitle}
            </AnimatedButton>
          );
        }

        // switch network button
        if (
          props.switchToActiveChain &&
          isNetworkMismatch &&
          activeChainSetExplicitly
        ) {
          return (
            <SwitchNetworkButton
              style={props.style}
              className={props.className}
            />
          );
        }

        // sign in button
        else if (requiresSignIn) {
          return (
            <Button
              variant="primary"
              onClick={signIn}
              data-theme={theme}
              className={`${TW_CONNECT_WALLET}--sign-in ${
                props.className || ""
              }`}
              style={props.style}
              data-test="sign-in-button"
            >
              <Flex
                alignItems="center"
                gap="sm"
                style={{
                  paddingRight: spacing.xs,
                  borderRight: "1px solid",
                  marginRight: spacing.xs,
                }}
              >
                <LockIcon size={iconSize.sm} />
                <span> Sign in </span>
              </Flex>
              <span>{shortenAddress(address || "", true)}</span>
            </Button>
          );
        }

        // wallet details button
        return (
          <ConnectedWalletDetails
            networkSelector={props.networkSelector}
            dropdownPosition={props.dropdownPosition}
            className={props.className}
            style={props.style}
            detailsBtn={props.detailsBtn}
            hideTestnetFaucet={props.hideTestnetFaucet}
            onDisconnect={() => {
              if (authConfig?.authUrl) {
                logout();
                props?.auth?.onLogout?.();
              }
            }}
          />
        );
      })()}
    </CustomThemeProvider>
  );
};

function SwitchNetworkButton(props: {
  style?: React.CSSProperties;
  className?: string;
}) {
  const { activeChain } = useWalletContext();
  const switchChain = useSwitchChain();
  const [switching, setSwitching] = useState(false);

  return (
    <AnimatedButton
      className={`${TW_CONNECT_WALLET}--switch-network ${
        props.className || ""
      }`}
      variant="primary"
      type="button"
      data-is-loading={switching}
      data-test="switch-network-button"
      disabled={switching}
      onClick={async () => {
        setSwitching(true);
        try {
          await switchChain(activeChain.chainId);
        } catch {
          // ignore
        }
        setSwitching(false);
      }}
      style={{
        minWidth: "140px",
        ...props.style,
      }}
      aria-label={switching ? "Switching Network" : undefined}
    >
      {switching ? <Spinner size="sm" color="base1" /> : "Switch Network"}
    </AnimatedButton>
  );
}

const AnimatedButton = /* @__PURE__ */ styled(Button)`
  animation: ${fadeInAnimation} 300ms ease;
`;
