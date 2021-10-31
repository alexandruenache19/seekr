import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {ReduxNetworkProvider} from 'react-native-offline';
import {store, persistor} from '../redux/store';
import {View} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
// Main screens
import App from '../../App';
import Home from '../screens/Home';
import Onboarding from '../screens/Onboarding';
import Live from '../screens/Live';
import CreateEvent from '../screens/CreateEvent';
import Record from '../screens/Record';
import Orders from '../screens/Orders';
import TakePic from '../screens/TakePic';
import AddProduct from '../screens/AddProduct';
import Profile from '../screens/Profile';

export const ReduxProvider = Component => {
  return props => (
    <Provider store={store}>
      <PersistGate
        loading={<View style={{flex: 1, width: '100%'}} />}
        persistor={persistor}>
        <ReduxNetworkProvider>
          <Component {...props} />
        </ReduxNetworkProvider>
      </PersistGate>
    </Provider>
  );
};

export const registerScreens = () => {
  Navigation.registerComponent(
    'AppContainer',
    () => App,
    () => App,
  );
  Navigation.registerComponent(
    'Home',
    () => gestureHandlerRootHOC(ReduxProvider(Home)),
    () => gestureHandlerRootHOC(Home),
  );
  Navigation.registerComponent(
    'Onboarding',
    () => ReduxProvider(Onboarding),
    () => Onboarding,
  );
  Navigation.registerComponent(
    'Live',
    () => gestureHandlerRootHOC(ReduxProvider(Live)),
    () => gestureHandlerRootHOC(Live),
  );
  Navigation.registerComponent(
    'CreateEvent',
    () => ReduxProvider(CreateEvent),
    () => CreateEvent,
  );
  Navigation.registerComponent(
    'Record',
    () => gestureHandlerRootHOC(ReduxProvider(Record)),
    () => gestureHandlerRootHOC(Record),
  );

  Navigation.registerComponent(
    'Orders',
    () => gestureHandlerRootHOC(ReduxProvider(Orders)),
    () => gestureHandlerRootHOC(Orders),
  );
  Navigation.registerComponent(
    'AddProduct',
    () => gestureHandlerRootHOC(ReduxProvider(AddProduct)),
    () => gestureHandlerRootHOC(AddProduct),
  );

  Navigation.registerComponent(
    'TakePic',
    () => gestureHandlerRootHOC(ReduxProvider(TakePic)),
    () => gestureHandlerRootHOC(TakePic),
  );
  Navigation.registerComponent(
    'Profile',
    () => gestureHandlerRootHOC(ReduxProvider(Profile)),
    () => gestureHandlerRootHOC(Profile),
  );
};
