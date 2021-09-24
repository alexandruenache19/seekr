import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {NodeCameraView} from 'react-native-nodemediaclient';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

import {ButtonWithIcon, ButtonWithTextIcon, ButtonWithText} from '_atoms';
import {ItemDetailsDialog} from '_molecules';

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

  toggleVideo() {
    const {isVideoOn} = this.state;
    this.setState({isVideoOn: !isVideoOn});
    isVideoOn ? this.vb.stop() : this.vb.start();
  }

  switchCamera() {
    this.vb.switchCamera();
  }

  endLive() {
    Navigation.popToRoot('HOME_STACK');
  }

  render() {
    const {isVideoOn} = this.state;
    // const streamKey = '7078779f-1fb2-9027-f57b-885c19260c6e';
    // const url = `rtmps://global-live.mux.com:443/app/${streamKey}`;
    const streamKey =
      'sk_us-east-1_0stiOSrPQ3BJ_0xNBsxAq2bpqs5hCcRIV3Jt0Jev6an';
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
        {/*!isVideoOn && (
          <View
            style={{
              ...styles.absolute,
              backgroundColor: 'rgba(255,255,255,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 22, zIndex: 1, color: '#000'}}>
              You are offline
            </Text>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={20}
            />
          </View>
        )*/}
        <View style={styles.topActionsRow}>
          <View style={styles.statusContainer}>
            <View style={styles.imageContainer}>
              <FastImage
                source={{
                  uri: 'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/1:1/w_741,h_741,c_limit/best-face-oil.png',
                }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: 10,
              }}>
              <Text style={styles.text}>alexdenache</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 2,
                }}>
                <ButtonWithText
                  style={{
                    backgroundColor: '#FC5D83',
                    padding: 2,
                    paddingHorizontal: 5,
                    borderRadius: 5,
                  }}
                  text={isVideoOn ? 'LIVE' : 'Offline'}
                  textStyle={styles.text}
                  onPress={this.toggleVideo}
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
          {/*<ButtonWithText
            style={styles.endButton}
            textStyle={{color: '#000', fontWeight: 'bold', fontSize: 18}}
            onPress={this.endLive}
            text="End Live"
          />*/}
        </View>

        <View style={styles.bottomActionsRow}>
          <ButtonWithIcon
            iconType="Feather"
            iconName={isVideoOn ? 'video' : 'video-off'}
            iconSize={20}
            iconColor={'#000'}
            style={styles.button}
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
  },
  image: {
    ...StyleSheet.absoluteFill,
    borderRadius: 30,
  },
  endButton: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
});
