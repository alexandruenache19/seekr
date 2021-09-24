import React from 'react'
import { TextInput, View } from 'react-native'
import { Icon } from '_atoms'
import { Colors } from '_styles'

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
  iconSize2
}) => (
  <View
    accessible
    accessibilityLabel={accessibilityLabel}
    accessibilityHint={accessibilityHint}
    style={{
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      ...style
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon
        iconType={iconType}
        iconName={iconName}
        iconColor={iconColor}
        iconSize={iconSize}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.HIGH_EMPHASIS_WHITE}
        style={{ marginLeft: 7, lineHeight: 27, width: '80%', height: '100%', color: Colors.HIGH_EMPHASIS_WHITE, fontSize: 25, fontWeight: 'bold' }}
        returnKeyType='done'
        selectionColor={Colors.HIGH_EMPHASIS_WHITE}
        onFocus={onFocus}
        onBlur={onBlur}
        onChangeText={value => onChangeField(type.toLowerCase(), value)}
        value={value}
        underlineColorAndroid='transparent'
        autoCorrect={false}
        autoCapitalize='none'
      />
    </View>

    {iconName2 && (
      <Icon
        iconType={iconType2}
        iconName={iconName2}
        iconColor={iconColor2}
        iconSize={iconSize2}
      />
    )}
  </View>
)

export default InputWithIcon
