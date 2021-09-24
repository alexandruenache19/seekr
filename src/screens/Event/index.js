import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {Transitions, Service} from '_nav';

class Onboarding extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return <SafeAreaView style={styles.safeContainer}></SafeAreaView>;
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
});

export default Onboarding;
