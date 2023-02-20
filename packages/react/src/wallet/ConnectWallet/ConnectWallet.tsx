import { darkTheme, lightTheme } from "../../design-system";
import { ConnectWalletFlow } from "./ConnectWalletFlow";
import { ConnectedWalletDetails } from "./ConnectedWalletDetails";
import { keyframes, ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { useActiveWallet } from "@thirdweb-dev/react-core";

export const ConnectWallet: React.FC<{ theme: "dark" | "light" }> = (props) => {
  const activeWallet = useActiveWallet();
  return (
    <ThemeProvider theme={props.theme === "dark" ? darkTheme : lightTheme}>
      <FadeIn>
        {!activeWallet ? <ConnectWalletFlow /> : <ConnectedWalletDetails />}
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
