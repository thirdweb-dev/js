import { darkTheme, lightTheme, Theme } from "../../design-system";
import { ConnectWalletFlow } from "./Connect";
import { ConnectedWalletDetails, DropDownPosition } from "./Details";
import { ThemeProvider } from "@emotion/react";
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
      {!activeWallet ? (
        <ConnectWalletFlow
          btnClass={props.className}
          btnTitle={props.btnTitle}
        />
      ) : (
        <ConnectedWalletDetails dropdownPosition={props.dropdownPosition} />
      )}
    </ThemeProvider>
  );
};
