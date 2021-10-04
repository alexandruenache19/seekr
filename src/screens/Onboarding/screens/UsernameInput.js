import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Navigation} from 'react-native-navigation';
import {Typography, Colors} from 'react-native-ui-lib';

import {
  LoaderView,
  ButtonWithText,
  InputWithIcon,
  ButtonWithTextIcon,
} from '_atoms';
import {AuthActions} from '_actions';
import {Transitions, Service} from '_nav';
import {Constants} from '_styles';

const {isUsernameAvailable, updateUsername} = AuthActions;
const {pushScreen} = Transitions;
const {ONBOARDING_OPTIONS} = Constants;

class SignUpForm extends PureComponent {
  typingTimer = null;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      loading: false,
      available: true,
    };

    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  async handleChangeField(keyName, value) {
    let available = false;

    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(async () => {
      if (value !== '') {
        available = await isUsernameAvailable(value);
        this.setState({available: available});
      }
    }, 300);

    this.setState({
      [keyName]: value,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.typingTimer);
  }

  async handleCreate() {
    const {uid} = this.props;
    const {username} = this.state;
    const available = await isUsernameAvailable(username);

    if (username !== '') {
      if (available) {
        updateUsername(uid, username);
        pushScreen(Service.instance.getScreenId(), 'ProfileImage', {
          uid: uid,
          username: username,
        });
      } else {
        alert('This username is taken. Please choose another one!');
        this.setState({username: ''});
      }
    } else {
      alert('Please fill in all the fields!');
      this.setState({username: ''});
    }
  }

  render() {
    const {username, loading, available} = this.state;

    if (loading) {
      return (
        <LoaderView
          style={{
            height: Constants.DEVICE_HEIGHT,
            width: Constants.DEVICE_WIDTH,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      );
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}>
          <View>
            <Text style={styles.title}>Get your username</Text>
            <InputWithIcon
              iconType={'FontAwesome5'}
              iconName={'at'}
              iconColor={'#000'}
              iconSize={22}
              accessibilityLabel="Type in your username field"
              accessibilityHint="You are in the sign up form. Double tap to start typing"
              type="username"
              placeholder="username"
              value={username}
              onChangeField={this.handleChangeField}
              style={styles.inputCover}
              iconType2={'FontAwesome'}
              iconName2={
                available === 'unknown' ? null : available ? 'check' : 'close'
              }
              iconColor2={
                username !== ''
                  ? available
                    ? '#000'
                    : '#DA4453'
                  : 'transparent'
              }
              iconSize2={28}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor:
                  available === false ? 'rgba(0,0,0,0.2)' : '#000',
              }}
              onPress={this.handleCreate}>
              <Text style={styles.buttonText}>
                {available === true ? `Next` : 'Username is Taken'}
              </Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
  },
  inputCover: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    flexDirection: 'row',
    borderColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 3,
    borderRadius: 15,
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
    // backgroundColor: '#000',
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
    height: 100,
  },
});

export default SignUpForm;
