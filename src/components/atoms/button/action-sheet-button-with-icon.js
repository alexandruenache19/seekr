import React, { Component } from 'react'
import { TouchableOpacity, ActionSheetIOS } from 'react-native'
// import { connectActionSheet } from '@expo/react-native-action-sheet'
import { Constants } from '_styles'
import { Icon } from '_atoms'

class ButtonWithIcon extends Component {
  render () {
    const {
      accessibilityLabel,
      iconType,
      iconName,
      iconColor,
      iconSize,
      style,
      onPress,
      onLongPress
    } = this.props

    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={accessibilityLabel}
        hitSlop={Constants.HIT_SLOP}
        activeOpacity={0.85}
        delayPressIn={75}
        style={style}
        onPress={() => {
          const self = this

          const options = ['Logout', 'Cancel']
          const destructiveButtonIndex = 0
          const cancelButtonIndex = 1

          ActionSheetIOS.showActionSheetWithOptions(
            {
              options,
              cancelButtonIndex,
              destructiveButtonIndex
            },
            buttonIndex => {
              onPress(buttonIndex)
            }
          )
        }}
      >
        <Icon
          iconType={iconType}
          iconName={iconName}
          iconColor={iconColor}
          iconSize={iconSize}
        />
      </TouchableOpacity>
    )
  }
}

// const ConnectedButton = connectActionSheet(ButtonWithIcon);

export default ButtonWithIcon
