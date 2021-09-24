// redux components
import {createStore, applyMiddleware} from 'redux';
import reduxThunk from 'redux-thunk';
import {allReducers} from './reducers/index';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['network'],
};

const persistedReducer = persistReducer(persistConfig, allReducers);

export const store = createStore(
  persistedReducer,
  {},
  applyMiddleware(reduxThunk),
);

export const persistor = persistStore(store);
