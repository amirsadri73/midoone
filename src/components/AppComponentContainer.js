import { connect } from 'react-redux';
import { createSwitchNavigator } from 'react-navigation';
import { setConnectionStatus, hidePlayer, getAllTracks } from '../actions';
import AppComponent from './AppComponent';

const mapStateToProps = state => ({
  playerVisible: state.playerVisible,
});

const mapDispatchToProps = dispatch => ({
  setConnectionStatus: (isConnected) => {
    dispatch(setConnectionStatus(isConnected));
  },
  hidePlayer: () => {
    dispatch(hidePlayer());
  },
  getAllTracks: (query) => {
    dispatch(getAllTracks(query));
  },
});

const AppComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppComponent);

// this navigator is created becase AppComponentContainer needs "navigation" object
export default createSwitchNavigator({
  AppComponent: {
    screen: AppComponentContainer,
  },
});
