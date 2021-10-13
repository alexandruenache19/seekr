import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import {DotIndicator} from 'react-native-indicators';
import {openSettings} from 'react-native-permissions';
import {Typography, Colors} from 'react-native-ui-lib';

import {LoaderView, Label, Icon, ButtonWithTextIcon} from '_atoms';
import {Transitions, Service} from '_nav';
import {AuthActions, Interactions} from '_actions';
import {Constants} from '_styles';

const {pushScreen} = Transitions;
const {updateProfileImage} = AuthActions;
const {uploadImageToS3} = Interactions;

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingImage: false,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
  }

  componentDidMount() {
    this.setState({loading: false});
  }

  handleSelect() {
    const {uid} = this.props;
    const {photoURL} = this.state;

    const url =
      photoURL ||
      'https://cdn.dribbble.com/users/744745/screenshots/5916538/new_profile_pic.jpg';

    updateProfileImage(uid, url);
    pushScreen(Service.instance.getScreenId(), 'Complete', {uid: uid});
  }

  handleChangeImage() {
    const {uid} = this.props;
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
            uid,
            'profile-images',
          );
          this.setState({
            loadingImage: true,
            photoURL: imageURL,
          });
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
    const {loading, photoURL, loadingImage} = this.state;
    const {username} = this.props;

    if (loading) {
      return <LoaderView style={styles.loader} />;
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>{`Upload you profile image`}</Text>

          <TouchableOpacity onPress={this.handleChangeImage}>
            {loadingImage && (
              <View
                style={{
                  position: 'absolute',
                  zIndex: 90,
                  height: '100%',
                  width: '100%',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#FFF',
                }}>
                <DotIndicator size={8} color="white" />
              </View>
            )}

            <FastImage
              style={{
                height: 150,
                width: 150,
                borderRadius: 75,
              }}
              source={{
                uri:
                  photoURL ||
                  'https://cdn.dribbble.com/users/744745/screenshots/5916538/new_profile_pic.jpg',
              }}
              onLoadStart={() => this.setState({loadingImage: true})}
              onLoadEnd={() => this.setState({loadingImage: false})}
            />

            <View
              style={{
                height: 50,
                width: 50,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                right: 0,
                bottom: 5,
                backgroundColor: '#000',
                borderRadius: 25,
              }}>
              <Icon
                iconType="FontAwesome"
                iconName="camera"
                iconSize={28}
                iconColor={'#FFF'}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={this.handleSelect}>
              <Text style={styles.buttonText}>Next</Text>
              <FontAwesome name={'arrow-right'} color={'#FFF'} size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  loader: {
    height: Constants.DEVICE_HEIGHT,
    width: Constants.DEVICE_WIDTH,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    ...Typography.text30BL,
    textAlign: 'left',
    paddingBottom: 20,
  },
  extraInfo: {
    ...Typography.text70,
    color: Colors.grey40,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    ...Typography.text50,
    color: Colors.white,
  },
  footer: {
    width: '100%',
    marginBottom: 50,
  },
});

export default LoginScreen;
