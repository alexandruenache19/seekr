import 'react-native-gesture-handler';
import {Navigation} from 'react-native-navigation';
import App from './App';
import {registerScreens} from './src/navigation/screen-registry';
import {Service} from '_nav';

Navigation.events().registerComponentDidAppearListener(data => {
  Service.instance.setScreenData(data);
});

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    layout: {
      orientation: ['portrait'],
    },
    statusBar: {
      visible: false,
    },
    topBar: {
      visible: false,
    },
  });

  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'AppContainer',
              options: {
                statusBar: {
                  visible: false,
                },
              },
            },
          },
        ],
      },
    },
  });
});
