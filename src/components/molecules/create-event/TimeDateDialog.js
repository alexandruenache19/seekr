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
class CalandarDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      mode: 'date',
      show: false,
      date: new Date(),
      time: new Date(),
    };

    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    this.onDone = this.onDone.bind(this);
    this.renderDateInput = this.renderDateInput.bind(this);
    this.renderTimeInput = this.renderTimeInput.bind(this);
  }

  showDialog() {
    this.setState({showDialog: true});
  }

  hideDialog() {
    this.setState({showDialog: false});
  }

  onChangeDate(event, selectedDate) {
    this.setState({date: selectedDate});
  }

  onChangeTime(event, selectedDate) {
    this.setState({time: selectedDate});
  }

  onDone() {
    const {date, time} = this.state;
    this.props.onSelect(date, time);
    this.hideDialog();
  }

  renderTimeInput() {
    const value = null;
    return (
      <View>
        <Text style={{...Typography.text50, color: Colors.grey40}}>Time</Text>
        <TouchableOpacity
          style={{paddingTop: 20}}
          onPress={() => {
            // toggle(true);
            this.setState({mode: 'time', show: true});
          }}>
          <Text
            style={{
              ...Typography.text60,
              color: value ? Colors.black : Colors.grey50,
            }}>
            {value ? value : 'Select time'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderDateInput(props, toggle) {
    // const {value} = props;
    const value = null;
    return (
      <View>
        <Text style={{...Typography.text50, color: Colors.grey40}}>Date</Text>
        <TouchableOpacity
          style={{paddingTop: 20}}
          onPress={() => {
            // toggle(true);
            this.setState({mode: 'date', show: true});
          }}>
          <Text
            style={{
              ...Typography.text60,
              color: value ? Colors.black : Colors.grey50,
            }}>
            {value ? value : 'Select date'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {showDialog, show, mode, date, time} = this.state;

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
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode={'date'}
              onChange={this.onChangeDate}
              textColor={Colors.black}
            />
            <Text
              style={{
                ...Typography.text50,
                color: Colors.grey40,
                paddingTop: 20,
              }}>
              Time
            </Text>
            <DateTimePicker
              testID="timePicker"
              value={time}
              mode={'time'}
              onChange={this.onChangeTime}
            />
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
