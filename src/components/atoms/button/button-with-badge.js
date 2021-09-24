import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
// import Touchable from 'react-native-platform-touchable'
import { Constants, Colors } from '_styles'
import { Icon } from '_atoms'

const ButtonWithBadge = ({
  accessibilityLabel,
  accessibilityHint,
  iconType,
  iconName,
  iconColor,
  iconSize,
  style,
  text,
  onPress,
  onLongPress,
  showBadge,
  textStyle
}) => {
  return (
    <TouchableOpacity
      accessible
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      // hitSlop={Constants.HIT_SLOP}
      activeOpacity={0.7}
      style={{
        ...style,
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
      }}
      // background={Constants.NORMAL_BUTTON_RIPPLE}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      >
        {showBadge && (
          <View style={{
            position: 'absolute',
            top: 2,
            right: 2,
            zIndex: 1501,
            backgroundColor: Colors.MAIN_BG_COLOR,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          >
            <View style={{
              zIndex: 1501,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: Colors.RED,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
              <Text style={{
                lineHeight: 12,
                fontSize: 12,
                textAlign: 'center',
                color: Colors.HIGH_EMPHASIS_WHITE,
                // fontFamily: 'SFProText-Regular',
                fontWeight: 'bold',
                ...textStyle
              }}
              >
                {text}
              </Text>
            </View>
          </View>
        )}
        <Icon
          iconType={iconType}
          iconName={iconName}
          iconColor={iconColor}
          iconSize={iconSize}
        />
      </View>
    </TouchableOpacity>
  )
}

export default ButtonWithBadge
