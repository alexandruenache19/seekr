import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {NodeCameraView} from 'react-native-nodemediaclient';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

import {ButtonWithIcon, ButtonWithTextIcon, ButtonWithText} from '_atoms';

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
