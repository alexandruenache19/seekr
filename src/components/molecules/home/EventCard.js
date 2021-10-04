import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import {Card, Typography} from 'react-native-ui-lib';

import {ButtonWithTextIcon, ButtonWithIcon} from '_atoms';
import {Transitions, Service} from '_nav';
import {ShareActions} from '_actions';

const {pushScreen} = Transitions;
const {shareOnFB, share} = ShareActions;

class EventCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.goToLive = this.goToLive.bind(this);
    this.shareOnFb = this.shareOnFb.bind(this);
    this.share = this.share.bind(this);
  }

  shareOnFb() {
    const {item} = this.props;
    shareOnFB(item.info);
  }

  share() {
    const {item} = this.props;
    share(item.info);
  }

  async goToLive() {
    const {item} = this.props;
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ],
          {
            title: 'Cool Photo App Camera And Microphone Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          pushScreen(Service.instance.getScreenId(), 'Live', {
            eventInfo: item,
          });
        } else {
          pushScreen(Service.instance.getScreenId(), 'Live', {
            eventInfo: item,
          });
          console.log('Camera permission denied');
        }
      } else {
        pushScreen(Service.instance.getScreenId(), 'Live', {
          eventInfo: item,
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    const {item} = this.props;
    const {info} = item;
    const day = moment(info.timestamp).format('DD');
    const month = moment(info.timestamp).format('MMM');
    const formatTime = moment(info.timestamp).format('HH:mm A');

    return (
      <Card
        // useNative
        enableShadow
        enableBlur
        borderRadius={10}
        elevation={20}
        onPress={this.goToLive}
        activeScale={0.96}
        style={styles.container}>
        <View style={styles.innerContainer}>
          {info.videoURL !== '' && (
            <Video
              source={{
                uri: info.videoURL,
              }}
              ref={ref => (this.player = ref)}
              style={styles.video}
              resizeMode={'cover'}
              muted={true}
              repeat={true}
            />
          )}

          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.gradient}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
              <View>
                <Text style={styles.largeText}>{day}</Text>
                <Text style={styles.mediumText}>{month}</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#FFF',
                  borderRadius: 10,
                  padding: 10,
                }}>
                <Text style={{...styles.smallText, color: '#000'}}>
                  {formatTime}
                </Text>
              </View>
            </View>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']}
            start={{x: 0, y: 1}}
            end={{x: 0, y: 0}}
            style={styles.gradient}>
            <Text style={styles.mediumText}>{info.title}</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <ButtonWithTextIcon
                onPress={this.shareOnFb}
                text="Post on Facebook"
                style={styles.button}
                containerStyle={styles.buttonContainer}
                textStyle={Typography.text80H}
                iconType="Feather"
                iconName={'facebook'}
                iconSize={20}
                iconColor={'#000'}
                iconAfterText
              />

              <ButtonWithIcon
                onPress={this.share}
                style={styles.button}
                containerStyle={styles.buttonContainer}
                iconType="Feather"
                iconName={'send'}
                iconSize={20}
                iconColor={'#000'}
              />
            </View>
          </LinearGradient>
        </View>
      </Card>
    );
  }
}

export default EventCard;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: 400,
    width: 260,
  },
  button: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  gradient: {
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'stretch',
  },
  largeText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#FFF',
  },
  mediumText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#FFF',
  },
  smallText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
});
