import React from 'react';
import { createTabNavigator } from 'react-navigation';
import { MText } from './shared/MText';
// import tabs
import RecorderResultViewPurchaseTab from './RecorderResultViewPurchaseTab';
import RecorderResultViewDownloadTab from './RecorderResultViewDownloadTab';

// create tab navigator
const RecorderResultViewTabs = createTabNavigator(
  {
    DownloadTab: {
      screen: RecorderResultViewDownloadTab,
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (<MText style={{ color: tintColor }}>دانلود موزیک</MText>),
      },
    },
    PurchaseTab: {
      screen: RecorderResultViewPurchaseTab,
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (<MText style={{ color: tintColor }}>خرید موزیک</MText>),
      },
    },
  },
  {
    tabBarPosition: 'top',
    backBehavior: 'none',
    initialRouteName: 'DownloadTab',
    tabBarOptions: {
      showIcon: false,
      showLabel: true,
      activeTintColor: '#ffcb08',
      inactiveTintColor: '#000',
      pressColor: '#ffcb08',
      indicatorStyle: {
        backgroundColor: '#ffcb08',
      },
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: '#fff',
        height: 40,
        elevation: 0,
        borderBottomColor: '#eaeaea',
        borderBottomWidth: 2,
      },
    },
  },
);

export default RecorderResultViewTabs;
