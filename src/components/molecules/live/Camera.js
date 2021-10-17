import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, PermissionsAndroid} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {NodeCameraView} from 'react-native-nodemediaclient';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {Colors, Typography, Dialog, PanningProvider} from 'react-native-ui-lib';

import {ButtonWithIcon, ButtonWithTextIcon, ButtonWithText} from '_atoms';
import {eventsRef} from '../../../config/firebase';

import {Interactions, ShareActions, HelperActions} from '_actions';

const {endEvent} = Interactions;
const {share} = ShareActions;
const {nFormatter} = HelperActions;
class CameraSection extends PureComponent {
  constructor(props) {
    super(props);

    const {userInfo} = props;
    let url = '';

    if (userInfo && userInfo.hasOwnProperty('stream')) {
      url = userInfo.stream.serverURL + userInfo.stream.streamKey;
    }

    this.state = {
      isVideoOn: true,
      viewers: 0,
      showDialog: false,
      url: url,
    };

    this.toggleVideo = this.toggleVideo.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.endLive = this.endLive.bind(this);
    this.shareLive = this.shareLive.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.showDialog = this.showDialog.bind(this);
  }

  async componentDidMount() {
    const {isPreview, eventInfo} = this.props;

    // try {
    //   PermissionsAndroid.requestMultiple(
    //     [
    //       PermissionsAndroid.PERMISSIONS.CAMERA,
    //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    //     ],
    //     {
    //       title: 'Seekr Camera And Microphone Permission',
    //       message:
    //         'Seekr needs access to your camera ' + 'so you can start a live.',
    //     },
    //   );
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     console.log('You can use the camera');
    //   } else {
    //     console.log('Camera permission denied');
    //   }
    // } catch (err) {
    //   console.warn(err);
    // }

    this.productInfoListener = eventsRef
      .child(`${eventInfo.id}/info/viewers`)
      .on('value', async snapshot => {
        if (snapshot.exists()) {
          const viewers = snapshot.val();
          this.setState({
            viewers: viewers,
          });
        }
      });

    if (!isPreview) this.vb.start();
  }

  hideDialog() {
    this.setState({showDialog: false});
  }

  showDialog() {
    this.setState({showDialog: true});
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
    this.setState({showDialog: false});
    try {
      await endEvent(eventInfo, userInfo.uid);
      Navigation.popToRoot('HOME_STACK');
    } catch (e) {
      console.log('e', e);
    }
  }

  shareLive() {
    const {eventInfo} = this.props;
    share(eventInfo);
  }

  render() {
    const {isVideoOn, viewers, showDialog, url} = this.state;
    const {isPreview, userInfo} = this.props;
    if (url === '') {
      return (
        <View
          style={{
            ...styles.container,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{...Typography.text60}}>
            Text us on whatsapp to become a seller
          </Text>
          <Text style={{...Typography.text40}}>+4478567584593</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <NodeCameraView
          style={{height: '100%'}}
          ref={vb => {
            this.vb = vb;
          }}
          outputUrl={url}
          camera={{cameraId: 1, cameraFrontMirror: false}}
          audio={{bitrate: 128000, profile: 1, samplerate: 48000}}
          video={{
            preset: 2,
            bitrate: 800000,
            profile: 1,
            fps: 30,
            videoFrontMirror: false,
          }}
          autopreview
        />

        <View style={styles.topActionsRow}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={styles.imageContainer}>
              <FastImage
                source={{uri: userInfo.imageURL}}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                paddingLeft: 10,
                alignItems: 'flex-start',
              }}>
              <Text style={styles.text}>@{userInfo.username}</Text>
              <View style={styles.fullRow}>
                {/* <ButtonWithTextIcon
                  iconType="Feather"
                  iconName="plus"
                  iconSize={16}
                  iconColor="#000"
                  style={{
                    backgroundColor: '#FFF',
                    borderRadius: 5,
                    padding: 3,
                  }}
                  text={'Follow'}
                  textStyle={{...styles.text, color: '#000'}}
                /> */}
                <ButtonWithTextIcon
                  iconType="Feather"
                  iconName="send"
                  iconSize={16}
                  iconColor="#000"
                  style={{
                    backgroundColor: '#FFF',
                    borderRadius: 5,
                    padding: 2,
                  }}
                  text="Share"
                  textStyle={{...styles.text, color: '#000', paddingRight: 2}}
                  onPress={this.shareLive}
                  iconAfterText
                />
              </View>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 2,
                height: '100%',
              }}>
              <ButtonWithTextIcon
                iconType="Feather"
                iconName="eye"
                iconSize={16}
                iconColor="#FFF"
                style={{
                  backgroundColor:
                    isVideoOn && !isPreview ? '#FC5D83' : Colors.grey40,
                  borderRadius: 5,
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}
                text={
                  isVideoOn && !isPreview
                    ? `${nFormatter(viewers, 1)}   ● LIVE`
                    : `${nFormatter(viewers, 1)}   PREVIEW `
                }
                textStyle={{paddingLeft: 5, ...styles.text}}
              />
            </View>
            <ButtonWithIcon
              iconType="Feather"
              iconName="x"
              iconSize={30}
              iconColor="#FFF"
              style={{
                // ...styles.button,
                marginLeft: 10,
              }}
              onPress={this.showDialog}
            />
          </View>
        </View>
        <View style={styles.bottomActionsRow}>
          <View
            style={{flexDirection: 'row', justifyContent: 'flex-end', flex: 1}}>
            <ButtonWithIcon
              iconType="Feather"
              iconName="repeat"
              iconSize={20}
              iconColor="#000"
              style={{
                ...styles.button,
                marginLeft: 10,
              }}
              onPress={this.switchCamera}
            />
          </View>
        </View>
        <Dialog
          migrate
          useSafeArea
          ignoreBackgroundPress
          key={'dialog-key'}
          bottom={true}
          height={200}
          panDirection={PanningProvider.Directions.DOWN}
          containerStyle={{
            backgroundColor: '#FFF',
            borderRadius: 12,
            marginBottom: 20,
            padding: 20,
            justifyContent: 'space-between',
          }}
          visible={showDialog}
          onDismiss={this.hideDialog}>
          <Text style={Typography.text50}>Do you want to end this event?</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <ButtonWithText
              style={{...styles.button, backgroundColor: Colors.grey40}}
              textStyle={{...Typography.text50, color: '#FFF', width: 50}}
              onPress={this.endLive}
              text="Yes"
            />

            <ButtonWithText
              style={{
                ...styles.button,
                backgroundColor: Colors.grey40,
              }}
              textStyle={{...Typography.text50, color: '#FFF', width: 50}}
              onPress={this.hideDialog}
              text="No"
            />
          </View>
          <View />
        </Dialog>
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
  fullRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
});
