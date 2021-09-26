import React, {PureComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Typography} from 'react-native-ui-lib';

class HomeHeader extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {user} = this.props;
    const {info} = user;
    const {fullName} = info;
    return (
      <View style={styles.container}>
        <View>
          <Text style={Typography.text65L}>Hello,</Text>
          <Text style={Typography.text40}>{fullName.firstName}</Text>
        </View>

        <FastImage
          style={styles.profile}
          source={{uri: info.imageURL}}
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
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default HomeHeader;
