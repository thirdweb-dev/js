import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Wallet} from '../../../types/wallet';

interface InitialExplorerContentProps {
  wallets: Wallet[];
  onChooseWallet: (wallet: Wallet) => void;
}

export const ChooseWalletContent = ({
  wallets,
  onChooseWallet,
}: InitialExplorerContentProps) => {
  return (
    <View style={styles.explorerContainer}>
      <FlatList
        data={wallets}
        renderItem={({item, index}) => {
          const marginBottom = index === wallets.length - 1 ? 0 : 8;
          return (
            <TouchableOpacity
              style={[styles.row, {marginBottom: marginBottom}]}
              onPress={() => onChooseWallet(item)}>
              <Image
                style={styles.walletImage}
                source={{uri: item.image_url.sm}}
              />
              <Text style={styles.rowWalletText}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rowWalletText: {
    fontWeight: '600',
    color: '#F1F1F1',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.02,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#232429',
    borderRadius: 12,
  },
  walletImage: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  explorerContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 25,
  },
});
