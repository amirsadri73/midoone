import React, { Component } from 'react';
import {
  View,
  /*TouchableOpacity,*/TouchableHighlight,TouchableWithoutFeedback
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { MText, MTextBold } from './shared/MText';

class HistoryComponent extends Component {
  constructor(props) {
    super(props);

    // this.date = new Date(this.props.data.timestamp).toLocaleString('fa-IR-u-ca-persian');
    this.date = this.getLocalDateTime(new Date(this.props.data.timestamp));
  }

  // pretty print date and time
  getLocalDateTime = (date) => {
    let hours = date.getHours();
    if (hours < 10) hours = `0${hours}`;
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;
    // const timeOfDay = hours < 12 ? 'AM' : 'PM';
    return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}, ${hours}:${minutes}`;
  }

  // rerender history
  show = () => {
    this.props.navigation.navigate(
      'RecorderResultView',
      { ...this.props.data },
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback
        activeOpacity={0.7}
        onPress={() => this.show()}
      >
        <View style={styles.history}>
          <View style={styles.historyInfo}>
            <MTextBold
              style={styles.historyTitle}
              numberOfLines={1}
            >
              {this.props.data.trackInfo.title}
            </MTextBold>
            <MText
              style={styles.historyTitle}
              numberOfLines={1}
            >
              {this.props.data.trackInfo.artists}
            </MText>
          </View>
          <View style={styles.historyDate}>
            <MText style={styles.date}>
              {this.date}
            </MText>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  history: {
    height: 50,
    marginVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  historyInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  historyTitle: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  historyDate: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  date: {
    fontSize: 14,
    color: '#000',
  },
};

export default withNavigation(HistoryComponent);
