import { Animated, Easing } from 'react-native';
import { createStackNavigator } from 'react-navigation';
// import views
import SearchViewContainer from './SearchViewContainer';
import SearchResultViewContainer from './SearchResultViewContainer';

const transitionConfig = () => ({
  transitionSpec: {
    duration: 750,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
    useNativeDriver: true,
  },
  screenInterpolator: (sceneProps) => {
    const { position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [0, 1],
    });
    return { opacity };
  },
});

const SearchStackNavigation = createStackNavigator({
  SearchView: { screen: SearchViewContainer },
  SearchResultView: { screen: SearchResultViewContainer },
}, {
  // default styles for all views in this navigator
  cardStyle: {
    backgroundColor: '#fff',
  },
  headerStyle: {
    backgroundColor: '#fff',
    elevation: 0,
  },
  transitionConfig,
});

// to hide tab bar in nested views
SearchStackNavigation.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export default SearchStackNavigation;
