import React from 'react';
import {TextInput, View} from 'react-native';
import {Icon} from '_atoms';
import {Colors} from '_styles';

const InputWithIcon = ({
  accessibilityLabel,
  accessibilityHint,
  iconType,
  iconName,
  iconColor,
  iconSize,
  iconStyle,
  placeholder,
  onFocus,
  onBlur,
  value,
  type,
  onChangeField,
  hideIcon,
  style,
  iconType2,
  iconName2,
  iconColor2,
  iconSize2,
}) => (
  <View
    accessible
    accessibilityLabel={accessibilityLabel}
    accessibilityHint={accessibilityHint}
    style={{
      ...style,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
    }}>
    <Icon
      iconType={iconType}
      iconName={iconName}
      iconColor={iconColor}
      iconSize={iconSize}
    />

    <TextInput
      placeholder={placeholder}
      // placeholderTextColor={''}
      style={{
        marginLeft: 7,
        lineHeight: 27,
        width: '80%',
        height: '100%',
        color: '#000',
        fontSize: 25,
        fontWeight: 'bold',
      }}
      returnKeyType="done"
      onFocus={onFocus}
      onBlur={onBlur}
      onChangeText={value => onChangeField(type.toLowerCase(), value)}
      value={value}
      underlineColorAndroid="transparent"
      autoCorrect={false}
      autoCapitalize="none"
    />

    {iconName2 && (
      <Icon
        iconType={iconType2}
        iconName={iconName2}
        iconColor={iconColor2}
        iconSize={iconSize2}
      />
    )}
  </View>
);

export default InputWithIcon;
