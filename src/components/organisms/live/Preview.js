import React, {PureComponent} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {
  LiveCameraSection,
  PreviewActionsSection,
  ShareSection,
} from '_molecules';

class LiveScreen extends PureComponent {
  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <LiveCameraSection />
          <ShareSection />
          <PreviewActionsSection />
        </View>
      </SafeAreaView>
    );
  }
}

export default LiveScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
});
