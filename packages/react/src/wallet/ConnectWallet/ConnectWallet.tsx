import { darkTheme, lightTheme, Theme } from "../../design-system";
import { ConnectWalletFlow } from "./ConnectWalletFlow";
import {
  ConnectedWalletDetails,
  DropDownPosition,
} from "./ConnectedWalletDetails";
import { keyframes, ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import {
  ThirdwebThemeContext,
  useActiveWallet,
} from "@thirdweb-dev/react-core";
import { useContext } from "react";

type ConnectWalletProps = {
  className?: string;
  theme?: "dark" | "light" | Theme;
  btnTitle?: string;
  dropdownPosition?: DropDownPosition;
};

/**
 * A component that allows the user to connect their wallet.
 *
 * The button must be descendant of `ThirdwebProvider` in order to function.
 */
export const ConnectWallet: React.FC<ConnectWalletProps> = (props) => {
  const activeWallet = useActiveWallet();
  const themeFromCore = useContext(ThirdwebThemeContext);
  const theme = props.theme || themeFromCore || "dark";
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
      <FadeIn>
        {!activeWallet ? (
          <ConnectWalletFlow
            btnClass={props.className}
            btnTitle={props.btnTitle}
          />
        ) : (
          <ConnectedWalletDetails dropdownPosition={props.dropdownPosition} />
        )}
      </FadeIn>
    </ThemeProvider>
  );
};

const fadeIn = keyframes`
from {
  opacity: 0;
}
to {
  opacity: 1;
}
`;

const FadeIn = styled.div`
  animation: ${fadeIn} 0.3s ease-in-out;
`;
