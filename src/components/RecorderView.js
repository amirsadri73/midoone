import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    Image,
    TouchableWithoutFeedback,
    Vibration,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';

import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import PropTypes from 'prop-types';
import RNFetchBlob from 'react-native-fetch-blob';
import Modal from 'react-native-modalbox';
import TouchableDebounce from './shared/TouchableDebounce';
import PulseLoader from './shared/PulseLoader';
import { MText, MTextBold } from './shared/MText';
import HeaderRight from './shared/HeaderRight';

// device width
const DeviceWidth = Dimensions.get('window').width;

class RecorderView extends Component {
// Navigation Props
    static navigationOptions = ({ navigation }) => ({
        title: 'جستجو',
        headerTitleStyle: {
            fontWeight: 'normal',
            fontFamily: 'IRANSansMobile',
            textAlign: 'center',
            alignSelf: 'center',
            flex: 1,
        },
        headerLeft: (
            <TouchableOpacity
               // background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.4)', true)}
                onPress={() => this.goToHistory()}
            >
                <View style={{ borderRadius: 10 }}>
                    <Image
                        source={require('../assets/img/history-icon.png')}
                        style={{ width: 20, height: 20, margin: 16 }}
                    />
                </View>
            </TouchableOpacity>
        ),
        headerRight: <HeaderRight navigation={navigation} />,
    })



    constructor(props) {
        super(props);
        this.state = {
            audioPath: AudioUtils.DocumentDirectoryPath + '/record.ima4',
            infoMessage: 'برای شروع این دکمه را لمس کنید',
            recorderMessage: '',
            uploadTask: null,
            lastRecord: false,
            currentTime: 0.0,
            recording: false,
            paused: false,
            stoppedRecording: false,
            finished: false,
            hasPermission: undefined,
        };

        // pass required methods to navigation params
        this.props.navigation.setParams({
            showPlayer: this.props.showPlayer,
            goToHistory: this.goToHistory,
        });
        // go to history view
        goToHistory = () => {
            this.props.navigation.navigate('HistoryView');
        }


        // recorder timer
        this.recorderTimer = null;

        // recorder itself
        this.recorder = null;


        // record mode rotate animation value
        this.animationSpinValue = new Animated.Value(0);

        // recorder timer animation
        this.recorderTimerValue = new Animated.Value(0);



    }

    prepareRecordingPath (audioPath) {
        AudioRecorder.prepareRecordingAtPath(this.state.audioPath, {
            SampleRate: 44100.0,
            Channels: 2,
            AudioQuality: 'High',
            AudioEncoding: 'ima4',
            OutputFormat: 'mpeg_4',
            MeteringEnabled: false,
            MeasurementMode: false,
            AudioEncodingBitRate: 256000,
            IncludeBase64: false
        });

    }


