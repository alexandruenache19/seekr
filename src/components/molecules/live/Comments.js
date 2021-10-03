import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Avatar, Colors} from 'react-native-ui-lib';
import {ButtonWithTextIcon} from '_atoms';
import {eventsRef} from '../../../config/firebase';

class CommentsSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {loading: true, comments: []};
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    const {eventInfo} = this.props;
    this.commentsListener = eventsRef
      .child(`${eventInfo.id}/comments`)
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
            item.username
              ? item.username.charAt(0).toUpperCase() +
                item.username.charAt(1).toUpperCase()
              : ''
          }
          backgroundColor={Colors.red60}
        />

        <View style={{flexDirection: 'column', marginLeft: 10}}>
          <Text style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}}>
            @{item.username}
          </Text>
          <Text style={{color: '#FFF', fontSize: 18}}>{item.text}</Text>
        </View>
      </View>
    );
  }

  render() {
    const {comments, loading} = this.state;
    return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator color="#FFF" style={{paddingTop: 20}} />
        ) : (
          <FlatList
            inverted
            data={comments}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.username + index}
          />
        )}
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
