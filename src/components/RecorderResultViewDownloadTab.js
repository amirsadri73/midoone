import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import ResultComponentContainer from './ResultComponentContainer';

class RecorderResultViewDownloadTab extends Component {
  constructor(props) {
    super(props);

    // extract download links
    this.links = Object.values(this.props.screenProps.downloadLinks);
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          data={this.links}
          renderItem={({ item }) => <ResultComponentContainer data={{ ...this.props.screenProps.trackInfo, ...item }} />}
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

export default RecorderResultViewDownloadTab;
