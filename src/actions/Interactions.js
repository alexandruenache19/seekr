import { Firebase } from '../config'
import { Image, Platform } from 'react-native'
import ImageResizer from 'react-native-image-resizer'
const { eventsRef, usersRef } = Firebase

const getImageSize = async uri =>
  new Promise(resolve => {
    Image.getSize(uri, (width, height) => {
      resolve({
        width: width,
        height: height
      })
    })
  })

export const uploadImageToS3 = async (
  filePath,
  bucket,
  objectId,
  keyPrefix = null
) => {
  // let resizedImage
  // try {
  //   const { width, height } = await getImageSize(filePath)
  //   console.log(width, height)
  //   console.log('filepath', filePath)
  //   if (width > 650) {
  //     resizedImage = await ImageResizer.createResizedImage(filePath, 850, height, 'JPEG', 80)
  //   } else if (height > 650) {
  //     resizedImage = await ImageResizer.createResizedImage(filePath, width, 850, 'JPEG', 80)
  //   }

  //   console.log('resizedImage', resizedImage)
  // } catch (e) {
  //   console.log('e', e)
  //   resizedImage = { path: filePath }
  // }

  const resizedImage = { path: filePath }

  // console.log('resizedImage', resizedImage)

  const AWS = require('aws-sdk')
  let key
  if (keyPrefix) {
    key = `${keyPrefix}/${objectId}`
  } else {
    key = `${objectId}`
  }
  const s3 = new AWS.S3({
    region: 'us-east-1',
    accessKeyId: 'AKIAZRH5PIV3MO5V4TBE',
    secretAccessKey: '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'
  })

  const resp = await fetch(
    Platform.OS === 'android'
      ? 'file://' + resizedImage.path
      : resizedImage.path
  )
  const imageBody = await resp.blob()

  const params = {
    Bucket: bucket,
    Body: imageBody,
    Key: key,
    ACL: 'public-read-write'
  }
  await s3.putObject(params).promise()

  console.log(`https://s3.amazonaws.com/${bucket}/` + key)
  return `https://s3.amazonaws.com/${bucket}/` + key
};

export const createEvent = async (
  title,
  date,
  videoURL,
  uid,
  status = 'scheduled'
) => {
  const newRef = eventsRef.push()

  const eventInfo = {
    id: newRef.key,
    info: {
      id: newRef.key,
      timestamp: date.getTime(),
      title: title,
      sellerId: uid,
      videoURL: videoURL,
      status: status
    }
  }

  newRef.set(eventInfo)
  usersRef.child(`${uid}/events/current`).set(eventInfo.id)
  usersRef.child(`${uid}/events/live/${newRef.key}`).set(eventInfo)

  return eventInfo
};

export const endEvent = async (eventInfo, uid) => {
  try {
    eventsRef.child(`${eventInfo.id}/info/status`).set('ended')
    usersRef
      .child(`${uid}/events/past/${eventInfo.id}`)
      .set(eventInfo.info.timestamp)
    usersRef.child(`${uid}/events/live/${eventInfo.id}`).remove()
    usersRef.child(`${uid}/events/current`).remove()
  } catch (e) {
    console.log('e', e)
  }
}

export const addItem = async (
  eventInfo,
  price,
  quantity,
  currency,
  productImagePath = null,
  callback = () => null
) => {
  const productRef = await eventsRef.child(`${eventInfo.id}/products/`).push()

  /** upload image to s3 */
  let imageURL = null
  if (productImagePath) {
    imageURL = await uploadImageToS3(
      productImagePath,
      'seekr-product-images',
      productRef.key,
      null
    )
  }

  await eventsRef.child(`${eventInfo.id}/products/${productRef.key}`).set({
    id: productRef.key,
    price: price,
    currentStock: quantity,
    currency: currency,
    imageURL: imageURL
  })

  await eventsRef.child(`${eventInfo.id}/info/currentProductId`).set(productRef.key)

  callback()
}

export const getProductInfo = async (eventInfo, productId) => {
  const snap = await eventsRef
    .child(`${eventInfo.id}/products/${productId}`)
    .once('value')
  return snap.val()
};

export const addLiveURL = async (userInfo, eventInfo) => {
  await eventsRef
    .child(`${eventInfo.id}/info/liveURL`)
    .set(userInfo.stream.playbackURL)
};

export const updateOrderStatus = async (eventId, orderId) => {
  await eventsRef
    .child(`${eventId}/orders/${orderId}/info/status`)
    .set('complete')
};

export const updateOrderProductStatus = async (
  eventId,
  orderId,
  orderProductId,
  status
) => {
  await eventsRef
    .child(`${eventId}/orders/${orderId}/products/${orderProductId}/isPacked`)
    .set(status)
};
