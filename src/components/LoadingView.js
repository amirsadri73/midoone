import React from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';

const LoadingView = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#2b2d32" />
  </View>
);

export default LoadingView;

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
