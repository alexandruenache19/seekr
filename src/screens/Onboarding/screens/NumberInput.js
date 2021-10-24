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
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Typography, Colors} from 'react-native-ui-lib';
import auth from '@react-native-firebase/auth';

import {Transitions, Service} from '_nav';
const {pushScreen} = Transitions;

class NumberInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      isValid: true,
      loading: false,
    };

    this.myRef = React.createRef(PhoneInput);
    this.goToCodeConfirmation = this.goToCodeConfirmation.bind(this);
  }

  async goToCodeConfirmation() {
    const {number} = this.state;
    this.setState({loading: true});
    const isValid = this.myRef.current.isValidNumber(number);
    try {
      if (isValid) {
        const confirmation = await auth().signInWithPhoneNumber(number);
        pushScreen(Service.instance.getScreenId(), 'CodeInput', {
          confirmation: confirmation,
          number: number,
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({isValid: isValid, loading: false});
    }
    this.setState({loading: false, isValid: isValid});
  }

  render() {
    const {number, isValid, loading} = this.state;
    if (loading) {
      return (
        <SafeAreaView
          style={{
            ...styles.safeContainer,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#000" />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}>
          <View>
            <Text style={styles.title}>Enter your mobile number</Text>
            <PhoneInput
              ref={this.myRef}
              defaultValue={number}
              defaultCode="RO"
              layout="second"
              onChangeFormattedText={text => {
                this.setState({number: text});
              }}
              containerStyle={{width: '100%'}}
              withShadow
              autoFocus
            />
            {!isValid && (
              <Text style={styles.warning}>
                *Number is not valid. Try removing the first '0'
              </Text>
            )}
          </View>
          <View style={styles.footer}>
            <Text style={styles.extraInfo}>
              By continuing you may receive an sms for verification.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={this.goToCodeConfirmation}>
              <Text style={styles.buttonText}>Next</Text>
              <FontAwesome name="arrow-right" color="#FFF" size={24} />
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
    backgroundColor: '#FFF',
  },
  keyboardContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
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
  warning: {
    ...Typography.text80L,
    color: '#F44E3F',
    paddingTop: 10,
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
