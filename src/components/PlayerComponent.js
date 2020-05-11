import React, { Component } from 'react';
import {
  View,
  /*TouchableNativeFeedback,*/TouchableHighlight,TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import Slider from 'react-native-slider';
import Video from 'react-native-video';
import TextTicker from 'react-native-text-ticker';
import MusicControl from 'react-native-music-control';
import Modal from 'react-native-modalbox';
import { MText, MTextBold } from './shared/MText';
// device dimensions
const window = Dimensions.get('window');

class PlayerComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: 0,
      currentTime: 0,
      dragging: false,
      repeat: false,
      shuffle: false,
      controlsDisabled: false,
      errorMessage: '',
    };

    // currently playing track
    this.track = this.props.currentlyPlaying;
    // index of currently playing track in playlist
    this.index = -1;

    // spring value for buttons animation
    this.springValue = new Animated.Value(1);

    // config music control
    this.musicControlConfig();
  }

  // lifecycle method
  componentWillReceiveProps(nextProps) {
    // new track received?
    const trackDidChange = (nextProps.currentlyPlaying !== this.props.currentlyPlaying);
    // if playlist is retrieved from DB (takes some time)
    const playlistIsRetrieved = (nextProps.playlist.length !== 0);
    // app goes offline and it's a streaming track
    if (this.track !== null && !nextProps.isConnected && this.isTrackStreaming()) {
      this.pause();
    }

    if (playlistIsRetrieved && this.track !== null) {
      // update index of currently playing track in playlist
      this.index = this.props.playlist.findIndex(track => track.id === this.track.id);

      // analyze the track index for prev next buttons
      this.controlsStatus();
    }

    if (trackDidChange) {
      // if the currently playing track was deleted
      if (nextProps.currentlyPlaying === null) {
        // set this track to null
        this.track = null;
        // kill music control
        MusicControl.stopControl();
      } else {
        // if already there is a track
        if (this.track !== null) {
          // stop player
          this.stop();
        }
        // get the new track
        this.track = nextProps.currentlyPlaying;
        // update index of currently playing track in playlist
        this.index = this.props.playlist.findIndex(track => track.id === this.track.id);
        // analyze the track index for prev next buttons
        this.controlsStatus();
        // init music control
        this.musicControlInit();
        // play it
        this.play();
      }
    }
  }

  // lifecycle method
  componentWillUnmount() {
    // stop
    this.stop();
    // kill music control
    MusicControl.stopControl();
  }

  // music control configurations
  musicControlConfig() {
    MusicControl.enableBackgroundMode(true);
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('stop', false);
    MusicControl.enableControl('seek', false);
    MusicControl.enableControl('closeNotification', true, { when: 'paused' });
    MusicControl.on('closeNotification', () => { this.stop(); });
    MusicControl.on('play', () => { this.play(); });
    MusicControl.on('pause', () => { this.pause(); });
    MusicControl.on('nextTrack', () => { this.next(); });
    MusicControl.on('previousTrack', () => { this.prev(); });
  }

  // music control init
  musicControlInit() {
    MusicControl.setNowPlaying({
      title: this.track.title,
      artwork: this.track.header_image_url || require('../assets/img/logo.png'),
      artist: this.track.artists,
      date: this.track.release_date,
      duration: this.state.duration,
      color: 0xffcb08,
      notificationIcon: 'notification_icon',
    });
  }

  // is track streaming?
  isTrackStreaming = () => {


    return this.track.pathToFile === null || this.track.pathToFile === undefined
      }


  // on media load start
  onLoadStart = () => {
    this.props.setBufferingStatus(true);
  }

  // on media load finish
  onLoad = (data) => {
    // set track duration
    this.setState({
      duration: data.duration,
    });
    // set buffering status to false
    this.props.setBufferingStatus(false);

  };

  // update current time
  onProgress = (data) => {
    // if not dragging slider
    if (!this.state.dragging) {
      this.setState({ currentTime: data.currentTime });
    }
  }

  // on slider drag start
  onSlidingStart = () => {
    this.setState({ dragging: true });
  }

  // on slider change
  onValueChange(percentage) {
    // calculate seek percentage
    const newPosition = percentage * this.state.duration;
    this.setState({ currentTime: newPosition });
  }

  // on sliding complete
  onSlidingComplete = () => {
    // seek player
    this.player.seek(this.state.currentTime);
    // set dragging flag to false, after a short delay (for the glitch)
    setTimeout(() => { this.setState({ dragging: false }); }, 70);
  }

  // on end
  onEnd = () => {
    // if repeat is off
    if (!this.state.repeat) {
      this.next();
    }
  }

  // play
  play = () => {
    // if track is streaming and app is offline
    if (!this.props.isConnected && this.isTrackStreaming()) {
      // set proper error message
      this.setState({
        errorMessage: 'عدم دسترسی به شبکه',
      });
      // show error modal
      this.showErrorModal();
    } else {
      // animate button
      this.onButtonPressAnimation();
      // action
       // console.log('props:',this.props)
      this.props.play();

      // update music control state
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PLAYING,
        elapsedTime: this.state.currentTime,
      });
    }
  }

  // pause
  pause = () => {
    // animate button
    this.onButtonPressAnimation();
    // action
    this.props.pause();
    // update music control state
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PAUSED,
      elapsedTime: this.state.currentTime,
    });
  }

  // stop
  stop() {
    // seek to beginning
    this.player.seek(0);
    // set current time
    this.setState({
      currentTime: 0,
    });
    // update music control state
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PAUSED,
      elapsedTime: 0,
    });
    // stop playing
    this.pause();
  }

  // next
  next = () => {
    // if shuffle is off
    if (!this.state.shuffle) {
      // if next is possible
      if ((this.index + 1) < this.props.playlist.length) {
        // normal next
        this.props.setCurrentlyPlayingTrack(this.props.playlist[this.index + 1]);
      } else {
        // it's the last track in playlist, stop
        this.stop();
      }
    } else {
      // shuffle is on
      this.shuffle();
    }
  }

  // prev
  prev = () => {
    // if current time is less than 5 seconds
    if (this.state.currentTime < 5) {
      // if shuffle is off
      if (!this.state.shuffle) {
        // if next is possible
        if ((this.index - 1) >= 0) {
          // normal prev
          this.props.setCurrentlyPlayingTrack(this.props.playlist[this.index - 1]);
        } else {
          // it's the first track, seek to beginning
          this.player.seek(0);
          // set current time
          this.setState({
            currentTime: 0,
          });
          // update music control state
          MusicControl.updatePlayback({
            state: MusicControl.STATE_PAUSED,
            elapsedTime: 0,
          });
        }
      } else {
        // shuffle is on
        this.shuffle();
      }
    } else {
      // seek to beginning
      this.player.seek(0);
      // set current time
      this.setState({
        currentTime: 0,
      });
      // update music control state
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PAUSED,
        elapsedTime: 0,
      });
    }
  }

  // control buttons status
  controlsStatus = () => {
    // if currently playing track is not in the playlist (it's a result track)
    if (this.index === -1) {
      // disable controls
      this.setState({
        controlsDisabled: true,
      });
      MusicControl.enableControl('nextTrack', false);
      MusicControl.enableControl('previousTrack', false);
    } else {
      // enable controls
      this.setState({
        controlsDisabled: false,
      });
      MusicControl.enableControl('nextTrack', true);
      MusicControl.enableControl('previousTrack', true);
    }
  }

  // shuffle
  shuffle = () => {
    // random number between 0 and playlist length
    const randIndex = Math.floor(Math.random() * Math.floor(this.props.playlist.length));
    // set next track based on this random index
    this.props.setCurrentlyPlayingTrack(this.props.playlist[randIndex]);
  }

  // toggle shuffle
  toggleShuffle = () => {
    this.setState({
      shuffle: !this.state.shuffle,
    });
  }

  // toggle repeat
  toggleRepeat = () => {
    this.setState({
      repeat: !this.state.repeat,
    });
  }

  // on button press animation
  onButtonPressAnimation = () => {
    this.springValue.setValue(1.03);
    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 1,
        useNativeDriver: true,
      },
    ).start();
  }

  // pretty print time
  secondsToMinutesAndSeconds = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = ((totalSeconds % 60)).toFixed(0);
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
  }

  // show error modal
  showErrorModal = () => {
    this.errorModal.open();
  };

  render() {
    // if current track is null
    const EmptyPlayer = (
      <View style={styles.emptyContainer}>
      


       <TouchableWithoutFeedback
          style={{backgroundColor:'transparent'}}
        onPress={() => this.props.hidePlayer()}
       >
        <View style={styles.hidePlayerButton}>
          <Image
            source={require('../assets/img/up-icon.png')}
            style={styles.hidePlayerButtonIcon}
          />
        </View>
      </TouchableWithoutFeedback>




      
        <MText style={{ color: '#2b2d32' }}>موزیکی در پلیر نیست</MText>
      </View>
    );

    // play pause button
    const PlayPauseButton = (
      <TouchableWithoutFeedback
        /*background={TouchableHighlight.Ripple('#c7c7c7', true)}*/
          style={{backgroundColor:'transparent'}}
        onPress={() => { if (this.props.isPlaying) { this.pause(); } else { this.play(); } }}
      >
        <View style={[styles.playerButton, styles.playerButtonBig]}>
          <Animated.Image
            source={(this.props.isPlaying)
              ? require('../assets/img/pause-icon.png')
              : require('../assets/img/play-icon.png')}
            style={[styles.playerButtonBigIcon, { transform: [{ scale: this.springValue }] }]}
          />
        </View>
      </TouchableWithoutFeedback>
    );

    // next button
    const NextButton = (
      <TouchableWithoutFeedback
          /*background={TouchableHighlight.Ripple('#c7c7c7', true)}*/
          style={{backgroundColor:'transparent'}}
        onPress={this.next}
        disabled={this.state.controlsDisabled}
      >
        <View style={[styles.playerButton, styles.playerButtonSmall]}>
          <Image
            source={require('../assets/img/next-icon.png')}
            style={[styles.playerButtonSmallIcon, { opacity: (this.state.controlsDisabled) ? 0.3 : 1 }]}
          />
        </View>
      </TouchableWithoutFeedback>
    );

    // prev button
    const PrevButton = (
      <TouchableWithoutFeedback
          /*background={TouchableHighlight.Ripple('#c7c7c7', true)}*/
          style={{backgroundColor:'transparent'}}
        onPress={this.prev}
        disabled={this.state.controlsDisabled}
      >
        <View style={[styles.playerButton, styles.playerButtonSmall]}>
          <Image
            source={require('../assets/img/prev-icon.png')}
            style={[styles.playerButtonSmallIcon, { opacity: (this.state.controlsDisabled) ? 0.3 : 1 }]}
          />
        </View>
      </TouchableWithoutFeedback>
    );

    // shuffle button
    const ShuffleButton = (this.state.controlsDisabled) ? (
      <View style={[styles.playerButton, styles.playerButtonSmall]}>
        <Image
          source={require('../assets/img/shuffle-icon.png')}
          style={[styles.playerButtonSmallIcon, { opacity: 0.3 }]}
        />
      </View>
    ) : (
      <TouchableWithoutFeedback
          /*background={TouchableHighlight.Ripple('#c7c7c7', true)}*/
          style={{backgroundColor:'transparent'}}
        onPress={() => this.toggleShuffle()}
      >
        <View style={[styles.playerButton, styles.playerButtonSmall]}>
          <Image
            source={require('../assets/img/shuffle-icon.png')}
            style={[styles.playerButtonSmallIcon, { opacity: (this.state.shuffle) ? 1.0 : 0.3 }]}
          />
        </View>
      </TouchableWithoutFeedback>
    );

    // repeat button
    const RepeatButton = (
      <TouchableWithoutFeedback
          /*background={TouchableHighlight.Ripple('#c7c7c7', true)}*/
          style={{backgroundColor:'transparent'}}
        onPress={() => this.toggleRepeat()}
      >
        <View style={[styles.playerButton, styles.playerButtonSmall]}>
          <Image
            source={require('../assets/img/repeat-icon.png')}
            style={[styles.playerButtonSmallIcon, { opacity: (this.state.repeat) ? 1.0 : 0.3 }]}
          />
        </View>
      </TouchableWithoutFeedback>
    );

    // hide player button
    const HidePlayerButton = (
      <TouchableWithoutFeedback
          /*background={TouchableHighlight.Ripple('#c7c7c7', true)}*/
          style={{backgroundColor:'transparent'}}
        onPress={() => this.props.hidePlayer()}
      >
        <View style={styles.hidePlayerButton}>
          <Image
            source={require('../assets/img/up-icon.png')}
            style={styles.hidePlayerButtonIcon}
          />
        </View>
      </TouchableWithoutFeedback>
    );

    // loading indicator
    const LoadingIndicator = (
      <View style={styles.loading}>
        {(this.props.isBuffering) ? (<ActivityIndicator size="small" color="#000" />) : (<View />)}
      </View>
    );

    // player header message
    const PlayerMessage = (
      <View style={styles.playerMessage}>
        <MTextBold style={styles.playerMessageText}>
          {(this.props.isBuffering) ? 'در حال بارگذاری' : 'در حال پخش'}
        </MTextBold>
      </View>
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
      </Modal>
    );

    // song progress percentage
    let songPercentage;
    if (this.state.duration !== 0) {
      songPercentage = this.state.currentTime / this.state.duration;
    } else {
      songPercentage = 0;
    }


    return (

      (this.track === null)
        ? (EmptyPlayer)
        : (
          <View style={styles.container}>
            <View style={styles.header}>
              {HidePlayerButton}
              {PlayerMessage}
              {LoadingIndicator}
            </View>
            <View style={styles.wrapper}>
              <View style={styles.trackImageContainer}>
                <View style={styles.trackImageShadow}>
                  <Image resizeMode="contain" source={{ uri: this.track.header_image_url }} style={styles.trackImage} />
                </View>
              </View>
              <View style={styles.trackPlayerContainer}>
                <View style={styles.trackInfo}>
                  <MText style={styles.trackArtist}>
                    {this.track.artists}
                  </MText>
                  <TextTicker
                    style={styles.trackTitle}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                    useNativeDriver
                  >
                    {this.track.title}
                  </TextTicker>
                </View>
                <View>

                  <Video
                    source={{ uri: (this.track.pathToFile === null || this.track.pathToFile === undefined) ? this.track.uri : this.track.pathToFile }}
                    ref={(ref) => { this.player = ref; }}
                    volume={1.0}
                    muted={false}
                    paused={!this.props.isPlaying}
                    playInBackground
                    playWhenInactive
                    resizeMode="cover"
                    repeat={this.state.repeat}
                    onLoadStart={this.onLoadStart}
                    onLoad={this.onLoad}
                    onBuffer={this.onBuffer}
                    onProgress={this.onProgress}
                    onEnd={this.onEnd}
                    onAudioBecomingNoisy={this.pause}
                  />

                </View>
                <View style={styles.seek}>
                  <Slider
                    style={styles.slider}
                    step={0.0001}
                    disabled={this.props.isBuffering}
                    onSlidingStart={() => this.onSlidingStart()}
                    onValueChange={percentage => this.onValueChange(percentage)}
                    onSlidingComplete={() => this.onSlidingComplete()}
                    value={songPercentage}
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    minimumTrackTintColor="#2b2d32"
                  />
                </View>
                <View style={styles.playTime}>
                  <MText style={styles.playTimeText}>
                    {this.secondsToMinutesAndSeconds(this.state.currentTime)}
                  </MText>
                  <MText style={styles.playTimeText}>
                    {this.secondsToMinutesAndSeconds(this.state.duration)}
                  </MText>
                </View>
                <View style={styles.playerButtons}>
                  {ShuffleButton}
                  {PrevButton}
                  {PlayPauseButton}
                  {NextButton}
                  {RepeatButton}
                </View>
              </View>
              {ErrorModal}
            </View>
          </View>
        )
    );
  }
}

