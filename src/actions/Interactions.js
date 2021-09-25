import {Firebase} from '../config';
const {eventsRef, usersRef} = Firebase;

export const createEvent = async (title, date, videoURL, userId) => {
  const newRef = eventsRef.push();

  newRef.set({
    id: newRef.key,
    timestamp: date.getTime(),
    title: title,
    videoURL: videoURL,
  });

  // usersRef.child(`${userId}/events/current`).set(newRef.key);
};
