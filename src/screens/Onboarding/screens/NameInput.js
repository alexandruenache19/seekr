import React, {PureComponent, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform,
  Button,
  KeyboardAvoidingView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Typography, Colors} from 'react-native-ui-lib';
import auth from '@react-native-firebase/auth';

import {AuthActions} from '_actions';
import {InputWithLabel} from '_atoms';
import {Transitions, Service} from '_nav';
const {pushScreen} = Transitions;
const {updateName} = AuthActions;

class NumberInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {firstName: '', lastName: ''};
    this.goToComplete = this.goToComplete.bind(this);
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
  }

  goToComplete() {
    const {uid} = this.props;
    const {firstName, lastName} = this.state;

    updateName(uid, firstName, lastName);
    pushScreen(Service.instance.getScreenId(), 'UsernameInput', {uid: uid});
  }

  handleChangeFirstName(value) {
    this.setState({firstName: value});
  }

  handleChangeLastName(value) {
    this.setState({lastName: value});
  }

  render() {
    const {firstName, lastName} = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}>
          <Text style={styles.title}>What is your name?</Text>
          <InputWithLabel
            value={firstName}
            onChange={this.handleChangeFirstName}
            label="First Name"
            placeholder="write here..."
          />
          <InputWithLabel
            value={lastName}
            onChange={this.handleChangeLastName}
            label="Last Name"
            placeholder="write here..."
          />
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={this.goToComplete}>
              <Text style={styles.buttonText}>Next</Text>
              <FontAwesome name={'arrow-right'} color={'#FFF'} size={24} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  keyboardContainer: {
    justifyContent: 'space-between',
    flex: 1,

    width: '100%',
    padding: 20,
  },
  title: {
    ...Typography.text30BL,
    paddingBottom: 20,
  },
  extraInfo: {
    ...Typography.text70,
    color: Colors.grey40,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    ...Typography.text50,
    color: Colors.white,
  },
  footer: {
    width: '100%',
    marginBottom: 50,
  },
});

export default NumberInput;
