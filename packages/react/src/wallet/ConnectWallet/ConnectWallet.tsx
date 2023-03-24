import { darkTheme, lightTheme } from "../../design-system";
import { ConnectedWalletDetails, DropDownPosition } from "./Details";
import { ThemeProvider } from "@emotion/react";
import {
  ThirdwebThemeContext,
  useConnectionStatus,
  useWallet,
} from "@thirdweb-dev/react-core";
import { useContext } from "react";
import {
  useIsConnectingToSafe,
  useSetIsWalletModalOpen,
  useSetModalTheme,
} from "../../evm/providers/wallet-ui-states-provider";
import { Button } from "../../components/buttons";
import { Spinner } from "../../components/Spinner";
import styled from "@emotion/styled";
import { fadeInAnimation } from "../../components/FadeIn";

type ConnectWalletProps = {
  className?: string;
  theme?: "dark" | "light";
  btnTitle?: string;
  dropdownPosition?: DropDownPosition;
};

/**
 * A component that allows the user to connect their wallet.
 *
 * The button must be descendant of `ThirdwebProvider` in order to function.
 */
export const ConnectWallet: React.FC<ConnectWalletProps> = (props) => {
  const activeWallet = useWallet();
  const themeFromProvider = useContext(ThirdwebThemeContext);
  const theme = props.theme || themeFromProvider || "dark";
  const isConnectingToSafe = useIsConnectingToSafe();
  const connectionStatus = useConnectionStatus();

  const isLoading =
    connectionStatus === "connecting" || connectionStatus === "unknown";

  const btnTitle = props.btnTitle || "Connect Wallet";
  const setIsWalletModalOpen = useSetIsWalletModalOpen();

  const setModalTheme = useSetModalTheme();

  return (
    <ThemeProvider
      theme={
        typeof theme === "object"
          ? theme
          : theme === "dark"
          ? darkTheme
          : lightTheme
      }
    >
      {!activeWallet || isConnectingToSafe ? (
        <AnimatedButton
          disabled={isLoading}
          className={props.className}
          variant="inverted"
          type="button"
          style={{
            minWidth: "140px",
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
        <ConnectedWalletDetails dropdownPosition={props.dropdownPosition} />
      )}
    </ThemeProvider>
  );
};

const AnimatedButton = styled(Button)`
  animation: ${fadeInAnimation} 300ms ease;
`;
