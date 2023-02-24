import React, {ReactNode} from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Text} from 'react-native';

interface ChooseWalletHeaderProps {
  close: () => void;
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
}

export const ChooseWalletHeader = ({
  headerText = 'Choose your Wallet',
  subHeaderText = 'Select the wallet that you want to connect to Thirdweb',
  close,
}: ChooseWalletHeaderProps) => {
  return (
    <>
      <View style={styles.header}>
        {typeof headerText === 'string' ? (
          <Text style={styles.headerText}>{headerText}</Text>
        ) : (
          headerText
        )}
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={() => close()}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
          <Image
            style={styles.closeImage}
            source={require('../../../assets/icons/close.png')}
          />
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
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: '#F1F1F1',
  },
  subHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: '#646D7A',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  closeImage: {
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
