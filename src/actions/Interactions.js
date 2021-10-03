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

  newRef.set({
    id: newRef.key,
    info: {
      id: newRef.key,
      timestamp: date.getTime(),
      title: title,
      sellerId: uid,
      videoURL: videoURL,
      status: status,
    },
  });

  usersRef.child(`${uid}/events/current`).set(newRef.key);

  return {
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
};

export const endEvent = async (eventInfo, uid) => {
  eventsRef.child(`${eventInfo.id}/info/status`).set('ended');
  usersRef
    .child(`${uid}/events/past/${eventInfo.id}`)
    .set(eventInfo.info.timestamp);
  usersRef.child(`${uid}/events/current`).remove();
};

export const addItem = async (eventInfo, price, quantity) => {
  const productRef = await eventsRef.child(`${eventInfo.id}/products/`).push();

  eventsRef.child(`${eventInfo.id}/products/${productRef.key}`).set({
    id: productRef.key,
    price: price,
    currentStock: quantity,
    currency: 'USD',
  });

  eventsRef.child(`${eventInfo.id}/info/currentProductId`).set(productRef.key);
};

export const getProductInfo = async (eventInfo, productId) => {
  const snap = await eventsRef
    .child(`${eventInfo.id}/products/${productId}`)
    .once('value');
  return snap.val();
};
