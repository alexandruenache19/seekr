import React, { PureComponent } from 'react'
import { View, SafeAreaView, StyleSheet } from 'react-native'
import { CameraSection, PreviewActionsSection } from '_molecules'

class PreviewScreen extends PureComponent {
  render() {
    const { userInfo, eventInfo } = this.props
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <CameraSection eventInfo={eventInfo} isPreview userInfo={userInfo} />
          <PreviewActionsSection
            callback={this.props.onGoLive}
            userInfo={userInfo}
            eventInfo={eventInfo}
          />
        </View>
      </SafeAreaView>
    )
  }
}

export default PreviewScreen

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  }
})
