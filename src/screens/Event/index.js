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
    const {eventInfo} = this.props;

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

    return (
      <SafeAreaView style={{flex: 1}}>
        <WebView
          allowsInlineMediaPlayback={true}
          source={{uri: 'https://seekrlive.com/j/joint-event-id'}}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LiveScreen);
