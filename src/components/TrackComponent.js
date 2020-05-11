import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  /*TouchableNativeFeedback,*/TouchableHighlight,TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  LayoutAnimation,
} from 'react-native';
import * as Progress from 'react-native-progress';
import RNFetchBlob from 'react-native-fetch-blob';
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

class TrackComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCurrentlyPlayingTrack: (this.props.currentlyPlaying !== null && this.props.data.id === this.props.currentlyPlaying.id),
      isDownloading: false,
      downloadPercentage: 0,
      downloadCanceled: false,
      task: null,
      errorMessage: '',
    };
  }

  // lifecycle method
  componentWillReceiveProps(nextProps) {
    // if currently playing track changed
    if (nextProps.currentlyPlaying !== this.props.currentlyPlaying) {
      // prepare layout animation
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  // set currently track
  setCurrrentlyTrack = () => {
    // if it's not downloaded and app is offline
    if (this.props.data.pathToFile === null && !this.props.isConnected) {
      // set proper error message
      this.setState({
        errorMessage: 'عدم دسترسی به شبکه',
      });
      // show error modal
      this.showErrorModal();
    } else {
      // set this track as currently playing track
      this.props.setCurrentlyPlayingTrack(this.props.data);
    }
  }

  // remove from playlist
  delete = () => {
    // remove the actual file from storage
    RNFetchBlob.fs
      .unlink(`${RNFetchBlob.fs.dirs.DocumentDir}/playlist/${this.props.data.title}.mp3`)
      .then(() => {
        // remove from DB
        this.props.removeFromPlaylist(this.props.data.id);
        // if this track is currently playing, remove it from player too
        if (this.props.data.id === this.props.currentlyPlaying.id) {
          this.props.setCurrentlyPlayingTrack(null);
        }
        // close action modal
        this.hideActionModal();
      })
      .catch((err) => {
        // close action modal
        this.hideActionModal();
        // set proper error message
        this.setState({
          errorMessage: 'خطا در حذف، دوباره تلاش کنید',
        });
        // show error modal
        this.showErrorModal();
      });
  }

  // download to local storage
  download = () => {
    // close action menu
    this.hideActionModal();

    // if app is offline
    if (!this.props.isConnected) {
      // set proper error message
      this.setState({
        errorMessage: 'عدم دسترسی به شبکه',
      });
      // show error modal
      this.showErrorModal();
    } else {
      // update UI and set cancel flag to false
      this.setState({
        isDownloading: true,
        downloadCanceled: false,
      });

      // local storage path
      const dirs = RNFetchBlob.fs.dirs;

      // start download
      const task = RNFetchBlob
        .config({
          path: `${dirs.DocumentDir}/playlist/${this.props.data.title}.mp3`,
        })
        .fetch('GET', this.props.data.uri);

      // set task
      this.setState({ task });

      // download progress event handler
      task.progress((received, total) => {
        // download progress percent
        const percent = (received / total);
        this.setState({
          downloadPercentage: percent,
        });
      })
        .then((res) => {
          // downloaded sucessfully
          this.setState({
            isDownloading: false,
          });
          // dispatch action
          this.props.updateDownloadedTrack(this.props.data.id, res.path());
        })
        .catch((err) => {
          // check if cancelled
          if (this.state.downloadCanceled) {
            // update UI
            this.setState({
              isDownloading: false,
              downloadPercentage: 0,
            });
            // delete partially downloaded file from storage

            RNFetchBlob.fs.unlink(`${RNFetchBlob.fs.dirs.DocumentDir}/playlist/${this.props.data.title}.mp3`);
          } else {
            // set state and error message
            this.setState({
              isDownloading: false,
              downloadPercentage: 0,
              errorMessage: 'خطا در دریافت فایل، دوباره تلاش کنید',
            });
            // show error modal
            this.showErrorModal();
            // delete partially downloaded file from storage
            RNFetchBlob.fs.unlink(`${dirs.DocumentDir}/playlist/${this.props.data.title}.mp3`);
          }
        });
    }
  }

  // cancel download operation
  cancelDownload = () => {

    // set the cancel flag
    this.setState({
      downloadCanceled: true,
    });
    // cancel download task
    this.state.task.cancel();
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

  // show actions modal
  showActionModal = () => {
    this.actionModal.open();
  };

  // hide actions modal
  hideActionModal = () => {
    this.actionModal.close();
  };

  // show error modal
  showErrorModal = () => {
    this.errorModal.open();
  };

  render() {
    // if this track was downloaded before
    const isDownloaded = (this.props.data.pathToFile !== null);

    // if track is buffering and this track is the currentlyPlaying
    const showLoading = (this.props.isBuffering && this.state.isCurrentlyPlayingTrack);

    // download indicator
     const DownloadIndicator = (
      <View style={styles.downloadProgress}>
     <Progress.Pie
          progress={this.state.downloadPercentage}
          indeterminate={(this.state.downloadPercentage === 0)}
          size={40}
          strokeCap="round"
          color="rgba(255, 203, 8, 1)"
          borderColor="rgba(255, 203, 8, 0.5)"
     />
      </View>
     );

    // track button image, based on different conditions
    let TrackButtonImage;
    if (!this.state.isCurrentlyPlayingTrack) {
      if (!isDownloaded) {
        TrackButtonImage = require('../assets/img/play-button-gray.png');
      } else {
        TrackButtonImage = require('../assets/img/play-button.png');
      }
    } else if (this.props.isPlaying) {
      if (!isDownloaded) {
        TrackButtonImage = require('../assets/img/pause-button-gray.png');
      } else {
        TrackButtonImage = require('../assets/img/pause-button.png');
      }
    } else if (!isDownloaded) {
      TrackButtonImage = require('../assets/img/play-button-gray.png');
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

    // status indicator
    const StatusIndicator = (
      (this.state.isDownloading) ? DownloadIndicator : TrackButton
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

    // loading indicator
    const LoadingIndicator = (
      <View style={styles.loading}>
        {(showLoading) ? (<ActivityIndicator size="small" color="#c7c7c7" />) : (<View />)}
      </View>
    );

    // action button
    const ActionButton = (this.state.isDownloading)
      ? (
        <TouchableWithoutFeedback
          /*background={TouchableHighlight.Ripple('#dddddd', true)}*/
            style={{backgroundColor:'#dddddd'}}
          onPress={() => this.cancelDownload()}
        >
          <View style={styles.actionButton}>
            <Image
              source={require('../assets/img/cancel-icon.png')}
              style={styles.actionButtonIcon}
            />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback
            /*background={TouchableHighlight.Ripple('#dddddd', true)}*/
            style={{backgroundColor:'transparent'}}
          onPress={() => this.showActionModal()}
        >
          <View style={styles.actionButton}>
            <Image
              source={require('../assets/img/more-icon.png')}
              style={styles.actionButtonIcon}
            />
          </View>
        </TouchableWithoutFeedback>
      );

    // action modal
    const ActionModal = (
      <Modal
        style={[styles.actionModal, { height: (this.props.data.pathToFile === null) ? 120 : 60 }]}
        swipeToClose
        backButtonClose
        position="center"
        ref={(actionModal) => { this.actionModal = actionModal; }}
        coverScreen
        animationDuration={200}
      >
        <View style={styles.actionModalContent}>
          {(this.props.data.pathToFile === null)
            ? (
              <TouchableWithoutFeedback
                  /*background={TouchableHighlight.Ripple('#dddddd', false)}*/
                  style={{backgroundColor:'#dddddd'}}
                onPress={() => this.download()}
              >
                <View style={styles.actionModalButton}>
                  <Image
                    source={require('../assets/img/download-icon.png')}
                    style={styles.actionModalButtonIcon}
                  />
                  <MText style={styles.actionModalButtonText}>دانلود</MText>
                </View>
              </TouchableWithoutFeedback>
            ) : null}
          <TouchableWithoutFeedback
              /*background={TouchableHighlight.Ripple('#dddddd', false)}*/
              style={{backgroundColor:'#dddddd'}}
            onPress={() => this.delete()}
          >
            <View style={[styles.actionModalButton, { borderBottomWidth: 1, borderColor: '#c7c7c7' }]}>
              <Image
                source={require('../assets/img/remove-icon.png')}
                style={styles.actionModalButtonIcon}
              />
              <MText style={styles.actionModalButtonText}>حذف</MText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
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
        {StatusIndicator}

        {TrackTitle}

        {LoadingIndicator}

        {ActionButton}

        {ActionModal}

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
    /*fontFamily: 'IRANYekanBold',*/
  },
  trackTitle: {
    fontSize: 16,
    color: '#000',
    flex: 1,
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
  downloadProgress: {
    width: 40,
    height: 40,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionModal: {
    width: '70%',
  },
  actionModalContent: {

  },
  actionModalButton: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  actionModalButtonIcon: {
    width: 25,
    height: 25,
  },
  actionModalButtonText: {
    color: '#000',
    fontSize: 18,
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

export default TrackComponent;
