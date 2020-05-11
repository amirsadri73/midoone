import React, { Component } from 'react';
import {
  View,
  NetInfo,
  Platform,
  UIManager,
  Dimensions,
  BackHandler,
  LayoutAnimation,
} from 'react-native';
import Realm from '../utils/DB';
import HomeTabNavigation from './HomeTabNavigation';
import PlayerComponentContainer from './PlayerComponentContainer';

// device height
const DeviceHeight = Dimensions.get('window').height;

class AppComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerTopPosition: -(DeviceHeight),
    };

    // back button press subscriber
    this.appDidFocusSubscription = null;

    // init android back button press listener
    this.androidBackButtonPressListener();

    // init connection change event listener
    this.connectionChangeListener();

    // layout animation config for android
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  // lifecycle method
  componentDidMount() {
    // get connection status on app load
    this.connectionStatusOnLoad();
    // get all tracks from DB
    this.props.getAllTracks();
    // listen for changes in DB
    this.DBChangeListener();
  }

  // lifecycle method
  componentWillReceiveProps(nextProps) {
    // if player opened / closed
    if (nextProps.playerVisible) {
      // prepare layout animation
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      // change state
      this.setState({
        playerTopPosition: 0,
      });
    } else {
      // prepare layout animation
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      // change state
      this.setState({
        playerTopPosition: -(DeviceHeight),
      });
    }
  }

  // lifecycle method
  componentWillUnmount() {
    // remove connection change event listener
    this.connectionChangeListenerRemove();
    // remove android back button listener
    this.appDidFocusSubscription.remove();
  }

  // connection status on app load
  connectionStatusOnLoad = () => {
    NetInfo.isConnected.fetch().then((isConnected) => {
      this.handleConnectionChange(isConnected);
    });
  }

  // connection change handler
  handleConnectionChange = (isConnected) => {
    // dispatch action to set net status
    this.props.setConnectionStatus(isConnected);
  };

  // connectivity change event listener
  connectionChangeListener() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
  }

  // remove connectivity change event listener
  connectionChangeListenerRemove() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  // DB change listener
  DBChangeListener = () => {
    Realm.addListener('change', () => {
      // on change, get all tracks from DB again
      this.props.getAllTracks();
    });
  }

  // android back button press event handler for hiding the player
  handleAndroidBackButtonPress = () => {
    // if player is visible,
    if (this.props.playerVisible) {
      // hide it
      this.props.hidePlayer();
      // and don't pop the navigation
      return true;
    }
    // else, act normal
    return false;
  };

  // android back button press event listener for hiding the player
  androidBackButtonPressListener = () => {
    // if this view is loaded
    this.appDidFocusSubscription = this.props.navigation.addListener('didFocus', () =>
      BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButtonPress));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.app}>
          <HomeTabNavigation />
        </View>
        <View style={[styles.player, { top: this.state.playerTopPosition }]}>
          <PlayerComponentContainer />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  app: {
    flex: 1,
  },
  player: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    // top: -(Dimensions.get('window').height),
    backgroundColor: '#fff',
  },
};

export default AppComponent;
