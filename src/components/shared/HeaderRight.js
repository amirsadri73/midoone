import React from 'react';
import { View, Image, TouchableHighlight,TouchableWithoutFeedback, Keyboard } from 'react-native';

const HeaderRight = ({ navigation }) => (
  <TouchableWithoutFeedback
    onPress={() => {
      // dismiss keyboard if open
      Keyboard.dismiss();
      // show player
      navigation.state.params.showPlayer();
    }}
    
      style={{backgroundColor:'transparent'}}
  >
    <View style={{ borderRadius: 10 }}>
      <Image
        source={require('../../assets/img/music-icon.png')}
        style={{ width: 20, height: 20, margin: 16 }}
      />
    </View>
  </TouchableWithoutFeedback>
);

export default HeaderRight;
