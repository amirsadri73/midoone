import { connect } from 'react-redux';
import PlaylistView from './PlaylistView';
import { setLoadingStatus, showPlayer, getAllTracks } from '../actions';

const mapStateToProps = state => ({
  isLoading: state.isLoading,
  playlist: state.playlist,
});

const mapDispatchToProps = dispatch => ({
  setLoadingStatus: (flag) => {
    dispatch(setLoadingStatus(flag));
  },
  showPlayer: () => {
    dispatch(showPlayer());
  },
  getAllTracks: (query) => {
    dispatch(getAllTracks(query));
  },
});

const PlaylistViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlaylistView);

export default PlaylistViewContainer;
