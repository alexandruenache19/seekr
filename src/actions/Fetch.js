import {Firebase} from '../config';
const {eventsRef, usersRef} = Firebase;

export const fetchUser = user => async dispatch => {
  usersRef.child(user.uid).on('value', snapshot => {
    if (snapshot.exists()) {
      dispatch({
        type: 'FETCH_USER',
        payload: snapshot.val(),
      });
    }
  });
};
export const getEventInfo = async eventId => {
  const snap = await eventsRef.child(`${eventId}/info`).once('value');
  if (snap.exists()) return snap.val();

  return null;
};

export const getEvent = async eventId => {
  const snap = await eventsRef.child(`${eventId}`).once('value');
  if (snap.exists()) return snap.val();

  return null;
};
