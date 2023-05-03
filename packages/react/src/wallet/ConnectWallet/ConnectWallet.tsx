import { darkTheme, iconSize, lightTheme, spacing } from "../../design-system";
import { ConnectedWalletDetails, DropDownPosition } from "./Details";
import { ThemeProvider } from "@emotion/react";
import {
  ThirdwebThemeContext,
  useAddress,
  useConnectionStatus,
  useLogin,
  useLogout,
  useThirdwebAuthContext,
  useUser,
  useWallet,
} from "@thirdweb-dev/react-core";
import { useContext, useState } from "react";
import {
  useIsConnectingToWalletWrapper,
  useSetIsWalletModalOpen,
  useSetModalTheme,
} from "../../evm/providers/wallet-ui-states-provider";
import { Button } from "../../components/buttons";
import { Spinner } from "../../components/Spinner";
import styled from "@emotion/styled";
import { fadeInAnimation } from "../../components/FadeIn";
import type { LoginOptions } from "@thirdweb-dev/auth";
import { LockIcon } from "./icons/LockIcon";
import { Flex } from "../../components/basic";
import { shortenAddress } from "../../evm/utils/addresses";
import { SignatureModal } from "./SignatureModal";
import { NetworkSelectorProps } from "./NetworkSelector";

type ConnectWalletProps = {
  className?: string;
  theme?: "dark" | "light";
  btnTitle?: string;
  dropdownPosition?: DropDownPosition;
  auth?: {
    loginOptions?: LoginOptions;
    loginOptional?: boolean;
    onLogin?: (token: string) => void;
    onLogout?: () => void;
  };
  style?: React.CSSProperties;
  networkSelector?: Omit<NetworkSelectorProps, "theme" | "onClose" | "chains">;
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
  const isConnectingToWalletWrapper = useIsConnectingToWalletWrapper();
  const connectionStatus = useConnectionStatus();

  const isLoading =
    connectionStatus === "connecting" || connectionStatus === "unknown";

  const btnTitle = props.btnTitle || "Connect Wallet";
  const setIsWalletModalOpen = useSetIsWalletModalOpen();

  const setModalTheme = useSetModalTheme();

  const address = useAddress();
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const authConfig = useThirdwebAuthContext();
  const { user } = useUser();
  const { login } = useLogin();
  const { logout } = useLogout();

  const requiresSignIn = props.auth?.loginOptional
    ? false
    : !!authConfig?.authUrl && !!address && !user?.address;

  const signIn = async () => {
    try {
      setShowSignatureModal(true);
      const token = await login(props.auth?.loginOptions);
      props?.auth?.onLogin?.(token);
    } catch (err) {
      console.error("failed to log in", err);
    }
    setShowSignatureModal(false);
  };

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      {showSignatureModal && (
        <SignatureModal
          open={showSignatureModal}
          setOpen={setShowSignatureModal}
        />
      )}

      {/* Sign In Button */}
      {requiresSignIn && (
        <Button
          variant="inverted"
          onClick={signIn}
          data-theme={theme}
          className={`${TW_CONNECT_WALLET}--sign-in ${props.className || ""}}`}
          style={props.style}
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
      )}

      {!requiresSignIn &&
        (!activeWallet || isConnectingToWalletWrapper ? (
          // connect wallet button
          <AnimatedButton
            disabled={isLoading}
            className={`${props.className || ""} ${TW_CONNECT_WALLET}`}
            data-theme={theme}
            data-is-loading={isLoading}
            variant="inverted"
            type="button"
            style={{
              minWidth: "140px",
              ...props.style,
            }}
            aria-label={
              connectionStatus === "connecting" ? "Connecting" : btnTitle
            }
            onClick={() => {
              setModalTheme(theme);
              setIsWalletModalOpen(true);
            }}
          >
            {isLoading ? <Spinner size="sm" color="inverted" /> : btnTitle}
          </AnimatedButton>
        ) : (
          <ConnectedWalletDetails
            networkSelector={props.networkSelector}
            dropdownPosition={props.dropdownPosition}
            className={props.className}
            theme={theme}
            style={props.style}
            onDisconnect={() => {
              if (authConfig?.authUrl) {
                logout();
                props?.auth?.onLogout?.();
              }
            }}
          />
        ))}
    </ThemeProvider>
  );
};

const AnimatedButton = styled(Button)`
  animation: ${fadeInAnimation} 300ms ease;
`;
