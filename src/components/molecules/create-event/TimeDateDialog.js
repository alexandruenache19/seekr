import React, {PureComponent} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {ButtonWithText} from '_atoms';
import {
  Dialog,
  PanningProvider,
  DateTimePicker,
  Typography,
  Colors,
} from 'react-native-ui-lib';
// import DateTimePicker from '@react-native-community/datetimepicker';

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
const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

class CalandarDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      mode: 'date',
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

  onChangeDate(value) {
    this.setState({date: value});
  }

  onChangeTime(value) {
    this.setState({time: value});
  }

  onDone() {
    const {date, time} = this.state;
    console.log(date, time);
    this.props.onSelect(date, time);
    this.hideDialog();
  }

  renderTimeInput(props, toggle) {
    const {value} = props;
    return (
      <View>
        <Text style={{...Typography.text50, color: Colors.grey40}}>Time</Text>
        <TouchableOpacity
          style={{paddingTop: 20}}
          onPress={() => {
            toggle(true);
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
    const {value} = props;
    return (
      <View>
        <Text style={{...Typography.text50, color: Colors.grey40}}>Date</Text>
        <TouchableOpacity
          style={{paddingTop: 20}}
          onPress={() => {
            toggle(true);
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
    const {showDialog, show, mode, date} = this.state;

    return (
      <Dialog
        migrate
        useSafeArea
        ignoreBackgroundPress
        key={'dialog-key'}
        bottom={true}
        height={400}
        panDirection={PanningProvider.Directions.DOWN}
        containerStyle={styles.container}
        visible={showDialog}
        onDismiss={this.hideDialog}>
        <View style={{margin: 30, justifyContent: 'space-between', flex: 1}}>
          <View>
            <DateTimePicker
              renderInput={this.renderDateInput}
              onChange={this.onChangeDate}
              dateFormat={'MMM D, YYYY'}
            />

            <DateTimePicker
              mode={'time'}
              onChange={this.onChangeTime}
              renderInput={this.renderTimeInput}
              timeFormat={'h:mm A'}
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
// {show && (
//   <DateTimePicker
//     testID="dateTimePicker"
//     value={date}
//     mode={mode}
//     is24Hour={true}
//     display="spinner"
//     onChange={this.onChange}
//   />
// )}
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
