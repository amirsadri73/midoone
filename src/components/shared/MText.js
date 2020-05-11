import React, { Component } from 'react';
import { Text } from 'react-native';

export class MText extends Component {
  render() {
    return (
      <Text style={{fontFamily: 'IRANSansMobile', ...this.props.style}} onPress={this.props.onPress} numberOfLines={this.props.numberOfLines}>{this.props.children}</Text>
    )
  }
}

export class MTextBold extends Component {
  render() {
    return (
      <Text style={{fontFamily: 'IRANSansMobile', ...this.props.style}} onPress={this.props.onPress} numberOfLines={this.props.numberOfLines}>{this.props.children}</Text>
    )
  }
}

export class MTextLight extends Component {
  render() {
    return (
      <Text style={{fontFamily: 'IRANSansMobile', ...this.props.style}} onPress={this.props.onPress} numberOfLines={this.props.numberOfLines}>{this.props.children}</Text>
    )
  }
}
