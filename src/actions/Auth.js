import {Firebase} from '../config';
const {eventsRef, usersRef} = Firebase;

export const createUser = async userCredential => {
  const snap = await usersRef.child(userCredential.user.uid).once('value');

  if (snap.exists()) {
    const userFromFirebase = snap.val();
  } else {
    await usersRef.child(userCredential.user.uid).update({
      uid: userCredential.user.uid,
      info: {
        dateRegistered: new Date().getTime(),
      },
      finishOnboarding: false,
    });
  }
};

export const updateLocation = async (uid, coords, address) => {
  await usersRef.child(`${uid}/info/location`).set({
    coords: coords,
    address: address,
  });
};

export const updateName = async (uid, firstName, lastName) => {
  await usersRef.child(`${uid}/info/name`).set(firstName + ' ' + lastName);
  await usersRef.child(`${uid}/info/fullName`).set({
    firstName: firstName,
    lastName: lastName,
  });
};

export const updateFinishOnboarding = async uid => {
  await usersRef.child(`${uid}/info/finishOnboarding`).set(true);
};
