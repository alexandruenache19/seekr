import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Typography} from 'react-native-ui-lib';
import ImagePicker from 'react-native-image-crop-picker';
import {Interactions, AuthActions, HelperActions} from '_actions';

const {uploadImageToS3} = Interactions;
const {updateProfileImage} = AuthActions;
const {generateId} = HelperActions;

class HomeHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageURL: props.info.imageURL,
    };
    this.handleChangeImage = this.handleChangeImage.bind(this);
  }

  handleChangeImage() {
    const {info} = this.props;
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(async image => {
        if (image.path) {
          const imageURL = await uploadImageToS3(
            image.path,
            'seekr-product-images',
            info.uid + generateId(3),
            'profile-images',
          );
          this.setState(
            {
              loadingImage: true,
              imageURL: imageURL,
            },
            () => {
              updateProfileImage(info.uid, imageURL);
            },
          );
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
    const {info} = this.props;
    return (
      <View style={styles.container}>
        <View>
          <Text style={Typography.text65L}>Hello,</Text>
          <Text style={Typography.text40}>{info.username}</Text>
        </View>

        <TouchableOpacity onPress={this.handleChangeImage}>
          <FastImage
            style={styles.profile}
            source={{uri: this.state.imageURL}}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
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
