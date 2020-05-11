import React, { Component } from 'react';
import { View, Image, /*TouchableNativeFeedback,*/TouchableHighlight,TouchableWithoutFeedback, Alert } from 'react-native';
import Swiper from 'react-native-swiper';
import { MText, MTextBold } from './shared/MText';

const styles = {
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2b2d32',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
  },
};

class WelcomeView extends Component {
  onSkipBtnHandle = (index) => {
    Alert.alert('Skip');
    console.log(index);
  }
  doneBtnHandle = () => {
    Alert.alert('Done');
  }
  nextBtnHandle = (index) => {
    Alert.alert('Next');
    console.log(index);
  }
  onSlideChangeHandle = (index, total) => {
    console.log(index, total);
  }
  startButtonPress = () => {
    this.props.onStartButton();
  }
  render() {
    return (
      <Swiper
        style={styles.wrapper}
        loop={false}
        dot={
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,.2)',
              width: 8,
              height: 8,
              borderRadius: 4,
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: '#000',
              width: 12,
              height: 12,
              borderRadius: 6,
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
            }}
          />
        }
      >
        <View style={styles.slide1}>
          <Image
            source={require('../assets/img/logo.png')}
            style={styles.logo}
          />
          <MText style={styles.text}>میدونه</MText>
        </View>
        <View style={styles.slide2}>
          <MText style={styles.text}>خوش آمدید</MText>
        </View>
        <View style={styles.slide3}>
          <MText style={styles.text}>لورم ایپسوم</MText>
          <TouchableWithoutFeedback
            
            onPress={() => this.startButtonPress()}
          >
            <View style={styles.startButton}>
              <MText>شروع!</MText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Swiper>
    );
  }
}

export default WelcomeView;
