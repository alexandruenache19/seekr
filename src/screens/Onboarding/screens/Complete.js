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
import {Transitions, Service} from '_nav';
import {AuthActions} from '_actions';

const {goToApp} = Transitions;
const {updateFinishOnboarding} = AuthActions;

class Complete extends PureComponent {
  constructor(props) {
    super(props);
    this.handleFinishOnboarding = this.handleFinishOnboarding.bind(this);
  }

  handleFinishOnboarding() {
    const {uid} = this.props;
    updateFinishOnboarding(uid);
    goToApp();
  }

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}>
          <View />

          <Text style={styles.title}>You are all set! Let's go!</Text>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleFinishOnboarding}>
              <Text style={styles.buttonText}>Done</Text>
              <FontAwesome name={'check'} color={'#FFF'} size={24} />
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
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  title: {
    ...Typography.text30BL,
    paddingBottom: 20,
    textAlign: 'center',
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

export default Complete;
