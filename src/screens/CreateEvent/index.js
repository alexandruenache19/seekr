import React, {PureComponent} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {Keyboard, Typography, Colors} from 'react-native-ui-lib';
import moment from 'moment';

import {Transitions, Service} from '_nav';
import {InputWithLabel, ButtonWithText, ButtonWithIcon} from '_atoms';
import {TimeDateDialog} from '_molecules';
import {Interactions} from '_actions';

const {KeyboardAwareInsetsView} = Keyboard;
const {pushScreen} = Transitions;
const {createEvent} = Interactions;

class Onboarding extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dateString: '',
      date: new Date(),
      title: '',
      videoURL: '',
    };

    this.handleSelectDate = this.handleSelectDate.bind(this);
    this.handleCreateEvent = this.handleCreateEvent.bind(this);
    this.handleRecord = this.handleRecord.bind(this);
    this.handelChangeTime = this.handelChangeTime.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleSelectDate(date, time) {
    const eventDate = new Date();
    eventDate.setDate(date.getDate());
    eventDate.setTime(time.getTime());

    const formatDate = moment(eventDate).format('dddd DD MMM');
    const formatTime = moment(eventDate).format('HH:mm');

    this.setState({
      date: eventDate,
      dateString: formatTime + ', ' + formatDate,
    });
  }

  handleCreateEvent() {
    const {title, date, videoURL} = this.state;
    console.log(title, date, videoURL);
    // createEvent(title, date, videoURL, userId);
  }

  handleRecord() {
    pushScreen(Service.instance.getScreenId(), 'Record', {
      callback: this.handleUpload,
    });
  }

  handelChangeTime(event) {
    this.setState({title: event.target.values});
  }

  handleUpload(url) {
    console.log(url);
    this.setState({videoURL: url});
  }

  render() {
    const {dateString, title} = this.state;

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>New event</Text>

          <View>
            <InputWithLabel
              label="Name Your Event"
              value={title}
              onChange={this.handelChangeTime}
              placeholder="write here..."
            />

            <InputWithLabel
              style={{marginTop: 30}}
              label="When is it happning?"
              placeholder="select date and time"
              value={dateString}
              editable={false}
              onPress={() => this.timeDialog.showDialog()}
            />

            <Text
              style={{
                ...Typography.text50,
                color: Colors.grey40,
                marginTop: 30,
              }}>
              Make a 30 sec clip
            </Text>

            <ButtonWithIcon
              iconType="Feather"
              iconName={'video'}
              iconSize={30}
              iconColor={'#FFF'}
              onPress={this.handleRecord}
              style={{
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.grey40,
                height: 100,
                borderRadius: 10,
              }}
            />
          </View>

          <ButtonWithText
            style={styles.button}
            textStyle={{...Typography.text50, color: '#FFF'}}
            onPress={this.handleCreateEvent}
            text={'Schedule'}
          />
        </View>

        <KeyboardAwareInsetsView />
        <TimeDateDialog
          ref={ref => (this.timeDialog = ref)}
          onSelect={this.handleSelectDate}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  title: {
    ...Typography.text30BL,
  },
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  fieldStyle: {
    marginBottom: 40,
  },
  smallText: {
    fontSize: 16,
  },
  button: {
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default Onboarding;
