import { darkTheme, lightTheme } from "../../design-system";
import { ConnectWalletFlow } from "./ConnectWalletFlow";
import { ConnectedWalletDetails } from "./ConnectedWalletDetails";
import { ThemeProvider } from "@emotion/react";
import { useActiveWallet } from "@thirdweb-dev/react-core";

export const ConnectWallet: React.FC<{ theme: "dark" | "light" }> = (props) => {
  const activeWallet = useActiveWallet();
  return (
    <ThemeProvider theme={props.theme === "dark" ? darkTheme : lightTheme}>
      {!activeWallet ? <ConnectWalletFlow /> : <ConnectedWalletDetails />}
    </ThemeProvider>
  );
};
