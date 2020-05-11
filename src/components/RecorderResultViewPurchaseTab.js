import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { MText } from './shared/MText';

class RecorderResultViewPurchaseTab extends Component {
  constructor(props) {
    super(props);

    // extract links
    const {
      apple_music,
      soundcloud,
      spotify,
      youtube,
    } = this.props.screenProps.shoppingLinks;

    this.apple_music = apple_music;
    this.soundcloud = soundcloud;
    this.spotify = spotify;
    this.youtube = youtube;
  }

  render() {
    // define each component
    const Apple_music = (this.apple_music == null) ? (
      null
    ) : (

      <TouchableOpacity
        onPress={() => Linking.openURL(this.apple_music)}
        style={styles.purchaseLink}
        activeOpacity={0.8}
      >

        <MText style={styles.purchaseLinkText}>خرید موزیک در iTunes</MText>
          <Image style={styles.purchaseLinkIcon} source={require('../assets/img/itunes.png')} />

      </TouchableOpacity>


    );

    const SoundCloud = (this.soundcloud == null) ? (
      null
    ) : (

      <TouchableOpacity
        onPress={() => Linking.openURL(this.soundcloud)}
        style={styles.purchaseLink}
        activeOpacity={0.8}
      >

        <MText style={styles.purchaseLinkText}>خرید موزیک در SoundCloud</MText>
          <Image style={styles.purchaseLinkIcon} source={require('../assets/img/soundcloud.png')} />

      </TouchableOpacity>

    );

    const Spotify = (this.spotify == null) ? (
      null
    ) : (

      <TouchableOpacity
        onPress={() => Linking.openURL(this.spotify)}
        style={styles.purchaseLink}
        activeOpacity={0.8}
      >
        <MText style={styles.purchaseLinkText}>خرید موزیک در Spotify</MText>
          <Image style={styles.purchaseLinkIcon} source={require('../assets/img/spotify.png')} />
      </TouchableOpacity>


    );

    const Youtube = (this.youtube == null) ? (
      null
    ) : (

      <TouchableOpacity
        onPress={() => Linking.openURL(this.youtube)}
        style={styles.purchaseLink}
        activeOpacity={0.8}
      >
        <MText style={styles.purchaseLinkText}>مشاهده در YouTube</MText>
          <Image style={styles.purchaseLinkIcon} source={require('../assets/img/youtube.png')} />

      </TouchableOpacity>


    );

    // if all links are empty
    if (!this.apple_music && !this.soundcloud && !this.spotify && !this.youtube) {
      return (
        <View style={styles.noResultContainer}>
          <MText style={styles.noResult}>هیچ لینک خریدی پیدا نشد!</MText>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {Apple_music}
        {SoundCloud}
        {Spotify}
        {Youtube}
      </View>
    );
  }
}

const styles = {
  noResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResult: {
    fontSize: 15,
  },
  container: {
    padding: 30,
  },
  purchaseLink: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },
  purchaseLinkIcon: {
    width: 50,
    height: 50,
  },
  purchaseLinkText: {
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
};

export default RecorderResultViewPurchaseTab;
