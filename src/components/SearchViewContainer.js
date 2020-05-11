import { connect } from 'react-redux';
import SearchView from './SearchView';
import { setLoadingStatus, showPlayer } from '../actions';

const mapStateToProps = state => ({
  isConnected: state.isConnected,
  isLoading: state.isLoading,
});

const mapDispatchToProps = dispatch => ({
  setLoadingStatus: (flag) => {
    dispatch(setLoadingStatus(flag));
  },
  showPlayer: () => {
    dispatch(showPlayer());
  },
});

const SearchViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchView);

export default SearchViewContainer;
