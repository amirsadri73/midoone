import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import HeaderRight from './shared/HeaderRight';
import ResultComponentContainer from './ResultComponentContainer';

class SearchResultView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'نتیجه جستجو',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: 'IRANSansMobile',
      textAlign: 'center',
      alignSelf: 'center',
      flex: 1,
    },
    headerRight: <HeaderRight navigation={navigation} />,
  })

  constructor(props) {
    super(props);

    // pass header right button onPress method to navigation params
    this.props.navigation.setParams({ showPlayer: this.props.showPlayer });

    // extract download links
    this.tracks = Object.values(this.props.navigation.state.params.tracks);
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          data={this.tracks}
          renderItem={({ item }) => <ResultComponentContainer data={{ ...item, artists: '-' }} />}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
};

export default SearchResultView;