const styles = {
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 56,
    width: '100%',
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hidePlayerButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidePlayerButtonIcon: {
    width: 20,
    height: 20,
  },
  loading: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerMessage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerMessageText: {
    fontSize: 18,
    color: '#000',
  },
  trackImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  trackImageShadow: {
    // borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 30,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 1.0,
  },
  trackImage: {
    width: window.width - 150,
    height: window.width - 150,
  },
  trackPlayerContainer: {
    // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  trackArtist: {
    fontSize: 15,
    color: '#202020',
  },
  trackTitle: {
    fontSize: 17,
    color: '#000',
    fontFamily: 'IRANSansMobile',
    marginHorizontal: 20,
      fontWeight:'bold',
  },
  seek: {
    width: '100%',
    alignItems: 'center',
  },
  slider: {
    width: window.width - 40,
    height: 20,
  },
  track: {
    height: 2,
    borderRadius: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    backgroundColor: '#ffcb08',
    borderColor: '#2b2d32',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    elevation: 3,
  },
  playTime: {
    width: window.width - 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playTimeText: {
    color: '#000',
    fontSize: 13,
  },
  playerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  playerButton: {
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerButtonSmall: {
    width: 35,
    height: 35,
  },
  playerButtonBig: {
    width: 55,
    height: 55,
    marginHorizontal: 15,
  },
  playerButtonSmallIcon: {
    width: 25,
    height: 25,
  },
  playerButtonBigIcon: {
    width: 45,
    height: 45,
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

export default PlayerComponent;
