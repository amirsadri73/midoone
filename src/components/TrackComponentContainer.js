import { connect } from 'react-redux';
import {
  removeFromPlaylist,
  updateDownloadedTrack,
  setCurrentlyPlayingTrack,
  showPlayer,
  play,
  pause,
} from '../actions';
import TrackComponent from './TrackComponent';

const mapStateToProps = state => ({
  isConnected: state.isConnected,
  isBuffering: state.isBuffering,
  isPlaying: state.isPlaying,
  currentlyPlaying: state.currentlyPlaying,
});

const mapDispatchToProps = dispatch => ({
  removeFromPlaylist: (trackId) => {
    dispatch(removeFromPlaylist(trackId));
  },
  updateDownloadedTrack: (trackId, pathToFile) => {
    dispatch(updateDownloadedTrack(trackId, pathToFile));
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

const TrackComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrackComponent);

export default TrackComponentContainer;
