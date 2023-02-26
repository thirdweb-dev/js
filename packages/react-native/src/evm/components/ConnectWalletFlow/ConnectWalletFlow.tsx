import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {TWModal} from '../base/modal/TWModal';
import {Wallet} from '../../types/wallet';
import {ChooseWallet} from './ChooseWallet/ChooseWallet';
import {ConnectingWallet} from './ConnectingWallet/ConnectingWallet';
import { useConnect, useWallets } from '@thirdweb-dev/react-core';
import { getWallets } from '../../utils/wallets';

export const ConnectWalletFlow: React.FC<{theme?: 'dark' | 'light'}> = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<Wallet | undefined>();

  const connect = useConnect();
  const supportedWallets = useWallets();

  useEffect(() => {
    if (activeWallet) {
      connect(supportedWallets[0], {});
    }
  }, [activeWallet, connect, supportedWallets]);


  const onConnectPress = () => {
    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
    setActiveWallet(undefined);
  };

  const onChooseWallet = (wallet: Wallet) => {
    setActiveWallet(wallet);
  };

  return (
    <>
      <TWModal isVisible={modalVisible}>
        {activeWallet ? (
          <ConnectingWallet wallet={activeWallet} onClose={onClose} />
        ) : (
          <ChooseWallet
            wallets={getWallets()}
            onChooseWallet={onChooseWallet}
            onClose={onClose}
          />
        )}
      </TWModal>

      <TouchableOpacity
        style={styles.connectWalletButton}
        onPress={onConnectPress}>
        <Text style={styles.darkText}>Connect Wallet</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  connectWalletView: {
    height: '50',
    minWidth: '200px',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
  },
  darkText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  connectWalletButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
});
