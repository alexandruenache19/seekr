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
import {Card, Button} from 'react-native-ui-lib';

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
          onPress={this.goToLive}
          backgroundColor={'#F85351'}
          activeScale={0.96}>
          <View style={styles.button}>
            <View>
              <Text style={styles.text}>Go Live</Text>
            </View>
            <FontAwesome name={'video-camera'} color={'#FFF'} size={36} />
          </View>
        </Card>
      </View>
    );
  }
}

export default LiveButton;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    zIndex: 3,
  },
  button: {
    padding: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#FFF',
  },
});
