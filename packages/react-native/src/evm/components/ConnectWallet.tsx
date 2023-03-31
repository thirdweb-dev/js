import { ThemeProvider, ThemeProviderProps } from "../styles/ThemeProvider";
import { ConnectWalletDetails } from "./ConnectWalletDetails/ConnectWalletDetails";
import { ConnectWalletFlow } from "./ConnectWalletFlow/ConnectWalletFlow";
import { useAddress } from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export type ConnectWalletProps = {
  theme?: ThemeProviderProps["theme"];
};

export const ConnectWallet = ({ theme }: ConnectWalletProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const address = useAddress();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <ThemeProvider theme={theme}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {address ? (
          <ConnectWalletDetails address={address} />
        ) : (
          <ConnectWalletFlow />
        )}
      </Animated.View>
    </ThemeProvider>
  );
};
