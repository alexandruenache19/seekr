import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {Text, Typography} from 'react-native-ui-lib';

import {Live, PreviewLive} from '_organisms';
import {Interactions} from '_actions';
import {
  CameraSection,
  PreviewActionsSection,
  CommentsSection,
  LiveActionsSection,
} from '_molecules';

const {addLiveURL} = Interactions;

class LiveScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPreview: true,
    };

    this.goLive = this.goLive.bind(this);
  }

  async goLive() {
    const {user, eventInfo} = this.props;
    await addLiveURL(user.info, eventInfo);
    this.camera.startLive();
    this.setState({isPreview: false});
  }

  render() {
    const {isPreview} = this.state;
    const {user, eventInfo} = this.props;
    const {info} = user;

    if (info && !info.hasOwnProperty('stream')) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{...Typography.text60}}>
            Text us on whatsapp to become a seller
          </Text>
          <Text style={{...Typography.text40, marginTop: 20}}>
            +4478567584593
          </Text>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <CameraSection
            ref={ref => (this.camera = ref)}
            userInfo={info}
            eventInfo={eventInfo}
            isPreview={isPreview}
          />
          {isPreview ? (
            <PreviewActionsSection
              callback={this.goLive}
              userInfo={info}
              eventInfo={eventInfo}
            />
          ) : (
            <>
              <CommentsSection eventInfo={eventInfo} />
              <LiveActionsSection eventInfo={eventInfo} />
            </>
          )}
        </View>
      </SafeAreaView>
    );

    // if (isPreview) {
    //   return (
    //     <PreviewLive
    //       userInfo={info}
    //       onGoLive={this.goLive}
    //       eventInfo={eventInfo}
    //     />
    //   );
    // }
    //
    // return <Live userInfo={info} eventInfo={eventInfo} />;
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LiveScreen);
