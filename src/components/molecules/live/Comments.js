import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from 'react-native'
import { Avatar, Colors, Typography } from 'react-native-ui-lib'
import { ButtonWithTextIcon } from '_atoms'
import { eventsRef } from '../../../config/firebase'

class CommentsSection extends PureComponent {
  constructor (props) {
    super(props)
    this.state = { loading: true, comments: [] }
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount () {
    const { eventInfo } = this.props
    this.commentsListener = eventsRef
      .child(`${eventInfo.id}/comments`)
      .orderByChild('timestamp')
      .limitToLast(40)
      .on('value', snapshot => {
        const comments = []
        snapshot.forEach(commentSnapshot => {
          const comment = commentSnapshot.val()
          comments.push(comment)
        })

        this.setState({
          comments: comments.reverse(),
          loading: false
        })
      })
  }

  componentWillUnmount () {
    const { eventInfo } = this.props
    eventsRef
      .child(`${eventInfo.id}/comments`)
      .orderByChild('timestamp')
      .limitToLast(40)
      .off('value', this.commentsListener)
  }

  renderItem ({ item }) {
    return (
      <View style={styles.itemContainer}>
        {/* <Avatar
          style={{...styles.image, marginRight: 10}}
          source={{ uri: item.imageURL }}
          label={
            item.username
              ? item.username.charAt(0).toUpperCase() +
              item.username.charAt(1).toUpperCase()
              : ''
          }
          backgroundColor={Colors.red60}
        /> */}

        <Text>
          <Text style={{ ...Typography.text70, fontSize: 15, color: 'rgba(0,0,0,0.6)' }}>
            @{item.username}
          </Text>
          <Text style={{ ...Typography.text70, fontSize: 15 }}>{` ${item.text}`}</Text>
        </Text>
      </View>
    )
  }

  render () {
    const { comments, loading } = this.state
    return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator color='#FFF' style={{ paddingTop: 20 }} />
        ) : comments.length > 0 ? (
          <FlatList
            inverted
            data={comments}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.username + index}
          />
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              style={{
                ...Typography.text70,
                textAlign: 'center'
              }}
            >
              Questions will appear here
            </Text>
          </View>
        )}
      </View>
    )
  }
}

export default CommentsSection

const styles = StyleSheet.create({
  container: {
    height: '20%',
    // backgroundColor: '#282B28',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 3,
    paddingVertical: 8
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
    // marginTop: 3,
    // marginBottom: 3
  },
  image: {
    height: 24,
    width: 24,
    marginRight: 10,
    borderRadius: 12
  }
})
