import React, {PureComponent} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {ButtonWithText} from '_atoms';
import {
  Dialog,
  PanningProvider,
  // DateTimePicker,
  Typography,
  Colors,
} from 'react-native-ui-lib';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

class CalandarDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      mode: 'date',
      showDate: false,
      showTime: false,
      date: new Date(),
      time: new Date(),
    };

    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    this.onDone = this.onDone.bind(this);

    this.handleShowTime = this.handleShowTime.bind(this);
    this.handleShowDate = this.handleShowDate.bind(this);
  }

  showDialog() {
    this.setState({showDialog: true});
  }

  hideDialog() {
    this.setState({showDialog: false});
  }

  handleShowDate() {
    this.setState({showDate: true});
  }

  handleShowTime() {
    this.setState({showTime: true});
  }

  onChangeDate(event, date) {
    this.setState({date: date, showDate: Platform.OS === 'ios'});
  }

  onChangeTime(event, time) {
    this.setState({time: time, showTime: Platform.OS === 'ios'});
  }

  onDone() {
    const {date, time} = this.state;
    this.props.onSelect(date, time);
    this.hideDialog();
  }

  render() {
    const {showDialog, showTime, showDate, date, time} = this.state;

    return (
      <Dialog
        migrate
        useSafeArea
        ignoreBackgroundPress
        key={'dialog-key'}
        bottom={true}
        height={300}
        panDirection={PanningProvider.Directions.DOWN}
        containerStyle={styles.container}
        visible={showDialog}
        onDismiss={this.hideDialog}>
        <View style={{margin: 30, justifyContent: 'space-between', flex: 1}}>
          <View>
            <Text style={{...Typography.text50, color: Colors.grey40}}>
              Date
            </Text>

            <ButtonWithText
              textStyle={{...Typography.text50, color: Colors.black}}
              text={moment(date).format('dddd DD MMM')}
              onPress={this.handleShowDate}
            />
            {showDate && (
              <DateTimePicker
                testID="datePicker"
                value={date}
                mode={'date'}
                onChange={this.onChangeDate}
                textColor={Colors.black}
              />
            )}

            <Text
              style={{
                ...Typography.text50,
                color: Colors.grey40,
                paddingTop: 20,
              }}>
              Time
            </Text>

            <ButtonWithText
              textStyle={{...Typography.text50, color: Colors.black}}
              text={moment(time).format('HH:mm')}
              onPress={this.handleShowTime}
            />
            {showTime && (
              <DateTimePicker
                testID="timePicker"
                value={time}
                mode={'time'}
                onChange={this.onChangeTime}
              />
            )}
          </View>

          <ButtonWithText
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={this.onDone}
            text="Done"
          />
        </View>
      </Dialog>
    );
  }
}

export default CalandarDialog;

const styles = StyleSheet.create({
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
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 20,
  },
});
