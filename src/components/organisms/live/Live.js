import React, {PureComponent} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {CommentsSection, CameraSection, LiveActionsSection} from '_molecules';

class LiveScreen extends PureComponent {
  render() {
    const {info, eventItem} = this.props;

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <CameraSection info={info} />
          <CommentsSection />
          <LiveActionsSection eventItem={eventItem} />
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
