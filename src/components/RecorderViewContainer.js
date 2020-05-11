import { connect } from 'react-redux';
import { showPlayer, updateHistory } from '../actions';
import RecorderView from './RecorderView';

const mapStateToProps = state => ({
  isConnected: state.isConnected,
});

const mapDispatchToProps = dispatch => ({
  showPlayer: () => {
    dispatch(showPlayer());
  },
  updateHistory: (data) => {
    dispatch(updateHistory(data));
  },
});

const RecorderViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecorderView);

export default RecorderViewContainer;
