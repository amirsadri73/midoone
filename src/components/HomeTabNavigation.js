import React from 'react';
import { Image,View } from 'react-native';
import { createTabNavigator } from 'react-navigation';
// import 3 tabs which are stacks themselves
import RecorderStackNavigation from './RecorderStackNavigation';
import SearchStackNavigation from './SearchStackNavigation';
import PlaylistStackNavigation from './PlaylistStackNavigation';

const HomeTabNavigation = createTabNavigator({
  Recorder: {
    screen: RecorderStackNavigation,
    navigationOptions: {
      tabBarIcon: () => <View style={{height:'100%',width:'100%',flexDirection:'column',justifyContent:'flex-start', }}><View style={{ backgroundColor:'#ffcb08',height:'95%',width:'100%',alignItems:'center',justifyContent:'center', }}><Image source={require('../assets/img/logo.png')} style={{ width: 26, height: 26 }} /></View></View>,
    },
  },
  Search: {
    screen: SearchStackNavigation,
    navigationOptions: {
      tabBarIcon: () => <View style={{height:'100%',width:'100%',flexDirection:'column',justifyContent:'flex-start', }}><View style={{ backgroundColor:'#ffcb08',height:'95%',width:'100%',alignItems:'center',justifyContent:'center', }}><Image source={require('../assets/img/search-icon.png')} style={{ width: 20, height: 20 }} /></View></View>
          ,
    },
  },
  Playlist: {
    screen: PlaylistStackNavigation,
    navigationOptions: {
      tabBarIcon: () => <View style={{height:'100%',width:'100%',flexDirection:'column',justifyContent:'flex-start', }}><View style={{ backgroundColor:'#ffcb08',height:'95%',width:'100%',alignItems:'center',justifyContent:'center', }}><Image source={require('../assets/img/playlist-icon.png')} style={{ width: 20, height: 20 }} /></View></View>
          ,
    },
  },
}, {
  order: ['Search', 'Recorder', 'Playlist'],
  initialRouteName: 'Recorder',
  swipeEnabled: false,
  tabBarPosition: 'bottom',

  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    pressColor: '#d3a910',

      // activeTintColor:'white',
      // inactiveTintColor:'#D3D3D3',
      // style:{
      //     backgroundColor:'green',
      //     borderTopWidth:1,
      //     borderTopColor:'#D3D3D3',
      //     height:80,
      // },
      // indicatorStyle: {
      //     backgroundColor: '#000',
      //     borderWidth:10,
      //     borderColor: '#000',
      //     activeTintColor: '#000',
      //
      //
      // },


      // tabBarSelectedItemStyle: {
      // backgroundColor:"blue",
      //     borderBottomWidth: 5,
      //     borderColor: "red",
      // },
      // backgroundColor:"#000",
      // borderBottomWidth: 5,
      // borderColor: "#000",




      activeTintColor: 'white', activeBackgroundColor: '#000', inactiveTintColor: 'pink', style: { backgroundColor: '#ffcb08' }

   // indicatorStyle: {
    //  backgroundColor: '#2B2D32',
   // },
   // style: {
   //   backgroundColor: '#ffcb08',
     //   height: 80, // default is 48
   // },
  },
  lazy: true,
  removeClippedSubviews: true,
});

export default HomeTabNavigation;
