import React, { Component } from 'react';
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
 TouchableHighlight,TouchableWithoutFeedback
} from 'react-native';
import TrackComponentContainer from './TrackComponentContainer';
import HeaderRight from './shared/HeaderRight';
import { MText } from './shared/MText';

class PlaylistView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'لیست آهنگ ها',
    headerTitleStyle: {

      fontFamily: 'IRANSansMobile',
        fontWeight:'bold',
      textAlign: 'center',
      alignSelf: 'center',
      flex: 1,
    },
    headerLeft: (<View />),
    headerRight: <HeaderRight navigation={navigation} />,
  })

  constructor(props) {
    super(props);
    this.state = {
      query: '',
    };
    // pass header right button onPress method to navigation params
    this.props.navigation.setParams({ showPlayer: this.props.showPlayer });
  }

  // on search input text change
  handleSearchTextChange = (query) => {
    this.setState({
      query,
    });
  }

  // filter playlist tracks
  filter = () => {
    // show loading
    this.props.setLoadingStatus(true);
    // dispatch action
    this.props.getAllTracks(this.state.query);
  }

  // clear filter
  clearFilter = () => {
    // clear query
    this.setState({
      query: '',
    });
    // dispatch action
    this.props.getAllTracks();
  }

  // render search bar
  renderListHeaderComponent = () => (
    <View style={styles.Search}>
      {(this.props.isLoading) ? (
        <ActivityIndicator size="small" color="#c7c7c7" style={styles.LoadingIcon} />
      ) : (
        <Image source={require('../assets/img/search-icon-gray.png')} style={styles.SearchIcon} />
      ) }
      <TextInput
        style={styles.SearchInput}
        onChangeText={query => this.handleSearchTextChange(query)}
        value={this.state.query}
        placeholder=""
        returnKeyType="search"
        blurOnSubmit
        underlineColorAndroid="transparent"
        placeholderTextColor="#c7c7c7"
        onSubmitEditing={() => this.filter()}
        clearButtonMode="while-editing"
      />
      {(this.state.query !== '') ? (
        <TouchableWithoutFeedback
          /*background={TouchableHighlight.Ripple('#dbdbdb', true)}*/
            style={{backgroundColor:'#dbdbdb'}}
          onPress={() => this.clearFilter()}
        >
          <View style={styles.clearButton}>
            <Image
              source={require('../assets/img/cancel-icon.png')}
              style={styles.clearIcon}
            />
          </View>
        </TouchableWithoutFeedback>
      ) : null }
    </View>
  );

  // render empty list message
  renderEmptyListComponent = () => (
    <View style={styles.containerCenter}>
      <MText style={styles.noResultText}>موردی یافت نشد</MText>
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          ListHeaderComponent={this.renderListHeaderComponent}
          ListEmptyComponent={this.renderEmptyListComponent}
          data={this.props.playlist}
          renderItem={({ item }) => <TrackComponentContainer data={item} />}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  }
}

const styles = {
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultText: {
    color: '#2b2d32',
      marginTop:10,
  },
  container: {
    flex: 1,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  Search: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 5,
    width: '95%',
    alignSelf: 'center',
      marginTop: 10,
  },
  SearchInput: {
    color: '#000',
    textAlign: 'left',
    fontFamily: 'IRANSansMobile',
    fontSize: 13,
    flex: 1,
    height: 40,
    borderColor: '#fff',
    borderWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  clearButton: {
    height: 20,
    width: 20,
    marginRight: 15,
    marginTop: 5,
    alignItems: 'center',
  },
  clearIcon: {
    height: 15,
    width: 15,
  },
  SearchIcon: {
    padding: 10,
    marginLeft: 15,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  LoadingIcon: {
    padding: 10,
    marginLeft: 15,
    height: 20,
    width: 20,
  },
};

export default PlaylistView;
