import React from 'react';
import {StyleSheet, Text} from 'react-native/';
import {shortenString} from '../../utils/addresses';

export const Address = ({address}: {address: string}) => {
  return <Text style={styles.text}>{shortenString(address)}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: '#F1F1F1',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
  },
});
