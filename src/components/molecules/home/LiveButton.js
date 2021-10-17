import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Card, Typography, Colors} from 'react-native-ui-lib';

import {ButtonWithTextIcon} from '_atoms';
import {Transitions, Service} from '_nav';
import {Interactions} from '_actions';

const {pushScreen} = Transitions;
const {createEvent} = Interactions;
class LiveButton extends PureComponent {
  constructor(props) {
    super(props);
    this.goToLive = this.goToLive.bind(this);
  }

  async goToLive() {
    const {uid} = this.props;

    try {
      const eventInfo = await createEvent(
        'Live now',
        new Date(),
        '',
        uid,
        'live',
      );

      if (Platform.OS === 'android') {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
            },
          );

          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
            },
          );
        } catch (e) {
          console.log(e);
        }
      }

      pushScreen(Service.instance.getScreenId(), 'Live', {
        eventInfo: eventInfo,
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Card
          row
          useNative
          enableShadow
          borderRadius={10}
          elevation={20}
          backgroundColor={'#840032'}
          activeScale={0.96}
          onPress={this.goToLive}
          style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={{paddingBottom: 20}}>
              <Text style={{...Typography.text40, color: Colors.white}}>
                Go live
              </Text>
              <Text style={{...Typography.text65L, color: Colors.white}}>
                Start selling now
              </Text>
            </View>

            <ButtonWithTextIcon
              text="Start Live"
              style={styles.button}
              containerStyle={styles.buttonContainer}
              textStyle={Typography.text60}
              iconType="Feather"
              iconName={'video'}
              iconSize={22}
              iconColor={'#000'}
              iconAfterText
            />
          </View>
        </Card>
      </View>
    );
  }
}

export default LiveButton;

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
  },
  button: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },

  largeText: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#FFF',
  },
  mediumText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#FFF',
  },
  smallText: {
    fontSize: 16,
    color: '#FFF',
  },
});
