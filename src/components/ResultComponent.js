import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  /*TouchableNativeFeedback,*/
  TouchableHighlight,TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  LayoutAnimation,
} from 'react-native';
import Modal from 'react-native-modalbox';
import MusicControl from 'react-native-music-control';
import TextTicker from 'react-native-text-ticker';
import { MText } from './shared/MText';

// LayoutAnimation custom transition
const CustomLayoutAnimation = { // need testing on actual device
  duration: 300,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

class ResultComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addedToPlaylist: (this.props.playlist.filter(track => (track.id === this.props.data.id)).length > 0),
      isCurrentlyPlayingTrack: (this.props.currentlyPlaying !== null && this.props.data.id === this.props.currentlyPlaying.id),
      errorMessage: '',
    };
  }

  // lifecycle method
  componentWillReceiveProps(nextProps) {
    // if currently playing track changed
    if (nextProps.currentlyPlaying !== this.props.currentlyPlaying) {
      // prepare layout animation
      LayoutAnimation.configureNext(CustomLayoutAnimation);
      // check if this is the currently playing track
      if (nextProps.currentlyPlaying !== null && this.props.data.id === nextProps.currentlyPlaying.id) {
        // change state
        this.setState({
          isCurrentlyPlayingTrack: true,
        });
      } else {
        // change state
        this.setState({
          isCurrentlyPlayingTrack: false,
        });
      }
    }
  }

  // setCurrrentlyTrack
  setCurrrentlyTrack = () => {
    // if app is offline
    if (!this.props.isConnected) {
      // set proper error message
      this.setState({
        errorMessage: 'عدم دسترسی به شبکه',
      });
      // show error modal
      this.showErrorModal();
    } else {
      // else, set currently playing track
      this.props.setCurrentlyPlayingTrack(this.props.data);
    }
  }

  // play
  play = () => {
    // dispatch action
    this.props.play();
    // update music control state
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PLAYING,
    });
  }

  // pause
  pause = () => {
    // dispatch action
    this.props.pause();
    // update music control state
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PAUSED,
    });
  }

  // add to playlist
  addToPlaylist = () => {
    // dispatch action
    this.props.addToPlaylist(this.props.data);
    // set ui
    this.setState({
      addedToPlaylist: true,
    });
  }

  // show error modal
  showErrorModal = () => {
    this.errorModal.open();
  };

  render() {
    // if track is buffering and this track is the currentlyPlaying
    const showLoading = (
      this.props.isBuffering && this.state.isCurrentlyPlayingTrack
    );

    // loading indicator
    const LoadingIndicator = (
      <View style={styles.loading}>
        {(showLoading) ? (<ActivityIndicator size="small" color="#c7c7c7" />) : (<View />)}
      </View>
    );

    // track button image, based on different conditions
    let TrackButtonImage;
    if (!this.state.isCurrentlyPlayingTrack) {
      TrackButtonImage = require('../assets/img/play-button.png');
    } else if (this.props.isPlaying) {
      TrackButtonImage = require('../assets/img/pause-button.png');
    } else {
      TrackButtonImage = require('../assets/img/play-button.png');
    }

    // track button
    const TrackButton = (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (this.state.isCurrentlyPlayingTrack && this.props.isPlaying) {
            this.pause();
          } else if (this.state.isCurrentlyPlayingTrack && !this.props.isPlaying) {
            this.play();
          } else {
            this.setCurrrentlyTrack();
          }
        }}
      >
        <Image
          source={TrackButtonImage}
          style={styles.trackButton}
        />
      </TouchableOpacity>
    );

    // action button
    const ActionButton = (this.state.addedToPlaylist) ? (
      <View style={styles.actionButton}>
        <Image
          source={require('../assets/img/check-square-icon.png')}
          style={styles.actionButtonIcon}
        />
      </View>
    ) : (
      <TouchableWithoutFeedback
        /*background={TouchableHighlight.Ripple('#c7c7c7', true)}*/
          style={{backgroundColor:'transparent'}}
        onPress={this.addToPlaylist}
      >
        <View style={styles.actionButton}>
          <Image
            source={require('../assets/img/add-icon.png')}
            style={styles.actionButtonIcon}
          />
        </View>
      </TouchableWithoutFeedback>
    );

    // track title
    const TrackTitle = (this.state.isCurrentlyPlayingTrack)
      ? (
        <View style={styles.trackTitleContainer}>
          <TextTicker
            style={styles.trackTitleMarquee}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}
            useNativeDriver
          >
            {this.props.data.title}
          </TextTicker>
        </View>
      ) : (
        <MText
          style={styles.trackTitle}
          numberOfLines={1}
        >
          {this.props.data.title}
        </MText>
      );

    // error modal
    const ErrorModal = (
      <Modal
        style={styles.errorModal}
        swipeToClose
        backButtonClose
        position="center"
        ref={(errorModal) => { this.errorModal = errorModal; }}
        coverScreen
        animationDuration={200}
      >
        <View style={styles.errorModalContent}>
          <MText style={styles.errorModalText}>{this.state.errorMessage}</MText>
        </View>
      </Modal>);

    return (
      <View style={styles.track}>
        {TrackButton}

        {TrackTitle}

        {LoadingIndicator}

        {ActionButton}

        {ErrorModal}
      </View>
    );
  }
}

const styles = {
  track: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  trackButton: {
    width: 40,
    height: 40,
    marginHorizontal: 15,
  },
  trackTitleContainer: {
    flex: 1,
  },
  trackTitleMarquee: {
    fontSize: 16,
    color: '#000',
   fontFamily: 'IRANSansMobile',
  },
  trackTitle: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  trackTime: {
    position: 'absolute',
    left: 70,
    top: 33,
  },
  actionButton: {
    marginHorizontal: 15,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonIcon: {
    width: 20,
    height: 20,
  },
  errorModal: {
    width: '70%',
    height: 70,
    borderRadius: 20,
  },
  errorModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorModalText: {
    color: 'red',
    fontSize: 18,
  },
};

export default ResultComponent;
