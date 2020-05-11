import { connect } from 'react-redux';
import { clearHistory } from '../actions';
import HistoryView from './HistoryView';

const mapStateToProps = state => ({
  historyList: state.historyList,
});

const mapDispatchToProps = dispatch => ({
  clearHistory: () => {
    dispatch(clearHistory());
  },
});

const HistoryViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryView);

export default HistoryViewContainer;
