import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { NodeCameraView } from 'react-native-nodemediaclient'
import { BlurView } from '@react-native-community/blur'
import LinearGradient from 'react-native-linear-gradient'
import FastImage from 'react-native-fast-image'
import { Colors, Typography } from 'react-native-ui-lib'

import { ButtonWithIcon, ButtonWithTextIcon, ButtonWithText } from '_atoms'
import { eventsRef } from '../../../config/firebase'

import { Interactions, ShareActions, HelperActions } from '_actions'

const { endEvent } = Interactions
const { share } = ShareActions
const { nFormatter } = HelperActions
class CameraSection extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isVideoOn: true,
      viewers: 0
    }

    this.toggleVideo = this.toggleVideo.bind(this)
    this.switchCamera = this.switchCamera.bind(this)
    this.endLive = this.endLive.bind(this)
    this.shareLive = this.shareLive.bind(this)
  }

  componentDidMount () {
    const { isPreview, eventInfo } = this.props

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

    if (!isPreview) this.vb.start()
  }

  toggleVideo () {
    const { isVideoOn } = this.state
    if (isVideoOn) {
      this.vb.stop()
      this.setState({ isVideoOn: false })
    } else {
      this.vb.start()
      this.setState({ isVideoOn: true })
    }
  }

  switchCamera () {
    this.vb.switchCamera()
  }

  async endLive () {
    const { eventInfo, userInfo } = this.props
    try {
      await endEvent(eventInfo, userInfo.uid)
      Navigation.popToRoot('HOME_STACK')
    } catch (e) {
      console.log('e', e)
    } finally {
    }
  }

  shareLive () {
    const { eventInfo } = this.props
    share(eventInfo)
  }

  render () {
    const { isVideoOn, viewers } = this.state
    const { isPreview, userInfo } = this.props
    const url = userInfo.stream.serverURL + userInfo.stream.streamKey

    return (
      <View style={styles.container}>
        <NodeCameraView
          style={{ height: '100%' }}
          ref={vb => {
            this.vb = vb
          }}
          outputUrl={url}
          camera={{ cameraId: 1, cameraFrontMirror: false }}
          audio={{ bitrate: 96000, profile: 1, samplerate: 44100 }}
          video={{
            preset: 2,
            bitrate: 500000,
            profile: 1,
            fps: 30,
            videoFrontMirror: false
          }}
          autopreview
        />

        <View style={styles.topActionsRow}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <View style={styles.imageContainer}>
              <FastImage
                source={{ uri: userInfo.imageURL }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                paddingLeft: 10,
                alignItems: 'flex-start'
              }}
            >
              <Text style={styles.text}>@{userInfo.username}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flex: 1
                }}
              >
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
                <ButtonWithTextIcon
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
                />
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
                iconName='eye'
                iconSize={16}
                iconColor='#FFF'
                style={{
                  backgroundColor:
                    isVideoOn && !isPreview ? '#FC5D83' : Colors.grey40,
                  borderRadius: 5,
                  paddingHorizontal: 5,
                  paddingVertical: 10
                }}
                text={
                  isVideoOn && !isPreview
                    ? `${nFormatter(viewers, 1)}   ● LIVE`
                    : `${nFormatter(viewers, 1)}   PREVIEW `
                }
                textStyle={{ paddingLeft: 5, ...styles.text }}
              />
              {/* <ButtonWithTextIcon
                iconType="Feather"
                iconName="eye"
                iconSize={16}
                iconColor="#FFF"
                style={{
                  marginLeft: 10,
                }}
                text={viewers}
                textStyle={{...styles.text, marginLeft: 5}}
              /> */}
            </View>
            <ButtonWithIcon
              iconType='Feather'
              iconName='x'
              iconSize={30}
              iconColor='#FFF'
              style={{
                // ...styles.button,
                marginLeft: 10
              }}
              onPress={this.endLive}
            />
          </View>
        </View>
        <View style={styles.bottomActionsRow}>
          {/* <View style={{flexDirection: 'row'}}>
            <ButtonWithTextIcon
              iconType="Feather"
              iconName="x"
              iconSize={20}
              iconColor="#000"
              style={styles.button}
              textStyle={{
                color: '#000',
                fontWeight: 'bold',
                fontSize: 18,
                marginLeft: 5,
              }}
              onPress={this.endLive}
              text="End Event"
            />
          </View> */}

          <View
            style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}
          >
            {/* <ButtonWithIcon
              iconType="Feather"
              iconName={isVideoOn ? 'video' : 'video-off'}
              iconSize={20}
              iconColor={'#000'}
              style={{
                ...styles.button,
                marginLeft: 10,
              }}
              onPress={this.toggleVideo}
            /> */}

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
      </View>
    )
  }
}

export default CameraSection

const styles = StyleSheet.create({
  container: {
    height: '65%',
    width: '100%',
    borderRadius: 10,
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
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden'
  },
  image: {
    ...StyleSheet.absoluteFill
  },
  endButton: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10
  }
})
