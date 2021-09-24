import React from 'react'
import { Text } from 'react-native'
import { Typography } from '_styles'

const Label = ({
  text,
  style,
  numberOfLines,
  ellipsizeMode
}) => (
  <Text
    numberOfLines={numberOfLines || null}
    ellipsizeMode={ellipsizeMode || null}
    style={{
      ...Typography.default.audioInfoTextLight,
      ...style
    }}
  >
    {text}
  </Text>
)

export default Label
