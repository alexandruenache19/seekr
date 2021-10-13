import {Firebase} from '../config';
const {eventsRef, usersRef} = Firebase;

export const createEvent = async (
  title,
  date,
  videoURL,
  uid,
  status = 'scheduled',
) => {
  const newRef = eventsRef.push();

  const eventInfo = {
    id: newRef.key,
    info: {
      id: newRef.key,
      timestamp: date.getTime(),
      title: title,
      sellerId: uid,
      videoURL: videoURL,
      status: status,
    },
  };

  newRef.set(eventInfo);
  usersRef.child(`${uid}/events/current`).set(eventInfo.id);
  usersRef.child(`${uid}/events/live/${newRef.key}`).set(eventInfo);

  return eventInfo;
};

export const endEvent = async (eventInfo, uid) => {
  eventsRef.child(`${eventInfo.id}/info/status`).set('ended');
  usersRef
    .child(`${uid}/events/past/${eventInfo.id}`)
    .set(eventInfo.info.timestamp);
  usersRef.child(`${uid}/events/current`).remove();
};

export const addItem = async (eventInfo, price, quantity, currency) => {
  const productRef = await eventsRef.child(`${eventInfo.id}/products/`).push();

  eventsRef.child(`${eventInfo.id}/products/${productRef.key}`).set({
    id: productRef.key,
    price: price,
    currentStock: quantity,
    currency: currency,
  });

  eventsRef.child(`${eventInfo.id}/info/currentProductId`).set(productRef.key);
};

export const getProductInfo = async (eventInfo, productId) => {
  const snap = await eventsRef
    .child(`${eventInfo.id}/products/${productId}`)
    .once('value');
  return snap.val();
};

export const addLiveURL = async (userInfo, eventInfo) => {
  await eventsRef
    .child(`${eventInfo.id}/info/liveURL`)
    .set(userInfo.stream.playbackURL);
};

export const updateOrderStatus = async (eventId, orderId) => {
  await eventsRef
    .child(`${eventId}/orders/${orderId}/info/status`)
    .set('complete');
};

export const updateOrderProductStatus = async (
  eventId,
  orderId,
  orderProductId,
  status,
) => {
  await eventsRef
    .child(`${eventId}/orders/${orderId}/products/${orderProductId}/isPacked`)
    .set(status);
};
