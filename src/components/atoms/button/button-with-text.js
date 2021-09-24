import React from 'react';
import {Text, TouchableOpacity, Platform} from 'react-native';
import {Constants} from '_styles';

const ButtonWithText = ({
  accessibilityLabel,
  text,
  textStyle,
  style,
  onPress,
  numberOfLines,
  ellipsizeMode,
  disabled,
}) => {
  return (
    <TouchableOpacity
      accessible
      accessibilityLabel={accessibilityLabel}
      hitSlop={Constants.HIT_SLOP}
      activeOpacity={Platform.OS === 'ios' ? 0.9 : 0.95}
      disabled={disabled || false}
      style={style}
      onPress={onPress}>
      <Text
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        style={textStyle}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonWithText;
