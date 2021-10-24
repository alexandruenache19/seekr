import React, { PureComponent } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Pressable
} from 'react-native'
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient'
import Video from 'react-native-video'
import { Card, Typography, Colors } from 'react-native-ui-lib'

import { ButtonWithTextIcon, ButtonWithIcon, ButtonWithText, Icon } from '_atoms'
import { Transitions, Service } from '_nav'
import { ShareActions, FetchingActions } from '_actions'

import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-toast-message'
import { Firebase } from '../../../config'

const { getEvent } = FetchingActions
const { pushScreen } = Transitions
const { shareOnFB, share } = ShareActions

class EventCard extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      eventInfo: null,
      loading: true,
      currency: '',
      totalRevenue: 0
    }
    this.goToLive = this.goToLive.bind(this)
    this.goToOrders = this.goToOrders.bind(this)
    this.shareOnFb = this.shareOnFb.bind(this)
    this.share = this.share.bind(this)
    this.copy = this.copy.bind(this)
  }

  async componentDidMount () {
    const { eventId } = this.props

    const eventInfo = await getEvent(eventId)

    if (eventInfo) {
      let totalRevenue = 0
      let currency = ''
      /** calculate total revenue */
      if (eventInfo.info.status === 'ended' && eventInfo.orders) {
        console.log('event', eventInfo.orders)
        for (const orderKey in eventInfo.orders) {
          const order = eventInfo.orders[orderKey]
          let revenue = 0
          const { products } = order

          for (const key in products) {
            const product = products[key]
            revenue += product.priceToPay || 0
            currency = product.currency
          }

          order.revenue = revenue
          order.currency = currency
          totalRevenue += revenue
        }
      }
      // console.log('totalRev', totalRevenue)
      this.setState({
        totalRevenue: totalRevenue,
        currency: currency,
        loading: false,
        eventInfo: eventInfo
      })
    }
  }

  shareOnFb () {
    const { eventInfo } = this.state
    shareOnFB(eventInfo.info)
  }

  share () {
    const { eventInfo } = this.state
    share(eventInfo.info)
  }

  goToOrders () {
    const { eventInfo } = this.state

    pushScreen(Service.instance.getScreenId(), 'Orders', {
      eventInfo: eventInfo
    })
  }

  async goToLive () {
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

  async copy () {
    const { eventInfo } = this.state
    const usernameSnap = await Firebase.usersRef
      .child(eventInfo.info.sellerId)
      .child('info')
      .child('username')
      .once('value')
    const username = usernameSnap.val()

    if (username) {
      Clipboard.setString(`https://seekrlive.com/${username}`)
    } else {
      Clipboard.setString(`https://seekrlive.com/e/${eventInfo.id}`)
    }

    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: 'Coppied to your clipboard',
      position: 'bottom'
    })
  }

  render () {
    const { eventInfo, loading, totalRevenue, currency } = this.state

    if (!eventInfo || loading) {
      return (
        <Card
          // useNative
          enableShadow
          enableBlur
          borderRadius={10}
          elevation={20}
          activeScale={0.96}
          backgroundColor={Colors.grey40}
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
        activeOpacity={1}
        enableBlur
        borderRadius={10}
        elevation={20}
        onPress={info.status !== 'ended' ? this.goToLive : this.goToOrders}
        activeScale={0.96}
        backgroundColor={info.status !== 'ended' ? '#2A9D8F' : '#E76F51'}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          {info.videoURL && info.videoURL !== '' ? (
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
          ) : null}
          {info.status !== 'ended' ? (
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
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
          ) : null}
          {info.status !== 'ended' ? (
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.mediumText}>{info.title}</Text>
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
            </LinearGradient>
          ) : null}
          {info.status === 'ended' ? (
            <View
              style={{
                ...StyleSheet.absoluteFill,
                backgroundColor: 'rgba(0,0,0,0.7)',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: 20
              }}
            >
              {/* <ButtonWithText
                text='placeholder'
                onPress={() => null}
                textStyle={{ ...Typography.text60, color: 'transparent' }}
                style={{
                  paddingVertical: 8,
                  backgroundColor: 'transparent',
                  width: '100%'
                }}
              /> */}
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={{ ...styles.mediumText }}>{info.title}</Text>
                <ButtonWithTextIcon
                  text={`Ended ${month}, ${day}`}
                  onPress={this.goToOrders}
                  style={{ marginTop: 10 }}
                  textStyle={{ ...Typography.text60L, color: Colors.white, marginLeft: 8 }}
                  iconType='FontAwesome'
                  iconName='hourglass-end'
                  iconColor='#FFF'
                  iconSize={14}
                />
                {totalRevenue && totalRevenue > 0 ? (
                  <Text style={{ ...styles.mediumText, marginTop: 10 }}>{totalRevenue} {currency}</Text>
                ) : null}
              </View>
              <Pressable onPress={this.goToOrders} style={{ width: '100%' }}>
                <LinearGradient
                  colors={['#6A4087', '#C94573']}
                  // start={{ x: 0, y: 0 }}
                  // end={{ x: 0, y: 1 }}
                  useAngle
                  angle={270}
                  angleCenter={{ x: 0.7, y: 0.5 }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: '#FFF',
                    alignItems: 'center',
                    borderRadius: 10,
                    width: '100%'
                  }}
                >
                  <Text style={{ ...Typography.text60, color: Colors.white }}>View Orders</Text>
                </LinearGradient>
              </Pressable>
              {/* {eventInfo && eventInfo.orders ? (
                <Pressable onPress={this.goToOrders} style={{ width: '100%' }}>
                  <LinearGradient
                    colors={['#6A4087', '#C94573']}
                    // start={{ x: 0, y: 0 }}
                    // end={{ x: 0, y: 1 }}
                    useAngle
                    angle={270}
                    angleCenter={{ x: 0.7, y: 0.5 }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      backgroundColor: '#FFF',
                      alignItems: 'center',
                      borderRadius: 10,
                      width: '100%'
                    }}
                  >
                    <Text style={{ ...Typography.text60, color: Colors.white }}>View Orders</Text>
                  </LinearGradient>
                </Pressable>
              ) : (
                <ButtonWithText
                  text='placeholder'
                  onPress={() => null}
                  textStyle={{ ...Typography.text60, color: 'transparent' }}
                  style={{
                    paddingVertical: 8,
                    backgroundColor: 'transparent',
                    width: '100%'
                  }}
                />
              )} */}
              {/* <ButtonWithText
                text='View Orders'
                onPress={this.goToOrders}
                textStyle={{ ...Typography.text60 }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: '#FFF',
                  alignItems: 'center',
                  borderRadius: 10,
                  width: '100%'
                }}
              /> */}
            </View>
          ) : null}
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
