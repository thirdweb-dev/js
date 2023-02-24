import React, {ReactNode} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Wallet} from '../../../types/wallet';
import {ChooseWalletContent} from './ChooseWalletContent';
import {ChooseWalletHeader} from './ChooseWalletHeader';

export type ChooseWalletProps = {
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  footer?: ReactNode;
  onChooseWallet: (wallet: Wallet) => void;
  onClose: () => void;
  wallets: Wallet[];
};

export function ChooseWallet({
  headerText,
  subHeaderText,
  wallets,
  footer,
  onChooseWallet,
  onClose,
}: ChooseWalletProps) {
  return (
    <View>
      <ChooseWalletHeader
        headerText={headerText}
        subHeaderText={subHeaderText}
        close={onClose}
      />
      <ChooseWalletContent wallets={wallets} onChooseWallet={onChooseWallet} />
      {footer ? (
        footer
      ) : (
        <TouchableOpacity style={styles.footer}>
          <Text style={styles.footerText}>Need help getting started?</Text>
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
});
