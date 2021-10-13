import React, {PureComponent} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Card, Typography, Colors} from 'react-native-ui-lib';

import {Transitions, Service} from '_nav';
import {ButtonWithTextIcon} from '_atoms';

const {pushScreen} = Transitions;

class EventCard extends PureComponent {
  constructor(props) {
    super(props);
    this.goToCreateEvent = this.goToCreateEvent.bind(this);
  }

  goToCreateEvent() {
    const {uid} = this.props;
    pushScreen(Service.instance.getScreenId(), 'CreateEvent', {uid: uid});
  }

  render() {
    return (
      <Card
        useNative
        enableShadow
        enableBlur
        borderRadius={10}
        elevation={20}
        backgroundColor={'#FF4365'}
        activeScale={0.96}
        onPress={this.goToCreateEvent}
        style={styles.container}>
        <View style={styles.innerContainer}>
          <View>
            <Text style={{...Typography.text40, color: Colors.white}}>
              Scheduale an event
            </Text>
            <Text style={{...Typography.text65L, color: Colors.white}}>
              Announce your audience about the event
            </Text>
          </View>
          <ButtonWithTextIcon
            text="Create Event"
            style={styles.button}
            containerStyle={styles.buttonContainer}
            textStyle={Typography.text60}
            iconType="Feather"
            iconName={'calendar'}
            iconSize={22}
            iconColor={'#000'}
            iconAfterText
          />
        </View>
      </Card>
    );
  }
}

export default EventCard;

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
  },
  button: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
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
