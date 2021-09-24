import React, {PureComponent} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import {Card} from 'react-native-ui-lib';

import {Transitions, Service} from '_nav';

const {pushScreen} = Transitions;

class EventCard extends PureComponent {
  constructor(props) {
    super(props);
    this.goToEvent = this.goToEvent.bind(this);
  }

  goToEvent() {
    pushScreen(Service.instance.getScreenId(), 'Event');
  }

  render() {
    const {item} = this.props;
    return (
      <Card
        useNative
        enableShadow
        enableBlur
        borderRadius={10}
        elevation={20}
        onPress={this.goToEvent}
        activeScale={0.96}
        style={styles.container}>
        <View style={styles.innerContainer}>
          <Video
            source={{
              uri: item.videoURL,
            }} // Can be a URL or a local file.
            ref={ref => {
              this.player = ref;
            }} // Store reference
            // onBuffer={this.onBuffer} // Callback when remote video is buffering
            // onError={this.videoError} // Callback when video cannot be loaded
            style={styles.video}
            resizeMode={'cover'}
            muted={true}
            repeat={true}
          />
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
                <Text style={styles.largeText}>{item.day}</Text>
                <Text style={styles.mediumText}>{item.month}</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#FFF',
                  borderRadius: 10,
                  padding: 10,
                }}>
                <Text style={{...styles.smallText, color: '#000'}}>
                  {item.time}
                </Text>
              </View>
            </View>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']}
            start={{x: 0, y: 1}}
            end={{x: 0, y: 0}}
            style={styles.gradient}>
            <Text style={styles.mediumText}>{item.title}</Text>
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
    height: 300,
    width: 200,
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
