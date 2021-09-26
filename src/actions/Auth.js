import {Firebase} from '../config';
const {eventsRef, usersRef, usernamesRef} = Firebase;

export const createUser = async userCredential => {
  const snap = await usersRef.child(userCredential.user.uid).once('value');

  if (snap.exists()) {
    const userFromFirebase = snap.val();
  } else {
    await usersRef.child(userCredential.user.uid).update({
      uid: userCredential.user.uid,
      info: {
        dateRegistered: new Date().getTime(),
        type: 'buyer',
        uid: userCredential.user.uid,
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

export const updateUsername = async (uid, username) => {
  await usersRef.child(`${uid}/info/username`).set(username);
  await usernamesRef.child(username).set(uid);
};

export const updateFinishOnboarding = async uid => {
  await usersRef.child(`${uid}/info/finishOnboarding`).set(true);
};

export const updateProfileImage = async (uid, imageURL) => {
  await usersRef.child(`${uid}/info/imageURL`).set(imageURL);
};

export const isUsernameAvailable = async username => {
  const snapshot = await usernamesRef.child(username).once('value');
  if (snapshot.exists()) {
    return false;
  }
  return true;
};
