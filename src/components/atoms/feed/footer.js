import React from 'react';
import {View} from 'react-native';
import {LoaderView} from '_atoms';
import {Colors, Constants} from '_styles';

const FeedFootter = ({feedIsComplete}) => {
  if (!feedIsComplete) {
    return (
      <View>
        <LoaderView
          iconSize={30}
          style={{
            height: 200,
            width: Constants.WIDTH,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        <View
          style={{
            backgroundColor: Colors.MAIN_BG_COLOR,
            height: 200,
            width: '100%',
          }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: Colors.MAIN_BG_COLOR,
        height: 200,
        width: '100%',
      }}
    />
  );
};

export default FeedFootter;
