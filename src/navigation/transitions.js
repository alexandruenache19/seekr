import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Platform} from 'react-native';
import auth from '@react-native-firebase/auth';

import {store} from '../redux/store';
import {Service} from '_nav';
import {FetchingActions} from '_actions';

import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {fetchUser} = FetchingActions;
const selectedColor = '#000000';
const unSelectedColor = '#ADADAD';
const iconColor = '#E7E7E7';

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
  return Promise.all([
    Feather.getImageSource('home', 31, unSelectedColor),
    Feather.getImageSource('home', 31, selectedColor),
    Feather.getImageSource('plus', 28, unSelectedColor),
    Feather.getImageSource('plus', 28, selectedColor),
    Entypo.getImageSource('grid', 31, unSelectedColor),
    Entypo.getImageSource('grid', 31, selectedColor),
    Feather.getImageSource('radio', 31, unSelectedColor),
    Feather.getImageSource('radio', 31, selectedColor),
  ]).then(
    ([
      homeIcon,
      homeIconSelected,
      plusIcon,
      plusIconSelected,
      userIcon,
      userIconSelected,
      broadcastIcon,
      broadcastIconSelected,
    ]) => {
      Navigation.setRoot({
        root: {
          bottomTabs: {
            children: [
              {
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
                  options: {
                    bottomTab: {
                      animate: true,
                      icon: homeIcon,
                      selectedIcon: homeIconSelected,
                      titleDisplayMode: 'alwaysHide',
                    },
                  },
                },
              },
              {
                stack: {
                  id: 'EVENT_STACK',
                  children: [
                    {
                      component: {
                        id: 'event',
                        name: 'Event',
                      },
                    },
                  ],
                  options: {
                    bottomTab: {
                      animate: true,
                      icon: broadcastIcon,
                      selectedIcon: broadcastIconSelected,
                      titleDisplayMode: 'alwaysHide',
                    },
                  },
                },
              },
              {
                stack: {
                  id: 'ADD_STACK',
                  children: [
                    {
                      component: {
                        id: 'addProduct',
                        name: 'AddProduct',
                      },
                    },
                  ],
                  options: {
                    bottomTab: {
                      animate: true,
                      icon: plusIcon,
                      // iconColor: iconColor,
                      selectedIcon: plusIconSelected,
                      titleDisplayMode: 'alwaysHide',
                    },
                  },
                },
              },
              {
                stack: {
                  id: 'PROFILE_STACK',
                  children: [
                    {
                      component: {
                        id: 'profile',
                        name: 'Profile',
                      },
                    },
                  ],
                  options: {
                    bottomTab: {
                      animate: true,
                      icon: userIcon,
                      // iconColor: iconColor,
                      selectedIcon: userIconSelected,
                      titleDisplayMode: 'alwaysHide',
                    },
                  },
                },
              },
            ],
          },
        },
      });
    },
  );
  // Navigation.setRoot({
  //   root: {
  //     stack: {
  //       id: 'HOME_STACK',
  //       children: [
  //         {
  //           component: {
  //             id: 'home',
  //             name: 'Home',
  //           },
  //         },
  //       ],
  //     },
  //   },
  // });
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
