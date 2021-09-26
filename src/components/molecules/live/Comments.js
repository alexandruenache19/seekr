import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Avatar, Colors} from 'react-native-ui-lib';
import {ButtonWithTextIcon} from '_atoms';
import {eventsRef} from '../../../config/firebase';
// const data = [
//   {
//     username: 'alexdenache',
//     text: 'what is that what is that what is that v what is that what is that what is that',
//     imageURL:
//       'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/1:1/w_741,h_741,c_limit/best-face-oil.png',
//   },
//   {
//     username: 'bbb',
//     text: 'what is that what is that what is that v what is that what is that what is that',
//     imageURL:
//       'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/1:1/w_741,h_741,c_limit/best-face-oil.png',
//   },
//   {
//     username: 'bbbdsadas',
//     text: 'what is that what is that what is that v what is that what is that what is that',
//     imageURL:
//       'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/1:1/w_741,h_741,c_limit/best-face-oil.png',
//   },
//   {
//     username: 'bdsadsabb',
//     text: 'what is that what is that what is that v what is that what is that what is that',
//     imageURL:
//       'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/1:1/w_741,h_741,c_limit/best-face-oil.png',
//   },
// ];

class CommentsSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {loading: true, comments: []};
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    const {eventInfo} = this.props;
    this.commentsListener = eventsRef
      .child(`event-id/comments`)
      .orderByChild('timestamp')
      .limitToLast(20)
      .on('value', snapshot => {
        const comments = [];
        snapshot.forEach(commentSnapshot => {
          const comment = commentSnapshot.val();
          comments.push(comment);
        });

        this.setState({
          comments: comments.reverse(),
          loading: false,
        });
      });
  }

  renderItem({item}) {
    return (
      <View style={styles.itemContainer}>
        <Avatar
          style={styles.image}
          source={{uri: item.imageURL}}
          label={
            item.username.charAt(0).toUpperCase() +
            item.username.charAt(1).toUpperCase()
          }
          backgroundColor={Colors.red60}
        />

        <View style={{flexDirection: 'column', marginLeft: 10}}>
          <Text style={{color: '#FFF', fontSize: 18, fontWeight: 'bold'}}>
            @{item.username}
          </Text>
          <Text style={{color: '#FFF', fontSize: 16}}>{item.text}</Text>
        </View>
      </View>
    );
  }

  render() {
    const {comments} = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          inverted
          // contentContainerStyle={{flexDirection: 'column-reverse'}}
          data={comments}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.username + index}
        />
      </View>
    );
  }
}

export default CommentsSection;

const styles = StyleSheet.create({
  container: {
    height: '20%',
    backgroundColor: '#282B28',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 20,
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
