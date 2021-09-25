import React, {PureComponent} from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';

import {Transitions} from './src/navigation';
import {DotIndicator} from 'react-native-indicators';
import auth from '@react-native-firebase/auth';

const {goToApp, goToOnboarding} = Transitions;
// const isDarkMode = useColorScheme() === 'dark';

class App extends PureComponent {
  async componentDidMount() {
    const user = await auth().currentUser;
    goToOnboarding();

    // if (!user) {
    //   goToOnboarding();
    // } else {
    //   goToApp();
    // }
  }

  render() {
    return (
      <View style={{height: '100%'}}>
        <DotIndicator size={8} color="black" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
