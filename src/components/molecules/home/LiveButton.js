import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Card, Typography, Colors} from 'react-native-ui-lib';

import {ButtonWithTextIcon} from '_atoms';
import {Transitions, Service} from '_nav';

const {pushScreen} = Transitions;

class LiveButton extends PureComponent {
  constructor(props) {
    super(props);
    this.goToLive = this.goToLive.bind(this);
  }

  async goToLive() {
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
          pushScreen(Service.instance.getScreenId(), 'Live');
        } else {
          pushScreen(Service.instance.getScreenId(), 'Live');
          console.log('Camera permission denied');
        }
      } else {
        pushScreen(Service.instance.getScreenId(), 'Live');
      }
    } catch (err) {
      console.warn(err);
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
          backgroundColor={'#F85351'}
          activeScale={0.96}
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
              onPress={this.goToLive}
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
    paddingVertical: 10,
    paddingHorizontal: 20,
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
