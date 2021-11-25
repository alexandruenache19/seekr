import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {View, SafeAreaView} from 'react-native';
import {Text, Typography} from 'react-native-ui-lib';
import {WebView} from 'react-native-webview';

class LiveScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {user} = this.props;
    const userInfo = user.info;

    if (false) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{...Typography.text60}}>
            Wait for the event to start
          </Text>
        </View>
      );
    }

    if (user && userInfo) {
      return (
        <SafeAreaView style={{flex: 1}}>
          <WebView
            allowsInlineMediaPlayback={true}
            source={{
              uri: `https://seekrlive.com/j/${userInfo.currentJointEventId}`,
            }}
          />
        </SafeAreaView>
      );
    }

    return <SafeAreaView />;
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LiveScreen);
