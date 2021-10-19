import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import {
  Dialog,
  PanningProvider,
  MaskedInput,
  Typography,
  Colors,
  Incubator,
} from 'react-native-ui-lib';
import Toast from 'react-native-toast-message';
import {openSettings} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import {RNCamera} from 'react-native-camera';

import {ButtonWithText, ButtonWithIcon, Icon} from '_atoms';
import {Interactions} from '_actions';
import {Transitions} from '_nav';

const {addItem} = Interactions;
const {openModal} = Transitions;
const {WheelPicker} = Incubator;

const currencyList = [
  {value: 'USD', label: 'USD'},
  {value: 'EUR', label: 'EUR'},
  {value: 'RON', label: 'RON'},
];

const itemsList = [
  {value: 1, label: 1},
  {value: 2, label: 2},
  {value: 3, label: 3},
  {value: 4, label: 4},
  {value: 5, label: 5},
  {value: 6, label: 6},
  {value: 7, label: 7},
  {value: 8, label: 8},
  {value: 9, label: 9},
];

class ItemDetailsDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      priceFocus: false,
      stockFocus: false,
      price: 0,
      quantity: 1,
      currency: 'USD',
      productImagePath: null,
      uploading: false,
      showCamera: false,
      isFrontCamera: false,
    };

    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.renderPrice = this.renderPrice.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
    this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.takePicture = this.takePicture.bind(this);
  }

  showDialog() {
    this.setState({showDialog: true});
  }

  hideDialog() {
    this.setState({showDialog: false});
  }

  async handleAddItem() {
    const {eventInfo} = this.props;
    const {price, quantity, currency, productImagePath} = this.state;

    if (price !== 0 && quantity !== 0 && productImagePath !== null) {
      this.setState({uploading: true});
      await addItem(
        eventInfo,
        price,
        quantity,
        currency,
        productImagePath,
        () => {
          this.props.callback();
          this.hideDialog();
          this.setState({uploading: false});
        },
      );
      // this.props.callback && this.props.callback()
    } else {
      Toast.show({
        type: 'error',
        text1: 'Add price, quantity and a picture',
        text2: 'Price & Quantity cannot be 0',
        position: 'bottom',
      });
    }
  }

  handleChangeCurrency(item) {
    this.setState({currency: item});
  }

  renderPrice(value) {
    const {priceFocus, currency} = this.state;
    const hasValue = value && value > 0;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 2,
          borderColor: '#000',
          marginRight: 10,
        }}>
        <Text
          style={{
            ...Typography.text50,
            color: hasValue ? '#000' : '#888',
            fontSize: 24,
            lineHeight: 34,
          }}>
          {hasValue ? value : '00'}
        </Text>
      </View>
    );
  }

  handleChangePrice(value) {
    this.setState({price: value});
  }

  handleChangeQuantity(value) {
    this.setState({quantity: value});
  }

  async takePicture() {
    const {setProductImagePath} = this.props;
    if (this.camera) {
      const options = {
        quality: 0.8,
        width: 750,
      };
      const data = await this.camera.takePictureAsync(options);
      this.setState({productImagePath: data.uri, showCamera: false});
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
          this.setState({productImagePath: image.path, showCamera: false});
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
    const {
      showDialog,
      price,
      quantity,
      currency,
      productImagePath,
      uploading,
      showCamera,
      isFrontCamera,
    } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{}}>
        <Dialog
          useSafeArea
          ignoreBackgroundPress
          key="dialog-key"
          top
          height={'90%'}
          panDirection={PanningProvider.Directions.TOP}
          containerStyle={styles.container}
          visible={showDialog}
          onDismiss={this.hideDialog}
          renderPannableHeader={() => {
            if (uploading) {
              return null;
            }
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: 20,
                  marginTop: 20,
                }}>
                <ButtonWithIcon
                  style={{paddingRight: 10}}
                  iconType="Feather"
                  iconName="chevron-down"
                  iconColor="#000"
                  iconSize={30}
                  onPress={this.hideDialog}
                />
                <Text style={Typography.text40}>Price / Stock</Text>
                <View />
              </View>
            );
          }}>
          {uploading ? (
            <View
              style={{
                borderRadius: 12,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 300,
                backgroundColor: '#1f1f1f',
              }}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={{fontWeight: 'bold', marginTop: 15, color: '#FFF'}}>
                Uploading...
              </Text>
            </View>
          ) : showCamera ? (
            <View
              style={{
                width: '100%',
                backgroundColor: '#000',
                position: 'relative',
                flex: 1,
              }}>
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
                  style={{
                    ...styles.captureButton,
                    backgroundColor: 'transparent',
                  }}
                />
                <Pressable
                  onPress={this.takePicture}
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
                  style={{
                    ...styles.captureButton,
                    backgroundColor: 'transparent',
                  }}
                />
              </View>
            </View>
          ) : (
            <View
              style={{
                paddingHorizontal: 20,
                paddingBottom: 20,
                marginTop: -10,
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  {/*  <Text style={{...Typography.text50, color: Colors.grey40}}>
                    Price:
                  </Text>*/}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <MaskedInput
                      value={price}
                      ref={r => (this.priceInput = r)}
                      onChangeText={this.handleChangePrice}
                      onFocus={() => this.setState({priceFocus: true})}
                      onBlur={() => this.setState({priceFocus: false})}
                      renderMaskedText={this.renderPrice}
                      keyboardType="numeric"
                    />
                    <WheelPicker
                      items={currencyList}
                      numberOfVisibleRows={3}
                      style={{marginLeft: 10}}
                      onChange={this.handleChangeCurrency}
                      selectedValue={currency}
                      activeTextColor="#000"
                      inactiveTextColor={Colors.grey50}
                      textStyle={Typography.text60}
                      align={WheelPicker.CENTER}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}>
                  {/*   <Text style={{...Typography.text50, color: Colors.grey40}}>
                    Stock:
                  </Text>*/}

                  <WheelPicker
                    items={itemsList}
                    numberOfVisibleRows={3}
                    style={{marginLeft: 10}}
                    onChange={this.handleChangeQuantity}
                    selectedValue={quantity}
                    activeTextColor="#000"
                    inactiveTextColor={Colors.grey50}
                    textStyle={Typography.text60}
                    align={WheelPicker.CENTER}
                  />
                  <Text
                    style={{
                      ...Typography.text60,
                      marginLeft: 20,
                    }}>
                    {quantity > 1 ? 'items' : 'item'}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                  flex: 1,
                }}>
                <Pressable
                  onPress={() => {
                    this.setState({showCamera: true});
                  }}
                  style={{width: '100%'}}>
                  {productImagePath ? (
                    <FastImage
                      style={{
                        width: '100%',
                        flex: 1,
                        borderRadius: 10,
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                      source={{uri: productImagePath}}
                    />
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        // height: 100,
                        flex: 1,
                        marginVertical: 10,
                        borderRadius: 10,
                        backgroundColor: Colors.grey40,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: '#000',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Icon
                          iconType="Feather"
                          iconName="camera"
                          iconColor="#FFF"
                          iconSize={20}
                        />
                      </View>
                      <Text style={{...Typography.text80, marginTop: 5}}>
                        Upload product picture
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>

              <ButtonWithText
                style={{...styles.button, marginTop: 10}}
                textStyle={styles.buttonText}
                onPress={this.handleAddItem}
                text="Done"
              />
            </View>
          )}
          <Toast ref={ref => Toast.setRef(ref)} />
        </Dialog>
      </KeyboardAvoidingView>
    );
  }
}

export default ItemDetailsDialog;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  button: {
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 20,
  },
  captureButton: {
    flex: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 29,
    height: 58,
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'center',
    margin: 20,
  },
});
