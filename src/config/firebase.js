import database from '@react-native-firebase/database';

export const databaseRef = database().ref();

export const usersRef = databaseRef.child('users');
export const eventsRef = databaseRef.child('events');
export const usernamesRef = databaseRef.child('usernames');
export const jointEventsRef = databaseRef.child('joint-events');
