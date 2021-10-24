import Share from 'react-native-share'
import moment from 'moment'
import { Firebase } from '../config'
const { usersRef } = Firebase

export const shareOnFB = async item => {
  const day = moment(item.timestamp).format('DD')
  const month = moment(item.timestamp).format('MMMM')

  const options = {
    title: item.title,
    message: `Join me live on ${day} ${month} on Seekr`,
    url: `https://seekrlive.com/e/${item.id}`,
    social: Share.Social.FACEBOOK
  }

  Share.shareSingle(options)
}

export const share = async item => {
  const day = moment(item.timestamp).format('DD')
  const month = moment(item.timestamp).format('MMMM')

  const usernameSnap = await usersRef
    .child(item.sellerId)
    .child('info')
    .child('username')
    .once('value')
  const username = usernameSnap.val()

  let options = {
    title: 'Join my live sale',
    message: `Live on Seekr on ${day} ${month}`,
    url: `https://seekrlive.com/e/${item.id}`
  }
  if (username) {
    options = {
      title: `Join ${username}'s live sale`,
      message: `Live on Seekr on ${day} ${month}`,
      url: `https://seekrlive.com/${username}`
    }
  }

  Share.open(options)
}
