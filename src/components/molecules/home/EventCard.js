import React, { PureComponent } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform
} from 'react-native'
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient'
import Video from 'react-native-video'
import { Card, Typography } from 'react-native-ui-lib'

import { ButtonWithTextIcon, ButtonWithIcon, ButtonWithText } from '_atoms'
import { Transitions, Service } from '_nav'
import { ShareActions, FetchingActions } from '_actions'

import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-toast-message'

const { getEvent } = FetchingActions
const { pushScreen } = Transitions
const { shareOnFB, share } = ShareActions

class EventCard extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      eventInfo: null,
      loading: true
    }
    this.goToLive = this.goToLive.bind(this)
    this.goToOrders = this.goToOrders.bind(this)
    this.shareOnFb = this.shareOnFb.bind(this)
    this.share = this.share.bind(this)
    this.copy = this.copy.bind(this)
  }

  async componentDidMount() {
    const { eventId } = this.props

    const eventInfo = await getEvent(eventId)

    if (eventInfo) {
      this.setState({
        loading: false,
        eventInfo: eventInfo
      })
    }
  }

  shareOnFb() {
    const { eventInfo } = this.state
    shareOnFB(eventInfo.info)
  }

  share() {
    const { eventInfo } = this.state
    share(eventInfo.info)
  }

  goToOrders() {
    const { eventInfo } = this.state

    pushScreen(Service.instance.getScreenId(), 'Orders', {
      eventInfo: eventInfo
    })
  }

  async goToLive() {
    const { eventInfo } = this.state
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          ],
          {
            title: 'Cool Photo App Camera And Microphone Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          pushScreen(Service.instance.getScreenId(), 'Live', {
            eventInfo: eventInfo
          })
        } else {
          pushScreen(Service.instance.getScreenId(), 'Live', {
            eventInfo: eventInfo
          })
          console.log('Camera permission denied')
        }
      } else {
        pushScreen(Service.instance.getScreenId(), 'Live', {
          eventInfo: eventInfo
        })
      }
    } catch (err) {
      console.warn(err)
    }
  }

  copy() {
    const { eventInfo } = this.state
    // this.setState({copied: true});
    Clipboard.setString(`https://seekrlive.com/e/${eventInfo.id}`)
    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: 'Coppied to your clipboard',
      position: 'bottom'
    })
  }

  render() {
    const { eventInfo, loading } = this.state

    if (!eventInfo || loading) {
      return (
        <Card
          // useNative
          enableShadow
          enableBlur
          borderRadius={10}
          elevation={20}
          activeScale={0.96}
          style={styles.container}
        >
          <View style={styles.innerContainer} />
        </Card>
      )
    }

    const { info } = eventInfo
    const formatTime = moment(info.timestamp).format('HH:mm A')
    const day = moment(info.timestamp).format('DD')
    const month = moment(info.timestamp).format('MMM')

    return (
      <Card
        // useNative
        enableShadow
        enableBlur
        borderRadius={10}
        elevation={20}
        onPress={info.status !== 'ended' ? this.goToLive : this.goToOrders}
        activeScale={0.96}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          {info.videoURL !== '' && (
            <Video
              source={{
                uri: info.videoURL
              }}
              ref={ref => (this.player = ref)}
              style={styles.video}
              resizeMode='cover'
              muted
              repeat
            />
          )}

          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <View>
                <Text style={styles.largeText}>{day}</Text>
                <Text style={styles.mediumText}>{month}</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#FFF',
                  borderRadius: 10,
                  padding: 10
                }}
              >
                <Text style={{ ...styles.smallText, color: '#000' }}>
                  {formatTime}
                </Text>
              </View>
            </View>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.mediumText}>{info.title}</Text>
            {info.status !== 'ended' && (
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <ButtonWithTextIcon
                  onPress={this.copy}
                  text='Copy link'
                  style={{
                    ...styles.button,
                    flex: 1,
                    marginRight: 10
                  }}
                  containerStyle={styles.buttonContainer}
                  textStyle={Typography.text80H}
                  iconType='Feather'
                  iconName='link'
                  iconSize={17}
                  iconColor='#000'
                  iconAfterText
                />

                <ButtonWithIcon
                  onPress={this.share}
                  style={styles.button}
                  containerStyle={styles.buttonContainer}
                  iconType='Feather'
                  iconName='send'
                  iconSize={20}
                  iconColor='#000'
                />
              </View>
            )}
          </LinearGradient>
        </View>
      </Card>
    )
  }
}

export default EventCard

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: 400,
    width: 260
  },
  button: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 10
  },
  buttonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  gradient: {
    padding: 20
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'stretch'
  },
  largeText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#FFF'
  },
  mediumText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#FFF'
  },
  smallText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000'
  }
})
