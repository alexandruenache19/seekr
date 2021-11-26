import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, PermissionsAndroid } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { NodeCameraView } from 'react-native-nodemediaclient'

import LinearGradient from 'react-native-linear-gradient'
import FastImage from 'react-native-fast-image'
import { Colors, Typography, Dialog, PanningProvider } from 'react-native-ui-lib'

import { ButtonWithIcon, ButtonWithTextIcon, ButtonWithText } from '_atoms'
import { eventsRef, jointEventsRef } from '../../../config/firebase'

import { Interactions, ShareActions, HelperActions } from '_actions'

const { endEvent } = Interactions
const { share } = ShareActions
const { nFormatter } = HelperActions

class CameraSection extends PureComponent {
  constructor (props) {
    super(props)

    const { userInfo } = props
    let url = ''

    if (userInfo && userInfo.hasOwnProperty('stream')) {
      url = userInfo.stream.serverURL + userInfo.stream.streamKey
    }

    this.state = {
      isVideoOn: false,
      viewers: 0,
      showDialog: false,
      url: url,
      secondsRemaining: 0,
      isFlashEnabled: false,
      isPresentingNow: false,
      isPresentingNext: false
    }

    this.toggleVideo = this.toggleVideo.bind(this)
    this.switchCamera = this.switchCamera.bind(this)
    this.endLive = this.endLive.bind(this)
    this.shareLive = this.shareLive.bind(this)
    this.hideDialog = this.hideDialog.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.toggleFlashEnable = this.toggleFlashEnable.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  async componentDidMount () {
    const { isPreview, eventInfo, userInfo } = this.props
    const { isPresentingNext, isPresentingNow } = this.state

    this.productInfoListener = eventsRef
      .child(`${eventInfo.id}/info/viewers`)
      .on('value', async snapshot => {
        if (snapshot.exists()) {
          const viewers = snapshot.val()
          this.setState({
            viewers: viewers
          })
        }
      })

    this.currentUserListener = jointEventsRef
      .child(`${userInfo.currentJointEventId}/info/currentLiveUserId`)
      .on('value', async snapshot => {
        if (snapshot.exists()) {
          const currentLiveUserId = snapshot.val()

          if (currentLiveUserId === userInfo.uid) {
            this.setState({ isPresentingNow: true })
          } else {
            this.setState({ isPresentingNow: false })
          }
        }
      })

    this.nextUserListener = jointEventsRef
      .child(`${userInfo.currentJointEventId}/info/nextLiveUserId`)
      .on('value', async snapshot => {
        if (snapshot.exists()) {
          const nextLiveUserId = snapshot.val()
          if (nextLiveUserId === userInfo.uid) {
            this.setState({ isPresentingNext: true })
          } else {
            this.setState({ isPresentingNext: false })
          }
        }
      })

    this.secondsListener = jointEventsRef
      .child(`${userInfo.currentJointEventId}/info/secondsRemaining`)
      .on('value', async snapshot => {
        if (snapshot.exists()) {
          const secondsRemaining = snapshot.val()
          if (secondsRemaining === 0) {
            this.setState({ isPresentingNext: false })
          }
          this.setState({ secondsRemaining: secondsRemaining })
        }
      })
  }

  hideDialog () {
    this.setState({ showDialog: false })
  }

  showDialog () {
    this.setState({ showDialog: true })
  }

  toggleVideo () {
    const { isVideoOn } = this.state
    if (isVideoOn) {
      this.vb.stop()
    } else {
      this.vb.start()
    }
    this.setState({ isVideoOn: !isVideoOn })
  }

  async startLive () {
    await this.vb.start()
    this.setState({ isVideoOn: true })
  }

  toggleFlashEnable () {
    const { isFlashEnabled } = this.state
    this.vb.flashEnable(!isFlashEnabled)
    this.setState({ isFlashEnabled: !isFlashEnabled })
  }

  switchCamera () {
    this.vb.switchCamera()
  }

  async endLive () {
    const { eventInfo, userInfo } = this.props
    this.setState({ showDialog: false })
    try {
      await endEvent(eventInfo, userInfo.uid)
      Navigation.popToRoot('HOME_STACK')
    } catch (e) {
      console.log('e', e)
    }
  }

  goBack () {
    Navigation.popToRoot('HOME_STACK')
  }

  shareLive () {
    const { eventInfo } = this.props
    share(eventInfo.info)
  }

  render () {
    const {
      isVideoOn,
      viewers,
      showDialog,
      url,
      secondsRemaining,
      isPresentingNext,
      isFlashEnabled,
      isPresentingNow
    } = this.state
    const { isPreview, userInfo } = this.props

    if (url === '') {
      return (
        <View
          style={{
            ...styles.container,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{ ...Typography.text60 }}>
            Text us on whatsapp to become a seller
          </Text>
          <Text style={{ ...Typography.text40 }}>+4478567584593</Text>
        </View>
      )
    }
    if (userInfo) {
      return (
        <View style={styles.container}>
          <NodeCameraView
            style={{ height: '100%' }}
            ref={vb => {
              this.vb = vb
            }}
            outputUrl={url}
            camera={{ cameraId: 1, cameraFrontMirror: false }}
            audio={{ bitrate: 128000, profile: 1, samplerate: 48000 }}
            video={{
              preset: 2,
              bitrate: 800000,
              profile: 1,
              fps: 30,
              videoFrontMirror: false
            }}
            autopreview
          />
          {((!isPreview &&
            isPresentingNext &&
            secondsRemaining > 0 &&
            !isPresentingNow) ||
            (!isPresentingNow && !isPreview)) && (
            <View
              style={{
                ...styles.absolute,
                backgroundColor: 'rgba(255,255,255,0.6)',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ ...Typography.text70, color: '#000' }}>
                  You are presenting
              </Text>
              <Text
                style={{ ...Typography.text40, color: '#000', paddingTop: 20 }}
              >
                {!isPresentingNext
                  ? 'in a few minutes'
                  : `in ${secondsRemaining} seconds`}
              </Text>
            </View>
          )}

          <View style={styles.topActionsRow}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <ButtonWithIcon
                iconType='Feather'
                iconName='arrow-left'
                iconSize={28}
                iconColor='#FFF'
                onPress={this.goBack}
                style={{ marginRight: 5 }}
              />
              {/* <View style={styles.imageContainer}>
                <FastImage
                  source={{ uri: userInfo.imageURL }}
                  style={styles.image}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View> */}
              <View
                style={{
                  justifyContent: 'space-between',
                  paddingLeft: 10,
                  alignItems: 'flex-start'
                }}
              >
                {/* <Text style={styles.text}>@{userInfo.username}</Text> */}
                <View style={styles.fullRow}>
                  {/* <ButtonWithTextIcon
                    iconType="Feather"
                    iconName="plus"
                    iconSize={16}
                    iconColor="#000"
                    style={{
                      backgroundColor: '#FFF',
                      borderRadius: 5,
                      padding: 3,
                    }}
                    text={'Follow'}
                    textStyle={{...styles.text, color: '#000'}}
                  /> */}
                  {/* <ButtonWithTextIcon
                    iconType='Feather'
                    iconName='send'
                    iconSize={16}
                    iconColor='#000'
                    style={{
                      backgroundColor: '#FFF',
                      borderRadius: 5,
                      padding: 2
                    }}
                    text='Share'
                    textStyle={{ ...styles.text, color: '#000', paddingRight: 2 }}
                    onPress={this.shareLive}
                    iconAfterText
                  /> */}
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 2,
                  height: '100%'
                }}
              >
                <ButtonWithTextIcon
                  iconType='Feather'
                  iconName='send'
                  iconSize={16}
                  iconColor='#000'
                  style={{
                    backgroundColor: '#FFF',
                    borderRadius: 10,
                    padding: 8,
                    marginRight: 8
                  }}
                  text='SHARE'
                  textStyle={{ paddingLeft: 5, ...styles.text, color: '#000' }}
                  onPress={this.shareLive}
                // iconAfterText
                />
                <ButtonWithTextIcon
                  iconType='Feather'
                  iconName='eye'
                  iconSize={16}
                  iconColor='#FFF'
                  style={{
                    backgroundColor:
                      isVideoOn && !isPreview ? '#FC5D83' : Colors.grey40,
                    borderRadius: 10,
                    paddingHorizontal: 8,
                    paddingVertical: 8
                  }}
                  text={
                    isVideoOn && !isPreview
                      ? `${viewers > 200 ? '200+' : nFormatter(viewers, 1)} ● LIVE`
                      : `${viewers > 200 ? '200+' : nFormatter(viewers, 1)} PREVIEW `
                  }
                  textStyle={{ paddingLeft: 5, ...styles.text }}
                />
              </View>
            </View>
          </View>
          <View style={styles.bottomActionsRow}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1
              }}
            >
              {/*  <ButtonWithTextIcon
                  iconType="Feather"
                  iconName={isVideoOn ? 'video-off' : 'video'}
                  iconSize={20}
                  iconColor="#000"
                  style={{
                    ...styles.button,
                  }}
                  textStyle={{paddingRight: 5}}
                  iconAfterText
                  text={isVideoOn ? 'Stop' : 'Start'}
                  onPress={this.toggleVideo}
                /> */}

              {/* <ButtonWithIcon
                iconType="MaterialCommunityIcons"
                iconName={
                  isFlashEnabled ? 'lightbulb-off-outline' : 'lightbulb-outline'
                }
                iconSize={20}
                iconColor="#000"
                style={{
                  ...styles.button,
                  marginLeft: 10,
                }}
                onPress={this.toggleFlashEnable}
              /> */}
              {isVideoOn && !isPreview ? (
                <ButtonWithText
                  text='End Live'
                  textStyle={{ ...Typography.text80, fontWeight: 'bold' }}
                  style={styles.button}
                  onPress={this.showDialog}
                />
              ) : (
                <ButtonWithText
                  text=''
                  textStyle={{ ...Typography.text80, fontWeight: 'bold' }}
                  style={{ backgroundColor: 'transparent' }}
                  onPress={() => null}
                />
              )}
              <ButtonWithIcon
                iconType='Feather'
                iconName='repeat'
                iconSize={20}
                iconColor='#000'
                style={{
                  ...styles.button,
                  marginLeft: 10
                }}
                onPress={this.switchCamera}
              />
            </View>
          </View>
          <Dialog
            migrate
            useSafeArea
            ignoreBackgroundPress
            key='dialog-key'
            bottom
            height={200}
            panDirection={PanningProvider.Directions.DOWN}
            containerStyle={{
              backgroundColor: '#FFF',
              borderRadius: 12,
              marginBottom: 20,
              padding: 20,
              justifyContent: 'space-between'
            }}
            visible={showDialog}
            onDismiss={this.hideDialog}
          >
            <Text style={Typography.text50}>
              Do you want to end this event?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}
            >
              <ButtonWithText
                style={{
                  ...styles.button,
                  backgroundColor: Colors.grey40,
                  width: 70,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                textStyle={{ ...Typography.text50, color: '#FFF' }}
                onPress={this.endLive}
                text='Yes'
              />

              <ButtonWithText
                style={{
                  ...styles.button,
                  backgroundColor: Colors.grey40,
                  width: 70,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                textStyle={{ ...Typography.text50, color: '#FFF' }}
                onPress={this.hideDialog}
                text='No'
              />
            </View>
            <View />
          </Dialog>
        </View>
      )
    }

    return <View />
  }
}

export default CameraSection

const styles = StyleSheet.create({
  container: {
    // height: '65%',
    flex: 1,
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#999',
    overflow: 'hidden'
  },
  topActionsRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  button: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10
  },
  bottomActionsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10
  },
  text: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold'
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 10
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  imageContainer: {
    height: 36,
    width: 36,
    borderRadius: 18,
    overflow: 'hidden'
  },
  image: {
    ...StyleSheet.absoluteFill
  },
  endButton: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10
  },
  fullRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  }
})
