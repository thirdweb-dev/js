import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export const ModalFooter = ({
  footer,
  onPress,
}: {
  footer: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.footer} onPress={onPress}>
      <Text style={styles.footerText}>{footer}</Text>
    </TouchableOpacity>
  );
};

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
