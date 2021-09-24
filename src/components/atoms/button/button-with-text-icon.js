import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon} from '_atoms';
import {Constants, Colors} from '_styles';

const ButtonWithTextIcon = ({
  text,
  accessibilityHint,
  accessibilityLabel,
  onPress,
  iconType,
  iconName,
  iconColor,
  iconSize,
  disabled,
  style,
  containerStyle,
  textContainerStyle,
  textStyle,
  iconStyle,
  iconAfterText,
}) => (
  <TouchableOpacity
    accessible
    accessibilityHint={accessibilityHint}
    accessibilityLabel={accessibilityLabel}
    hitSlop={Constants.HIT_SLOP}
    activeOpacity={0.85}
    disabled={disabled}
    delayPressIn={75}
    onPress={onPress}
    style={style}>
    {iconAfterText ? (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          ...containerStyle,
        }}>
        <View style={textContainerStyle}>
          <Text style={textStyle}>{text}</Text>
        </View>

        <View style={iconStyle}>
          <Icon
            iconType={iconType}
            iconName={iconName}
            iconColor={iconColor}
            iconSize={iconSize}
          />
        </View>
      </View>
    ) : (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          ...containerStyle,
        }}>
        <View style={iconStyle}>
          <Icon
            iconType={iconType}
            iconName={iconName}
            iconColor={iconColor}
            iconSize={iconSize}
          />
        </View>
        <View style={textContainerStyle}>
          <Text style={textStyle}>{text}</Text>
        </View>
      </View>
    )}
  </TouchableOpacity>
);

export default ButtonWithTextIcon;
