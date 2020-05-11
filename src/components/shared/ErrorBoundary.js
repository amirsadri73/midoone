import React, { Component } from 'react';
import { View } from 'react-native';
// import Modal from 'react-native-modalbox';
import { MText } from './MText';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.error) {
      // Fallback UI if an error occurs
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <MText>{this.state.error}</MText>
          <MText>{this.state.errorInfo}</MText>
        </View>
      );
    }
    // component normally just renders children
    return this.props.children;
  }
}

export default ErrorBoundary;
