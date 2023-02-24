import React, {useEffect, useRef} from 'react';
import {ConnectWalletFlow} from './ConnectWalletFlow/ConnectWalletFlow';
import {Animated} from 'react-native';
import {ConnectWalletDetails} from './ConnectWalletDetails/ConnectWalletDetails';
import { useAddress } from '@thirdweb-dev/react-core';

export const ConnectWallet: React.FC<{theme?: 'dark' | 'light'}> = () => {
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
    <Animated.View style={{opacity: fadeAnim}}>
      {address ? <ConnectWalletDetails address={address} /> : <ConnectWalletFlow />}
    </Animated.View>
  );
};
