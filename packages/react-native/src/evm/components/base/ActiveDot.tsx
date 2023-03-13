import React from 'react';
import {StyleSheet, View} from 'react-native';

export const ActiveDot = () => {
  return <View style={styles.dot} />;
};

const styles = StyleSheet.create({
  dot: {
    width: 28,
    height: 28,
    borderRadius: 50,
    top: '60%',
    right: 0,
    backgroundColor: '#00d395',
    position: 'absolute',
  },
});