    componentDidMount() {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({ hasPermission: isAuthorised });

            if (!isAuthorised) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };
        });


    }




    // start mode
    startMessage() {
        this.setState({
            infoMessage: 'برای شروع این دکمه را لمس کنید',
        });
    }

    // record mode
    recordMessage() {
        this.setState({
            recorderMessage: 'در حال ضبط',
        });
    }

    // upload mode
    uploadMessage() {
        this.setState({
            recorderMessage: 'در حال جستجو',
        });
    }

    // no result mode
    noResultMessage() {
        this.setState({
            infoMessage: 'موردی یافت نشد',
        });
    }

    // offline mode
    offlineMessage() {
        this.setState({
            infoMessage: 'عدم دسترسی به شبکه',
        });
    }
    // error mode
    errorMessage(errOrigin, err) {
        const message = `${errOrigin} : ${err}`;

        this.setState({
            infoMessage: message,
        });
    }




    componentWillMount(){
        this.prepareRecordingPath ()


        this.stopTimer()
    }

    stopTimer() {
        clearTimeout(this.recorderTimer);
    }
    startTimer() {
        // 10 seconds timer, then stop recorder
        this.recorderTimer = setTimeout(() => { this._stop(); }, 10000);
    }
    // on modal open event handler
    onModalOpen = () => {
        this._record();
    }
    // on modal close event handler
    onModalClose = () => {
        // was it recording?
        // if (this.recorder.isRecording) {
        //     // if yes, cancel record
             this.cancelRecord();
        // } else if (this.state.uploadTask !== null) {
        //     // if not, then it was uploading, so cancel upload

        //}
        // stop animation
        this.stopRecordAnimation();
        // reset animation
        this.resetRecordTimerAnimation();
    }
    stopRecordAnimation() {
        this.animationSpinValue.stopAnimation();
    }
    // reset record timer progress animation
    resetRecordTimerAnimation() {
        this.recorderTimerValue.setValue(0);
    }
    // start record timer progressbar animation
    startRecordTimerAnimation() {
        // defined in constructor
        this.recorderTimerValue.setValue(0);
        // start recorder timer animation
        Animated.timing(
            this.recorderTimerValue,
            {
                toValue: 1,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true,
            },
        ).start();
    }

    // cancel upload to server
    cancelUpload() {
        // cancel upload task
        this.state.uploadTask.cancel();
        // reset recorder message (for the glitch!!!)
       // this.recordMessage();
    }




    closeModal() {
        this.recordingModal.close();
    }
    // cancel record
    cancelRecord() {
        // stop recorder timer
        this.stopTimer();
        // kill and reload recorder
       this.prepareRecordingPath();
        // close modal
        this.closeModal();
        this._stop();
        this.cancelUpload();
      //  this.state.uploadTask.cancel()

      //  this.props.navigation.navigate('RecorderView')
    }


    // check connection before upload
    checkConnection() {
        // if online
        if (this.props.isConnected) {
          //  change message to upload mode
            this.uploadMessage();

         //    upload recorded file to api
            this.upload();
        } else {
          //   change message to offline mode
            this.offlineMessage();

           //  close modal
            this.closeModal();
        }
    }




    // upload to server
    upload() {
        const uploadTask = RNFetchBlob.fetch('POST', 'http://m.n4h.ir/midoone/voice/upload', {
            enctype: 'multipart/form-data',
            'Content-Type': 'application/octet-stream',
        }, [
            {
                name: 'files',
                filename: 'record.ima4',
                data: RNFetchBlob.wrap(this.state.audioPath),
            },
        ]);

        // set uploadTask
        this.setState({ uploadTask });
        // upload progress
        uploadTask.uploadProgress((written, total) => {
            // TODO: remove this

        })
            .then((res) => {
                // extract result
                const result = JSON.parse(res.data)
                // check if status is 200
                if (result.status === 200) {
                    // extract track info
                    const trackInfo = {
                        title,
                        artists,
                        header_image_url,
                        release_date,
                    } = result.info;

                    // extract shopping links
                    const shoppingLinks = {
                        apple_music,
                        soundcloud,
                        spotify,
                        youtube,
                    } = result.shopping;

                    // extract download links
                    const downloadLinks = result.download;

                    // then, navigate to result page with the received data
                    this.props.navigation.navigate(
                        'RecorderResultView',
                        {
                            trackInfo,
                            shoppingLinks,
                            downloadLinks,
                        },
                    );
                    // save result to history
                    this.props.updateHistory({
                        timestamp: new Date().getTime(),
                        trackInfo,
                        shoppingLinks,
                        downloadLinks,
                    });
                    // reset recorder
                    this.startMessage();
                    // close modal
                    this.closeModal();
                    // reset recorder message (for the glitch!!!)
                    this.recordMessage();
                } else if (result.status === 404) { // if status is 404
                    // update recorder message
                    this.noResultMessage();
                    // close modal
                    this.closeModal();
                    // reset recorder message (for the glitch!!!)
                    this.recordMessage();
                } else { // undefined result
                    const err = 'خطا در دریافت پاسخ از سرور';
                    throw (err);
                }
             })
            .catch((err) => {
                // change message to error mode
                const err_origin = 'خطای سرور';
                this.errorMessage(err_origin, err);
                // close modal
                this.closeModal();
                this.startMessage();
                // reset recorder message (for the glitch!!!)
                this.recordMessage();
             });
    }











    // open record modal
    openModal() {
        // reload recorder and prepare it for record
     //   this.reloadRecorder();
        // start record animation
        this.startRecordAnimation();
        // open modal
        this.recordingModal.open();
    }
    startRecordAnimation() {
        // defined in constructor
        this.animationSpinValue.setValue(0);
        // start spin animation
        Animated.timing(
            this.animationSpinValue,
            {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            },
        ).start((spin) => {
            // loop
            if (spin.finished) {
                this.startRecordAnimation();
            }
        });
    }





    async _pause() {
        if (!this.state.recording) {
            return;
        }

        try {
            const filePath = await AudioRecorder.pauseRecording();
            this.setState({paused: true});
        } catch (error) {
            console.error(error);
        }
    }

    async _resume() {
        if (!this.state.paused) {
            return;
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({paused: false});
        } catch (error) {
            console.error(error);
        }
    }

    async _stop() {
        // check connection for upload
        this.checkConnection();

         if (!this.state.recording) {
            return;
        }

        this.setState({stoppedRecording: true, recording: false, paused: false});
        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }

    }

    async _play() {
        if (this.state.recording) {
            await this._stop();
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }

    async _record() {

        this.setState({
            infoMessage: '',
        });




        if (this.state.recording) {
            return;
        }

        if (!this.state.hasPermission) {
            return;
        }

        if(this.state.stoppedRecording){
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({recording: true, paused: false});

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
         this.startTimer()
         this.startRecordTimerAnimation();
    }

    _finishRecording(didSucceed, filePath, fileSize) {
        this.setState({ finished: didSucceed });
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }







    render() {
        // rotate animation value
        const spin = this.animationSpinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });

        // recorder timer progressbar value
        const progress = this.recorderTimerValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-(DeviceWidth), 0],
        });

        return (
            <View style={styles.container}>
                <View style={styles.description}>
                    <MTextBold style={styles.title}>
                        جستجو با صدا
                    </MTextBold>
                    <MText style={styles.info}>
                        ابتدا دکمه ضبط صدای میدونه را فشار دهید.
                        سپس اپلیکیشن شروع به ضبط صدا می کند.
                        تلفن همراه خود را به صدای مورد نظر نزدیک کنید تا صدا ضبط شود.
                        بعد از آن منتظر نتیجه بمانید.
                    </MText>
                </View>
                <View style={styles.recorder}>
                    <TouchableDebounce
                        onPress={() => this.openModal()}
                    >
                        <Image
                            source={require('../assets/img/logo.png')}
                            style={styles.recorderButton}
                        />
                    </TouchableDebounce>
                    <MText style={styles.infoMessage}>
                        {this.state.infoMessage}
                    </MText>
                </View>
                <View>
                    {
                        __DEV__ && this.state.lastRecord === true &&
                        <TouchableWithoutFeedback

                            style={{backgroundColor:'transparent'}}
                            onPress={() => this.checkConnection()}
                        >
                            <View style={styles.actionButton}>
                                <Image
                                    source={require('../assets/img/redo-icon.png')}
                                    style={styles.actionButtonIcon}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    <Modal
                        style={styles.modal}
                        ref={(recordingModal) => { this.recordingModal = recordingModal; }}
                        swipeToClose
                        backButtonClose
                        position="center"
                        isDisabled={false}
                        coverScreen
                        animationDuration={200}
                        onOpened={this.onModalOpen}
                        onClosed={this.onModalClose}
                    >
                        <View style={styles.modalRecorder}>
                            <PulseLoader />
                            <Animated.Image
                                source={require('../assets/img/logo.png')}
                                style={[styles.recorderImage, { transform: [{ rotate: spin }] }]}
                            />
                        </View>
                        <View style={styles.recorderInfo}>
                            <Animated.View style={[styles.recorderProgressBar, { transform: [{ translateX: progress }] }]} />
                            <MText style={styles.recorderMessage}>
                                {this.state.recorderMessage}
                            </MText>
                            <MText style={styles.cancelMessage}>
                                برای لغو، به پایین بکشید
                            </MText>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
}

RecorderView.propTypes = {
    navigation: PropTypes.object.isRequired,
    isConnected: PropTypes.bool.isRequired,
};

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    description: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    title: {
        fontFamily:'IRANSansMobile',
        fontSize: 25,
        color: '#2B2D32',
        marginBottom: 10,
        marginTop: 20,
    },
    info: {
        fontFamily:'IRANSansMobile',
        textAlign: 'center',
        fontWeight:'bold',
        color: '#2B2D32',
    },
    recorder: {
        alignItems: 'center',
    },
    recorderButton: {
        width: 80,
        height: 80,
        marginBottom: 15,
    },
    infoMessage: {
        fontSize: 17,
        color: '#2B2D32',
    },
    actionButton: {
        marginTop: 15,
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonIcon: {
        width: 24,
        height: 24,
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2b2d32',
    },
    modalRecorder: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    recorderImage: {
        width: 80,
        height: 80,
        zIndex: 2,
    },
    recorderInfo: {
        width: '100%',
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recorderProgressBar: {
        width: DeviceWidth,
        height: 1,
        backgroundColor: '#ffcb08',
    },
    recorderMessage: {
        fontSize: 17,
        color: '#ffcb08',
        marginTop: 15,
    },
    cancelMessage: {
        fontSize: 13,
        color: '#ffcb08',
    },
};

export default RecorderView;