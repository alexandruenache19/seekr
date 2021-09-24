import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Constants, Colors } from '_styles'
import { Icon } from '_atoms'
import FastImage from 'react-native-fast-image'

const ButtonWithImage = ({
  accessibilityLabel,
  accessibilityHint,
  imageURL,
  height,
  width,
  round,
  style,
  borderRadius,
  onPress,
  hideImageBorder
}) => (
  <TouchableOpacity
    accessible
    accessibilityLabel={accessibilityLabel}
    accessibilityHint={accessibilityHint}
    onPress={onPress}
    style={style}
  >
    {imageURL && (
      <FastImage
        style={{
          height: height,
          width: width,
          borderRadius: borderRadius
        }}
        source={{ uri: imageURL }}
      />
    )}
  </TouchableOpacity>
)

export default ButtonWithImage
