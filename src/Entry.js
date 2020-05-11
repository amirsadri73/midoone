import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import OneSignal from 'react-native-onesignal';
import AppComponentContainer from './components/AppComponentContainer';
import WelcomeView from './components/WelcomeView';

class Entry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstLaunch: null,
    };
  }

  // lifecycle method
  componentWillMount() {
    // check for first launch
    this.checkForFirstLaunch();
    // init onesignal with app id
    OneSignal.init('6ded2be3-52cd-461e-91ae-a1e4718e9a29');
  }

  // check for first launch
  checkForFirstLaunch = async () => {
    try {
      // the value is stored with async storage
      const value = await AsyncStorage.getItem('alreadyLaunched');
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        this.setState({
          firstLaunch: true,
        });
      } else {
        this.setState({
          firstLaunch: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // on start app button press
  onStartButton = () => {
    this.setState({
      firstLaunch: false,
    });
  }

  render() {
    // decide to render welcome screen or app based on first launch value
    if (this.state.firstLaunch === null) {
      return null;
    } else if (this.state.firstLaunch === true) {
      return <WelcomeView onStartButton={this.onStartButton} />;
    }
    return <AppComponentContainer />;
  }
}

export default Entry;
