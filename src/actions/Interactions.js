import {Firebase} from '../config';
const {eventsRef, usersRef} = Firebase;

export const createEvent = async (title, date, videoURL, uid) => {
  const newRef = eventsRef.push();

  newRef.set({
    id: newRef.key,
    info: {
      id: newRef.key,
      timestamp: date.getTime(),
      title: title,
      sellerId: uid,
      videoURL: videoURL,
    },
  });

  usersRef.child(`${uid}/events/current`).set(newRef.key);
};
