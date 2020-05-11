import React, { Component } from 'react';
import { View } from 'react-native';
import HeaderRight from './shared/HeaderRight';
// import the header component + tabs component
import RecorderResultViewHeader from './RecorderResultViewHeader';
import RecorderResultViewTabs from './RecorderResultViewTabs';

export default class RecorderResultView extends Component {
  // Navigation Props
  static navigationOptions = ({ navigation }) => ({
    title: 'نتیجه جستجو',
    headerStyle: {
      backgroundColor: '#ffcb08',
    },
    headerTitleStyle: {
      fontWeight: 'normal',
      fontFamily: 'IRANSansMobile',
      textAlign: 'center',
      alignSelf: 'center',
      flex: 1,
    },
    headerRight: <HeaderRight navigation={navigation} />,
  })

  constructor(props) {
    super(props);

    // pass header right button onPress method to navigation params
    this.props.navigation.setParams({ showPlayer: this.props.showPlayer });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <RecorderResultViewHeader />
        {/*
          this component is not a screen component,
          so you have to pass navigation prop manually
        */}
        <RecorderResultViewTabs screenProps={this.props.navigation.state.params} />
      </View>
    );
  }
}
