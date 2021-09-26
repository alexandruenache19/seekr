import React from 'react';
import {StyleSheet} from 'react-native';
import {View, TextField, Text, Typography, Colors} from 'react-native-ui-lib';

const InputWithLabel = ({
  value,
  editable,
  onPress,
  onChange,
  style,
  label,
  placeholder,
}) => (
  <View style={style}>
    <Text style={styles.text}>{label}</Text>
    <TextField
      text60
      editable={editable || true}
      value={value || ''}
      onChangeText={onChange}
      onPressIn={onPress}
      placeholder={placeholder}
      placeholderTextColor={Colors.grey50}
      underlineColor={{
        focus: Colors.grey50,
        default: Colors.grey50,
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  text: {
    ...Typography.text50,
    color: Colors.grey40,
    paddingBottom: 20,
  },
});

export default InputWithLabel;
