import { createStackNavigator } from 'react-navigation';
// import views
import PlaylistViewContainer from './PlaylistViewContainer';

const PlaylistStackNavigation = createStackNavigator({
  PlaylistView: { screen: PlaylistViewContainer },
}, {
  // default styles for all views in this navigator
  cardStyle: {
    backgroundColor: '#fff',
  },
  headerStyle: {
    backgroundColor: '#fff',
    elevation: 0,
  },
});

export default PlaylistStackNavigation;
