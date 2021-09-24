import database from '@react-native-firebase/database';

const databaseRef = database().ref();

export const usersRef = databaseRef.child('users');
export const eventsRef = databaseRef.child('events');
