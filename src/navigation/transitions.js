import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Platform} from 'react-native';
import auth from '@react-native-firebase/auth';

import {store} from '../redux/store';
import {Service} from '_nav';
import {FetchingActions} from '_actions';

const {fetchUser} = FetchingActions;

export const goToApp = async (passProps = {}) => {
  const currentUser = await auth().currentUser;

  await store.dispatch(fetchUser(currentUser));
  await Navigation.setDefaultOptions({
    layout: {
      orientation: ['portrait'],
      backgroundColor: '#FFF',
      componentBackgroundColor: '#FFF',
    },
    statusBar: {
      style: 'dark',
      backgroundColor: '#FFF',
    },
    topBar: {
      visible: false,
    },
  });

  Navigation.setRoot({
    root: {
      stack: {
        id: 'HOME_STACK',
        children: [
          {
            component: {
              id: 'home',
              name: 'Home',
            },
          },
        ],
      },
    },
  });
};

export const goToOnboarding = async (passProps = {}) => {
  await Navigation.setDefaultOptions({
    layout: {
      orientation: ['portrait'],
      backgroundColor: '#FFF',
      componentBackgroundColor: '#FFF',
    },
    statusBar: {
      style: 'dark',
      backgroundColor: '#FFF',
    },
    topBar: {
      visible: false,
    },
  });
  Navigation.setRoot({
    root: {
      stack: {
        id: 'ONBOARDING_STACK',
        children: [
          {
            component: {
              id: 'onboarding',
              name: 'Onboarding',
            },
          },
        ],
      },
    },
  });
};

export const goToOffline = () =>
  Navigation.setRoot({
    root: {
      component: {
        id: 'offline',
        name: 'Offline',
      },
    },
  });

export const pushScreen = async (
  stackId,
  componentId,
  props,
  otherOptions = {},
) => {
  Navigation.push(stackId, {
    component: {
      name: componentId,
      passProps: props,
      options: {
        ...otherOptions,
      },
    },
  });
};

// export const showOverlay = async (stackId, componentId, props, otherOptions = {}) => {
//   Navigation.showOverlay({
//     component: {
//       name: componentId,
//       id: componentId,
//       passProps: props,
//       options: {
//         ...otherOptions
//       }
//     }
//   })
// }

export const openModal = (
  componentId,
  componentName,
  passProps,
  otherOptions = {},
) =>
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            id: componentId,
            name: componentName,
            passProps: passProps,
            options: {
              layout: {
                orientation: ['portrait'],
              },
              statusBar: {
                drawBehind: true,
                visible: false,
              },
              ...otherOptions,
            },
          },
        },
      ],
    },
  });
