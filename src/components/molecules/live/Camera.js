import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {NodeCameraView} from 'react-native-nodemediaclient';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {Colors} from 'react-native-ui-lib';

import {ButtonWithIcon, ButtonWithTextIcon, ButtonWithText} from '_atoms';
import {ItemDetailsDialog} from '_molecules';

import {Interactions} from '_actions';
const {endEvent} = Interactions;

class CameraSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVideoOn: true,
    };

    this.toggleVideo = this.toggleVideo.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.endLive = this.endLive.bind(this);
  }

  componentDidMount() {
    const {isPreview} = this.props;
    if (!isPreview) this.vb.start();
  }

  toggleVideo() {
    const {isVideoOn} = this.state;
    if (isVideoOn) {
      this.vb.stop();
      this.setState({isVideoOn: false});
    } else {
      this.vb.start();
      this.setState({isVideoOn: true});
    }
  }

  switchCamera() {
    this.vb.switchCamera();
  }

  async endLive() {
    const {eventInfo, userInfo} = this.props;
    await endEvent(eventInfo, userInfo.uid);
    Navigation.popToRoot('HOME_STACK');
  }

  render() {
    const {isVideoOn} = this.state;
    const {isPreview, userInfo} = this.props;

    // const streamKey = '7078779f-1fb2-9027-f57b-885c19260c6e';
    // const url = `rtmps://global-live.mux.com:443/app/${streamKey}`;
    const streamKey =
      'sk_us-east-1_9II6k7LllISx_a6v8eAIZOEjfxV1ERJHruPdp6QZoB1';
    const url = `rtmps://a6a7debc4d73.global-contribute.live-video.net:443/app/${streamKey}`;

    return (
      <View style={styles.container}>
        <NodeCameraView
          style={{height: '100%'}}
          ref={vb => {
            this.vb = vb;
          }}
          outputUrl={url}
          camera={{cameraId: 1, cameraFrontMirror: true}}
          audio={{bitrate: 32000, profile: 1, samplerate: 44100}}
          video={{
            preset: 12,
            bitrate: 400000,
            profile: 1,
            fps: 15,
            videoFrontMirror: false,
          }}
          autopreview={true}
        />
        {!isVideoOn && (
          <View
            style={{
              ...styles.absolute,
              backgroundColor: 'rgba(255,255,255,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 22, zIndex: 1, color: '#000'}}>Paused</Text>
            <BlurView style={styles.absolute} blurType="dark" blurAmount={20} />
          </View>
        )}
        <View style={styles.topActionsRow}>
          <View style={styles.statusContainer}>
            <View style={styles.imageContainer}>
              <FastImage
                source={{uri: userInfo.imageURL}}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: 10,
              }}>
              <Text style={styles.text}>@{userInfo.username}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 2,
                }}>
                <ButtonWithText
                  style={{
                    backgroundColor:
                      isVideoOn && !isPreview ? '#FC5D83' : Colors.grey40,
                    padding: 2,
                    paddingHorizontal: 5,
                    borderRadius: 5,
                  }}
                  text={isVideoOn && !isPreview ? '● LIVE' : 'PREVIEW'}
                  textStyle={styles.text}
                  // onPress={this.toggleVideo}
                />
                <ButtonWithTextIcon
                  iconType="Feather"
                  iconName={'eye'}
                  iconSize={16}
                  iconColor={'#FFF'}
                  style={{
                    marginLeft: 10,
                  }}
                  text={22}
                  textStyle={{...styles.text, marginLeft: 5}}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bottomActionsRow}>
          <View style={{flexDirection: 'row'}}>
            <ButtonWithTextIcon
              iconType="Feather"
              iconName={'x'}
              iconSize={20}
              iconColor={'#000'}
              style={styles.button}
              textStyle={{
                color: '#000',
                fontWeight: 'bold',
                fontSize: 18,
                marginLeft: 5,
              }}
              onPress={this.endLive}
              text={'End Event'}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <ButtonWithIcon
              iconType="Feather"
              iconName="send"
              iconSize={20}
              iconColor="#000"
              style={{
                ...styles.button,
                marginLeft: 10,
              }}
              onPress={this.shareLive}
            />
            <ButtonWithIcon
              iconType="Feather"
              iconName={isVideoOn ? 'video' : 'video-off'}
              iconSize={20}
              iconColor={'#000'}
              style={{
                ...styles.button,
                marginLeft: 10,
              }}
              onPress={this.toggleVideo}
            />
            <ButtonWithIcon
              iconType="Feather"
              iconName={'repeat'}
              iconSize={20}
              iconColor={'#000'}
              style={{
                ...styles.button,
                marginLeft: 10,
              }}
              onPress={this.switchCamera}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default CameraSection;

const styles = StyleSheet.create({
  container: {
    height: '65%',
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#999',
    overflow: 'hidden',
  },
  topActionsRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  bottomActionsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
  },
  text: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  endButton: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
});
