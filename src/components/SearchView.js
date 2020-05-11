import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modalbox';
import HeaderRight from './shared/HeaderRight';
import { MText, MTextBold } from './shared/MText';

class SearchView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'جستجو',
    headerTitleStyle: {
        fontsize:50,
      fontFamily: 'IRANSansMobile',
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
      errorMessage: '',
    };

    // pass header right button onPress method to navigation params
    this.props.navigation.setParams({ showPlayer: this.props.showPlayer });
  }

  // set search query
  setQuery = (query) => {
    this.setState({
      query,
    });
  }

  // clear search query
  clearQuery = () => {
    this.setState({
      query: '',
    });
  }

  // search
  search = () => {

    if (!this.props.isConnected) {
      // set proper error message
      this.setState({
        errorMessage: 'عدم دسترسی به شبکه',
      });
      // show error modal
      this.showErrorModal();
    } else if (this.state.query !== '') {
      // set loading flag
      this.props.setLoadingStatus(true);
      // create form data
      const data = new FormData();
      data.append('q', this.state.query);

      return fetch('http://m.n4h.ir/midoone/voice/finder', {
        method: 'POST',
        body: data,
      })
     
        .then(response => response.json())
        .then((json) => {

          // clear input
          this.clearQuery();
          // result status
          if (json.status === '404') { // no result
            // set proper error message
            this.setState({
              errorMessage: 'موردی یافت نشد!',
            });
            // set loading flag
            this.props.setLoadingStatus(false);
            // show error modal
            this.showErrorModal();
          } else {
            // set loading flag
            this.props.setLoadingStatus(false);
            // then, navigate to result page with the received data
            this.props.navigation.navigate(
              'SearchResultView',
              {
                tracks: json,
              },
            );
          }
        })
        .catch((error) => {
          // set proper error message
          this.setState({
            errorMessage: 'خطا در دریافت پاسخ از سرور',
          });
          // set loading flag
          this.props.setLoadingStatus(false);
          // show error modal
          this.showErrorModal();
        });
    }
  }

  // show error modal
  showErrorModal = () => {
    this.errorModal.open();
  };

  // render method
  render() {
    // search icon
    const SearchIcon = (
      <Image source={require('../assets/img/search-icon-gray.png')} style={styles.SearchIcon} />
    );

    // loading icon
    const LoadingIcon = (
      <ActivityIndicator size="small" color="#2b2d32" style={styles.LoadingIcon} />
    );

    // error modal
    const ErrorModal = (
      <Modal
        style={styles.errorModal}
        swipeToClose
        backButtonClose
        position="center"
        ref={(errorModal) => { this.errorModal = errorModal; }}
        coverScreen
        animationDuration={200}
      >
        <View style={styles.errorModalContent}>
          <MText style={styles.errorModalText}>{this.state.errorMessage}</MText>
        </View>
      </Modal>);

    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <MTextBold style={styles.infoHeader}>
            جستجو با نام
          </MTextBold>
          <MText style={styles.infoText}>
            نام آهنگ یا خواننده مورد نظر خود را وارد کرده، سپس دکمه جستجو در صفحه کلید را لمس نمایید.
          </MText>
        </View>
        <View style={styles.Search}>

          {(this.props.isLoading) ? LoadingIcon : SearchIcon }

          <TextInput
            style={styles.SearchInput}
            onChangeText={query => this.setQuery(query)}
            value={this.state.query}
            placeholder="نام آهنگ یا خواننده..."
            returnKeyType="search"
            blurOnSubmit
            underlineColorAndroid="transparent"
            placeholderTextColor="#c7c7c7"
            onSubmitEditing={() => this.search()}
            clearButtonMode="while-editing"
          />

        </View>
        {ErrorModal}
      </View>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  info: {
    width: '90%',
    alignItems: 'center',
  },
  infoHeader: {
    fontSize: 25,
    color: '#2B2D32',
    marginBottom: 10,
      marginTop: 20,
  },
  infoText: {
    textAlign: 'center',
    color: '#2B2D32',
  },
  Search: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 40, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '90%',
  },
  SearchInput: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'IRANSansMobile',
    height: 40,
    borderColor: '#fff',
    borderWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 15,
      fontWeight:'bold',
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
  errorModal: {
    width: '70%',
    height: 70,
    borderRadius: 20,
  },
  errorModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorModalText: {
    color: 'red',
    fontSize: 18,
  },
};

export default SearchView;
