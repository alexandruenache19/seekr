import {combineReducers} from 'redux';
import {reducer as network} from 'react-native-offline';

import AuthReducer from './AuthReducer';

export const allReducers = combineReducers({
  user: AuthReducer,
  network: network,
});
