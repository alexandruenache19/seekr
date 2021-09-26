import React from 'react';
import {View, Platform} from 'react-native';
import {Typography} from '_styles';
import {Label} from '_atoms';
import Icon from '../icon';
import {DotIndicator} from 'react-native-indicators';

const LoaderView = ({style, iconColor, iconSize, text}) => (
  <View style={{color: '#FFF', ...style}}>
    <DotIndicator size={8} color="white" />
    {text && (
      <Label
        numberOfLines={3}
        ellipsizeMode="tail"
        style={{
          textAlign: 'center',
          fontSize:
            Platform.OS === 'android'
              ? Typography.FONT_SIZE_16
              : Typography.FONT_SIZE_18,
          fontWeight: 'normal',
          letterSpacing: -0.1,
          marginTop: 5,
          width: '100%',
          color: '#000',
          lineHeight: 18 + 18 * 0.5,
        }}
        text={text}
      />
    )}
  </View>
);

export default LoaderView;
