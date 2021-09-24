import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';

import {ButtonWithTextIcon} from '_atoms';

const data = [
  {
    username: 'alexdenache',
    text: 'what is that what is that what is that v what is that what is that what is that',
    imageURL:
      'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/1:1/w_741,h_741,c_limit/best-face-oil.png',
  },
  {
    username: 'bbb',
    text: 'what is that what is that what is that v what is that what is that what is that',
    imageURL:
      'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/1:1/w_741,h_741,c_limit/best-face-oil.png',
  },
  {
    username: 'bbbdsadas',
    text: 'what is that what is that what is that v what is that what is that what is that',
    imageURL:
      'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/1:1/w_741,h_741,c_limit/best-face-oil.png',
  },
  {
    username: 'bdsadsabb',
    text: 'what is that what is that what is that v what is that what is that what is that',
    imageURL:
      'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/1:1/w_741,h_741,c_limit/best-face-oil.png',
  },
];
class CommentsSection extends PureComponent {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({item}) {
    return (
      <View style={styles.itemContainer}>
        <FastImage
          source={{uri: item.imageURL}}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
        />

        <View style={{flexDirection: 'column'}}>
          <Text style={{color: '#FFF', fontSize: 18, fontWeight: 'bold'}}>
            {item.username}
          </Text>
          <Text style={{color: '#FFF', fontSize: 16}}>{item.text}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={item => item.username}
        />
      </View>
    );
  }
}

export default CommentsSection;

const styles = StyleSheet.create({
  container: {
    height: '20%',
    backgroundColor: '#F4A261',
    width: '100%',
    borderRadius: 10,
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  image: {
    height: 30,
    width: 30,
    marginRight: 10,
    borderRadius: 15,
  },
});
