import React from 'react'
import { Text, View } from 'react-native'
import { Icon } from '_atoms'

const LabelWithIcon = ({
  text,
  iconType,
  iconName,
  iconColor,
  iconSize,
  style,
  textStyle
}) => (
  <View style={style}>
    <Icon
      iconType={iconType}
      iconName={iconName}
      iconColor={iconColor}
      iconSize={iconSize}
    />
    <Text style={textStyle}>
      {text}
    </Text>
  </View>
)

export default LabelWithIcon
