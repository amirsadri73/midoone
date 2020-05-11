import React, { Component } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableHighlight,TouchableWithoutFeedback
} from 'react-native';
import Modal from 'react-native-modalbox';
import { MText } from './shared/MText';
import HistoryComponent from './HistoryComponent';

class HistoryView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'تاریخچه جستجو',
    headerTitleStyle: {

      fontFamily: 'IRANSansMobile',
        fontWeight:'bold',
      textAlign: 'center',
      alignSelf: 'center',
      flex: 1,
    },
    headerRight: (
      <TouchableWithoutFeedback
        onPress={() => navigation.state.params.openModal()}
        // background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.4)', true)}
      >
        <View style={{ borderRadius: 10 }}>
          <Image
            source={require('../assets/img/remove-icon.png')}
            style={{ width: 20, height: 20, margin: 16 }}
          />
        </View>
      </TouchableWithoutFeedback>
    ),
  })

  constructor(props) {
    super(props);
    // pass header right button onPress method to navigation params
    this.props.navigation.setParams({ openModal: this.openModal });
  }

  // open modal
  openModal = () => {
    this.actionModal.open();
  }

  // close modal
  closeModal = () => {
    this.actionModal.close();
  }

  // clear history
  clearHistory = () => {
    // close modal
    this.closeModal();
    // dispatch action
    this.props.clearHistory();
  }

  // render empty list message
  renderEmptyListComponent = () => (
    <View style={styles.containerCenter}>
      <MText style={styles.noResultText}>موردی یافت نشد</MText>
    </View>
  )

  render() {
    // action modal
    const ActionModal = (
      <Modal
        style={styles.actionModal}
        swipeToClose
        backButtonClose
        position="center"
        ref={(actionModal) => { this.actionModal = actionModal; }}
        coverScreen
        animationDuration={200}
      >
        <View>
          <MText style={styles.actionModalQuestion}>تاریخچه جستجو حذف شود؟</MText>
        </View>
        <View style={styles.actionModalButtons}>
          <TouchableWithoutFeedback
            /*background={TouchableHighlight.Ripple('#dddddd', false)}*/
              style={{backgroundColor:'#dddddd'}}
            onPress={() => this.clearHistory()}
          >
            <View style={styles.actionModalButton}>
              <MText style={styles.actionModalButtonText}>بله</MText>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            /*background={TouchableHighlight.Ripple('#dddddd', false)}*/
              style={{backgroundColor:'#dddddd'}}
            onPress={() => this.closeModal()}
          >
            <View style={styles.actionModalButton}>
              <MText style={styles.actionModalButtonText}>خیر</MText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );

    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          ListEmptyComponent={this.renderEmptyListComponent}
          data={this.props.historyList}
          renderItem={({ item }) => <HistoryComponent data={item} />}
          keyExtractor={item => item.timestamp.toString()}
        />
        {ActionModal}
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
  },
  container: {
    flex: 1,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  actionModal: {
    width: '70%',
    height: 120,
    padding: 15,
    alignItems: 'center',
  },
  actionModalQuestion: {
    fontSize: 18,
    color: '#000',
    marginBottom: 15,
  },
  actionModalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionModalButton: {
    width: 50,
    height: 30,
    alignItems: 'center',
    backgroundColor: '#c7c7c7',
    marginHorizontal: 15,
  },
  actionModalButtonText: {
    color: '#000',
    fontSize: 16,
  },
};

export default HistoryView;
