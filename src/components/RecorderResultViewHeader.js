import React from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import TextTicker from 'react-native-text-ticker';
import { MText } from './shared/MText';

const RecorderResultViewHeader = props => (
  <View style={styles.container}>
    <View>
      <Image
        source={{ uri: props.navigation.state.params.trackInfo.header_image_url }}
        style={styles.TrackImage}
        imageStyle={{ borderRadius: 10 }}
        indicator={Progress.Circle}
        indicatorProps={{
          size: 50,
          borderWidth: 0,
          color: 'rgba(0, 0, 0, 1)',
        }}
      />
    </View>
    <View style={styles.TrackInfo}>
      <TextTicker
        style={styles.TrackTitle}
        loop
        bounce
        repeatSpacer={50}
        marqueeDelay={1000}
      >
        {props.navigation.state.params.trackInfo.title}
      </TextTicker>
      <MText style={styles.TrackArtist}>{props.navigation.state.params.trackInfo.artists}</MText>
      <MText>{props.navigation.state.params.trackInfo.release_date}</MText>
    </View>
  </View>
);

const styles = {
  container: {
    height: 134,
    width: '100%',
    backgroundColor: '#ffcb08',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  TrackImage: {
    width: 100,
    height: 100,
  },
  TrackInfo: {
    paddingLeft: 15,
  },
  TrackTitle: {
    fontFamily: 'IRANSansMobile',
    fontSize: 17,
    color: '#000',
  },
  TrackArtist: {
    fontSize: 15,
    color: '#606060',
  },
};

export default withNavigation(RecorderResultViewHeader);
