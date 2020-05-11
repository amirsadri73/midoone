import { connect } from 'react-redux';
import { showPlayer } from '../actions';
import SearchResultView from './SearchResultView';

const mapDispatchToProps = dispatch => ({
  showPlayer: () => {
    dispatch(showPlayer());
  },
});

const SearchResultViewContainer = connect(
  null,
  mapDispatchToProps,
)(SearchResultView);

export default SearchResultViewContainer;
