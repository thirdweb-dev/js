import React, {ReactNode} from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Text} from 'react-native';

interface ConnectWalletHeaderProps {
  close: () => void;
  walletLogoUrl: string;
  subHeaderText?: ReactNode | string;
}

export const ConnectWalletHeader = ({
  subHeaderText = 'Connecting your wallet',
  walletLogoUrl,
  close,
}: ConnectWalletHeaderProps) => {
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={() => close()}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
          <Text>{'<'}</Text>
        </TouchableOpacity>
        <Image alt='wallet logo' style={styles.walletLogo} source={{uri: walletLogoUrl}} />
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={() => close()}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
          <Text>X</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.subHeader}>
        {typeof subHeaderText === 'string' ? (
          <Text style={styles.subHeaderText}>{subHeaderText}</Text>
        ) : (
          subHeaderText
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  subHeaderText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 32,
    color: '#F1F1F1',
    letterSpacing: -0.02,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  walletLogo: {
    width: 56,
    height: 56,
  },
  navIcon: {
    width: 14,
    height: 14,
  },
  closeContainer: {
    height: 28,
    width: 28,
    backgroundColor: '#141414',
    borderRadius: 14,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
