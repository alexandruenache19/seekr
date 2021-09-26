import {Firebase} from '../config';
const {eventsRef, usersRef} = Firebase;

export const fetchUser = user => async dispatch => {
  if (user) {
    // try {
    //   await analytics.identify(user.uid, {
    //     email: user.email,
    //     $onesignal_user_id: user.uid,
    //   });
    // } catch (e) {}
    await usersRef.child(user.uid).on('value', snapshot => {
      if (snapshot.exists()) {
        dispatch({
          type: 'FETCH_USER',
          payload: snapshot.val(),
        });
      }
    });
  }
};
export const getEventInfo = async eventId => {
  const snap = await eventsRef.child(`${eventId}/info`).once('value');
  if (snap.exists()) return snap.val();

  return null;
};