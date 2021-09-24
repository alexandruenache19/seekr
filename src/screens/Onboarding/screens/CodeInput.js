import React, {PureComponent, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Typography, Colors} from 'react-native-ui-lib';
import {Transitions, Service} from '_nav';

const UnderlineInput = ({onChangeText}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const CELL_COUNT = 6;
  function enterCode(text) {
    onChangeText(text);
    setValue(text);
  }
  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={enterCode}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({index, symbol, isFocused}) => (
        <View
          onLayout={getCellOnLayoutHandler(index)}
          key={index}
          style={[styles.cellRoot, isFocused && styles.focusCell]}>
          <Text style={styles.cellText}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        </View>
      )}
    />
  );
};

const {pushScreen} = Transitions;

class NumberInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      code: 0,
    };

    this.confirmCode = this.confirmCode.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  async confirmCode() {
    const {confirmation} = this.props;
    const {code} = this.state;
    try {
      await confirmation.confirm(code);
      pushScreen(Service.instance.getScreenId(), 'LocationInput');
    } catch (error) {}
  }

  onChangeText(text) {
    this.setState({code: text});
  }

  render() {
    const {number} = this.props;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <View>
            <Text style={styles.title}>
              Enter the 4-digit code sent to you at
            </Text>
            <Text style={styles.number}>{number}</Text>
            <UnderlineInput onChangeText={this.onChangeText} />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={this.confirmCode}>
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
  container: {
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  title: {
    ...Typography.text30BL,
    paddingBottom: 20,
  },
  number: {
    ...Typography.text40,
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
  codeFieldRoot: {
    marginTop: 40,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    ...Typography.text40,
  },
  focusCell: {
    borderBottomColor: '#000',
    borderBottomWidth: 2,
  },
});

export default NumberInput;
