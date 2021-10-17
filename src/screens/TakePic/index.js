'use strict';
import React, {PureComponent} from 'react';
import {StyleSheet, Alert, View, SafeAreaView, Pressable} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Navigation} from 'react-native-navigation';
import {openSettings} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';

import {ButtonWithIcon} from '_atoms';

class TakePic extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imgPath: null,
      selectLink: false,
      selectImage: true,
      selectText: false,
      itemType: 'image',
      isFrontCamera: false,
    };
    this.handleSelectImage = this.handleSelectImage.bind(this);
    Navigation.events().bindComponent(this);
  }

  async takePicture() {
    const {setProductImagePath} = this.props;
    if (this.camera) {
      const options = {
        quality: 0.8,
        width: 750,
      };
      const data = await this.camera.takePictureAsync(options);
      setProductImagePath(data.uri);
      Navigation.dismissModal('TakePicModal');
    }
  }

  async handleSelectImage() {
    const {setProductImagePath} = this.props;
    await Navigation.dismissModal('TakePic');
    ImagePicker.openPicker({
      mediaType: 'photo',
      /* Should be use without cropping, just resizing after selection  */
      compressImageMaxWidth: 700,
      compressImageMaxHeight: 700,
      compressImageQuality: 0.65, // default 1 (Android) | 0.8 (iOS))
    })
      .then(async image => {
        if (image.path) {
          setProductImagePath(image.path);
        }
      })
      .catch(error => {
        if (error.code === 'E_NO_LIBRARY_PERMISSION') {
          Alert.alert(
            'You blocked access to your photo library.',
            'If you want to upload a picture from your gallery allow photo library permissions. Do you want to go to your settings to allow permissions?',
            [
              {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () =>
                  openSettings().catch(() =>
                    console.warn('cannot open settings'),
                  ),
              },
            ],
          );
        }
      });
  }

  render() {
    const {isFrontCamera} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <ButtonWithIcon
              iconType="Feather"
              iconName="x"
              iconSize={23}
              iconColor="#FFFFFF"
              style={styles.btnBg}
              onPress={async () => {
                // alert('test');
                Navigation.dismissModal('TakePicModal');
              }}
            />

            <ButtonWithIcon
              iconType="MaterialCommunityIcons"
              iconName="twitter-retweet"
              iconSize={28}
              iconColor="transparent"
              style={{
                ...styles.captureButton,
                margin: 0,
                backgroundColor: 'transparent',
              }}
              onPress={() => null}
            />
          </View>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={
              isFrontCamera
                ? RNCamera.Constants.Type.front
                : RNCamera.Constants.Type.back
            }
            flashMode={RNCamera.Constants.FlashMode.off}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          />
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          <ButtonWithIcon
            iconType="FontAwesome"
            iconName="image"
            iconSize={26}
            iconColor="#FFFFFF"
            // iconColor='#ffbe0b'
            onPress={this.handleSelectImage}
            style={{...styles.captureButton, backgroundColor: 'transparent'}}
          />
          <Pressable
            onPress={this.takePicture.bind(this)}
            style={styles.captureButton}>
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                borderWidth: 2,
                borderColor: '#000000',
              }}
            />
          </Pressable>
          <ButtonWithIcon
            iconType="Ionicons"
            iconName="camera-reverse"
            iconSize={31}
            iconColor="#FFFFFF"
            // iconColor='#ffbe0b'
            onPress={() =>
              this.setState({isFrontCamera: !this.state.isFrontCamera})
            }
            style={{...styles.captureButton, backgroundColor: 'transparent'}}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    flex: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 29,
    height: 58,
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 15,
    // paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    // paddingVertical: 8,
    position: 'absolute',
    top: 0,
    zIndex: 4,
    width: '100%',
  },
});

export default TakePic;
