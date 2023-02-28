import { useWalletsContext } from "../contexts/wallets-context";
import { ConnectWalletDetails } from "./ConnectWalletDetails/ConnectWalletDetails";
import { ConnectWalletFlow } from "./ConnectWalletFlow/ConnectWalletFlow";
import { useActiveWallet, useAddress } from "@thirdweb-dev/react-core";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const ConnectWallet = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const address = useAddress();
  const activeWallet = useActiveWallet();
  const { setActiveWalletMeta } = useWalletsContext();

  useEffect(() => {
    if (!activeWallet) {
      setActiveWalletMeta(undefined);
    }
  }, [activeWallet, setActiveWalletMeta]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim, width: 200 }}>
      {address ? (
        <ConnectWalletDetails address={address} />
      ) : (
        <ConnectWalletFlow />
      )}
    </Animated.View>
  );
};
