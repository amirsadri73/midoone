import { connect } from 'react-redux';
import {
  addToPlaylist,
  setCurrentlyPlayingTrack,
  showPlayer,
  play,
  pause,
} from '../actions';
import ResultComponent from './ResultComponent';

const mapStateToProps = state => ({
  isConnected: state.isConnected,
  isBuffering: state.isBuffering,
  isPlaying: state.isPlaying,
  currentlyPlaying: state.currentlyPlaying,
  playlist: state.playlist,
});

const mapDispatchToProps = dispatch => ({
  addToPlaylist: (track) => {
    dispatch(addToPlaylist(track));
  },
  setCurrentlyPlayingTrack: (track) => {
    dispatch(setCurrentlyPlayingTrack(track));
  },
  showPlayer: () => {
    dispatch(showPlayer());
  },
  play: () => {
    dispatch(play());
  },
  pause: () => {
    dispatch(pause());
  },
});

const ResultComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultComponent);

export default ResultComponentContainer;
