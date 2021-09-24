import React from 'react'
import { Text } from 'react-native'
import { Typography, Colors } from '_styles'

const SectionSubtitle = ({ text, color, style }) => (
  <Text style={{
    ...style,
    lineHeight: 20,
    fontSize: 17,
    letterSpacing: 18,
    color: color || Colors.HIGH_EMPHASIS_WHITE
  }}
  >
    {text}
  </Text>
)

export default SectionSubtitle
