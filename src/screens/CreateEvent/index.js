import React, {PureComponent} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {Keyboard, Typography, Colors} from 'react-native-ui-lib';

import {Transitions, Service} from '_nav';
import {InputWithLabel, ButtonWithText, ButtonWithIcon} from '_atoms';
import {TimeDateDialog} from '_molecules';

const monthName = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const dayName = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const {KeyboardAwareInsetsView} = Keyboard;
const {pushScreen} = Transitions;
class Onboarding extends PureComponent {
  constructor(props) {
    super(props);
    // const date = new Date();

    this.state = {
      // day: date.getDate(),
      // month: date.getMonth(),
      // year: date.getFullYear(),
      // hour: date.getHours(),
      // minutes: date.getMinutes(),
      // dayOfWeek: date.getDay(),
      dateString: '',
      date: new Date(),
      time: new Date(),
    };

    this.handleSelectDate = this.handleSelectDate.bind(this);
    this.handleCreateEvent = this.handleCreateEvent.bind(this);
    this.handleRecord = this.handleRecord.bind(this);
  }

  handleSelectDate(date, time) {
    const day = date.getDate();
    const dayOfWeek = dayName[date.getDay()];
    const month = monthName[date.getMonth()];
    const year = date.getFullYear();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    this.setState({
      date: date,
      time: time,
      dateString:
        hour + ':' + minutes + ', ' + dayOfWeek + ' ' + day + ' ' + month,
    });
  }

  handleCreateEvent() {}

  handleRecord() {
    pushScreen(Service.instance.getScreenId(), 'Record');
  }

  render() {
    const {dateString} = this.state;

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>New event</Text>

          <View>
            <InputWithLabel
              label="Name Your Event"
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
              Make a 15 sec clip
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
            onPress={this.createEvent}
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
