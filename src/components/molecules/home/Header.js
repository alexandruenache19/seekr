import React, {PureComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Typography} from 'react-native-ui-lib';

class HomeHeader extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={Typography.text65L}>Hello,</Text>
          <Text style={Typography.text40}>Maria</Text>
        </View>

        <FastImage
          style={styles.profile}
          source={{
            uri: 'https://scontent-otp1-1.xx.fbcdn.net/v/t1.6435-1/c0.53.320.320a/p320x320/181431130_781301786094985_8980961628504639729_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=7206a8&_nc_ohc=fHMKYYvw2hEAX_j9B-8&tn=r3p0B6ByeKfLWpz-&_nc_ht=scontent-otp1-1.xx&oh=b5b161089d6e38510384056e9f4ffddc&oe=615FAB28',
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profile: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default HomeHeader;
