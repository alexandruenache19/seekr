import React from 'react'
import { View } from 'react-native'
import { Label } from '_atoms'
import { Colors } from '_styles'

const LabelHighlight = ({
  labelColor,
  text,
  style
}) => (
  <View
    style={{
      padding: 5,
      borderRadius: 4,
      backgroundColor: labelColor || '#5566EE',
      ...style
    }}
  >
    <Label
      text={text}
      style={{ color: Colors.WHITE, marginLeft: 2, fontWeight: 'bold', fontSize: 15 }}
    />
  </View>
)

export default LabelHighlight
