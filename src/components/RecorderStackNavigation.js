import { Animated, Easing } from 'react-native';
import { createStackNavigator } from 'react-navigation';
// import views
import RecorderViewContainer from './RecorderViewContainer';
import RecorderResultViewContainer from './RecorderResultViewContainer';
import HistoryViewContainer from './HistoryViewContainer';

// fade transition config
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

const RecorderStackNavigation = createStackNavigator({
  RecorderView: { screen: RecorderViewContainer },
  RecorderResultView: { screen: RecorderResultViewContainer },
  HistoryView: { screen: HistoryViewContainer },
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
RecorderStackNavigation.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export default RecorderStackNavigation;
