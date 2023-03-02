import { ConnectWalletDetails } from "./ConnectWalletDetails/ConnectWalletDetails";
import { ConnectWalletFlow } from "./ConnectWalletFlow/ConnectWalletFlow";
import { useAddress } from "@thirdweb-dev/react-core";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const ConnectWallet = () => {
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
    <Animated.View style={{ opacity: fadeAnim }}>
      {address ? (
        <ConnectWalletDetails address={address} />
      ) : (
        <ConnectWalletFlow />
      )}
    </Animated.View>
  );
};
