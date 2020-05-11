import { connect } from 'react-redux';
import { showPlayer } from '../actions';
import RecorderResultView from './RecorderResultView';

const mapDispatchToProps = dispatch => ({
  showPlayer: () => {
    dispatch(showPlayer());
  },
});

const RecorderResultViewContainer = connect(
  null,
  mapDispatchToProps,
)(RecorderResultView);

export default RecorderResultViewContainer;
