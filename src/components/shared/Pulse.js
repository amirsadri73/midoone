import React, { Component } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

const styles = StyleSheet.create({
  pulse: {
    position: 'absolute',
    alignSelf: 'center',
    width: 50,
    height: 50,
    borderRadius: 75,
    borderWidth: 4 * StyleSheet.hairlineWidth,
    borderColor: '#ffcb08',
    backgroundColor: 'transparent',
  },
});

export default class Pulse extends Component {
  constructor(props) {
    super(props);

    this.anim = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this.anim, {
      toValue: 1,
      duration: 2300,
      easing: Easing.inout,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const anim = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 3],
    });
    return (
      <Animated.View style={[styles.pulse, {
        transform: [
          { scaleX: anim },
          { scaleY: anim },
        ],
        opacity: this.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
      }]}
      />
    );
  }
}
