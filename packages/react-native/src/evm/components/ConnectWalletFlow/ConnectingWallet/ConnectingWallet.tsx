import React, {ReactNode} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Wallet} from '../../../types/wallet';
import {ConnectWalletHeader} from './ConnectingWalletHeader';

export type ConnectingWalletProps = {
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  footer?: ReactNode;
  onClose: () => void;
  wallet: Wallet;
};

export function ConnectingWallet({
  subHeaderText,
  wallet,
  footer,
  onClose,
}: ConnectingWalletProps) {
  return (
    <View>
      <ConnectWalletHeader
        walletLogoUrl={wallet.image_url.lg}
        subHeaderText={subHeaderText}
        close={onClose}
      />
      <View style={styles.connectingContainer}>
        <ActivityIndicator size="small" color="#C4C4C4" />
        <Text style={styles.text}>
          Connect your wallet through the {wallet.name} application.
        </Text>
      </View>
      {footer ? (
        footer
      ) : (
        <TouchableOpacity style={styles.footer}>
          <Text style={styles.footerText}>
            Having troubles connecting to {wallet.name}?
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 24,
    color: '#3385FF',
    letterSpacing: -0.02,
  },
  text: {
    fontWeight: '500',
    color: '#646D7A',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.02,
    textAlign: 'center',
    marginTop: 18,
  },
  connectingContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 18,
  },
});
