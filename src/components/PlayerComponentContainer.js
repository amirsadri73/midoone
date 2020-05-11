import { connect } from 'react-redux';
import {
  setBufferingStatus,
  play,
  pause,
  hidePlayer,
  showPlayer,
  setCurrentlyPlayingTrack,
} from '../actions';
import PlayerComponent from './PlayerComponent';

const mapStateToProps = state => ({
  isConnected: state.isConnected,
  isBuffering: state.isBuffering,
  isPlaying: state.isPlaying,
  playlist: state.playlist,
  currentlyPlaying: state.currentlyPlaying,
});

const mapDispatchToProps = dispatch => ({
  setBufferingStatus: (flag) => {
    dispatch(setBufferingStatus(flag));
  },
  play: () => {
    dispatch(play());
  },
  pause: () => {
    dispatch(pause());
  },
  hidePlayer: () => {
    dispatch(hidePlayer());
  },
  showPlayer: () => {
    dispatch(showPlayer());
  },
  setCurrentlyPlayingTrack: (track) => {
    dispatch(setCurrentlyPlayingTrack(track));
  },
});

const PlayerComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayerComponent);

export default PlayerComponentContainer;
