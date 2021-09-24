import React from 'react'
import { View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Colors } from '_styles'

const MiniUserPhoto = ({
  diameter,
  noMargin,
  url,
  withoutBorder,
  borderColor,
  imageStyles
}) => (
  <View style={{
    height: diameter || 30,
    width: diameter || 30,
    borderRadius: diameter / 2 || 15,
    backgroundColor: Colors.HIGH_EMPHASIS_WHITE,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: noMargin ? 0 : -10
  }}
  >
    <FastImage
      style={{
        height: diameter || 30,
        width: diameter || 30,
        borderRadius: diameter / 2 || 15,
        borderColor: borderColor || '#FFF',
        borderWidth: withoutBorder ? 0 : 1,
        ...imageStyles
      }}
      source={{ uri: url }}
    />
  </View>
)

export default MiniUserPhoto
