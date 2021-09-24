import React from 'react'
import { Text } from 'react-native'
import { Colors } from '_styles'

const SectionTitle = ({ text, color, style }) => (
  <Text style={{
    textAlign: 'left',
    fontSize: 20,
    color: color || Colors.HIGH_EMPHASIS_WHITE,
    ...style
  }}
  >
    {text}
  </Text>
)

export default SectionTitle
