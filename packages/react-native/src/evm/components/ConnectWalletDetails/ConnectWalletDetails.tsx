import { shortenString } from '../../utils/addresses';
import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';

export type ConnectWalletDetailsProps = {
  address: string;
}

export const ConnectWalletDetails = ({address}: ConnectWalletDetailsProps) => {
  return (
    <TouchableOpacity style={styles.connectWalletButton}>
        <View />
        <Text style={styles.text}>{shortenString(address)}</Text>
        <Text>V</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#F1F1F1',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24
  },
  connectWalletButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131417',
    borderRadius: 12,
    borderColor: '#646D7A',
    borderWidth: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
});
