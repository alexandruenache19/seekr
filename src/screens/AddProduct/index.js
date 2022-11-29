import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  FlatList
} from 'react-native'
import {
  Dialog,
  PanningProvider,
  MaskedInput,
  Typography,
  Colors,
  Incubator
} from 'react-native-ui-lib'
import Toast from 'react-native-toast-message'
import { openSettings } from 'react-native-permissions'
import ImagePicker from 'react-native-image-crop-picker'
import FastImage from 'react-native-fast-image'
import { RNCamera } from 'react-native-camera'
import Clipboard from '@react-native-community/clipboard'

import { ButtonWithText, ButtonWithIcon, Icon, ButtonWithTextIcon } from '_atoms'
import { Interactions, HelperActions } from '_actions'

const { addProduct } = Interactions
const { generateId } = HelperActions
const { WheelPicker } = Incubator

const currencyList = [
  { value: 'RON', label: 'RON' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' }
]

class AddProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      price: null,
      quantity: 1,
      currency: 'RON',
      description: '',
      productImagePath: null,
      uploading: false,
      showCamera: false,
      isFrontCamera: false,
      complete: false,
      productId: '',
      copied: false
    }

    this.handleAddItem = this.handleAddItem.bind(this)
    this.renderPrice = this.renderPrice.bind(this)
    this.handleChangePrice = this.handleChangePrice.bind(this)
    this.handleChangeQuantity = this.handleChangeQuantity.bind(this)
    this.handleChangeCurrency = this.handleChangeCurrency.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
    this.handleSelectImage = this.handleSelectImage.bind(this)
    this.takePicture = this.takePicture.bind(this)
    this.copy = this.copy.bind(this)
  }

  async handleAddItem() {
    const { price, quantity, currency, productImagePath, description } =
      this.state
    const { user } = this.props
    const productId = generateId(7)

    if (price && price !== 0 && quantity !== 0 && productImagePath !== null) {
      this.setState({ uploading: true })

      await addProduct(
        user.uid,
        productId,
        price,
        quantity,
        currency,
        description,
        productImagePath,
        () => {
          this.setState({
            uploading: false,
            complete: true,
            productId: productId,
            price: null,
            quantity: 1,
            currency: 'RON',
            description: '',
            productImagePath: null
          })
        }
      )
    } else {
      Toast.show({
        type: 'error',
        text1: 'Add price, quantity and a picture',
        text2: 'Price & Quantity cannot be 0',
        position: 'bottom'
      })
    }
  }

  handleChangeCurrency(item) {
    this.setState({
      currency: item
    })
  }

  renderPrice(value) {
    const { price } = this.state
    const hasValue = price && price.length > 0

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 2,
          borderColor: '#000',
          marginRight: 10
        }}
      >
        <Text
          style={{
            ...Typography.text50,
            color: hasValue ? '#000' : '#888',
            fontSize: 24,
            lineHeight: 34
          }}
        >
          {hasValue ? price : '00'}
        </Text>
      </View>
    )
  }

  handleChangePrice(value) {
    this.setState({ price: value })
  }

  handleChangeQuantity(value) {
    this.setState({ quantity: value })
  }

  async takePicture() {
    const { setProductImagePath } = this.props
    if (this.camera) {
      const options = {
        quality: 0.8,
        width: 750
      }
      const data = await this.camera.takePictureAsync(options)
      this.setState({
        productImagePath: data.uri,
        showCamera: false
      })
    }
  }

  handleChangeDescription(val) {
    this.setState({ description: val })
  }

  copy() {
    const { productId } = this.state
    this.setState(
      {
        copied: true
      },
      async () => {
        Clipboard.setString(`seekrlive.com/p/${productId}`)
      }
    )
  }

  async handleSelectImage() {
    const { setProductImagePath } = this.props
    ImagePicker.openPicker({
      mediaType: 'photo',
      /* Should be use without cropping, just resizing after selection  */
      compressImageMaxWidth: 700,
      compressImageMaxHeight: 700,
      compressImageQuality: 0.65 // default 1 (Android) | 0.8 (iOS))
    })
      .then(async image => {
        if (image.path) {
          this.setState({ productImagePath: image.path, showCamera: false })
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
                style: 'cancel'
              },
              {
                text: 'Yes',
                onPress: () =>
                  openSettings().catch(() =>
                    console.warn('cannot open settings')
                  )
              }
            ]
          )
        }
      })
  }

  render() {
    const {
      price,
      quantity,
      currency,
      productImagePath,
      uploading,
      showCamera,
      isFrontCamera,
      description,
      complete,
      productId,
      copied
    } = this.state

    if (complete) {
      return (
        <View
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <View />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={Typography.text70}>
              Done! Here is the product link
            </Text>
            <ButtonWithTextIcon
              style={{
                justifyContent: 'space-between',
                backgroundColor: '#777',
                padding: 10,
                borderRadius: 10,
                marginTop: 20
              }}
              textStyle={{
                ...Typography.text70BL,
                color: Colors.white
              }}
              textContainerStyle={{
                padding: 5
              }}
              iconType='Feather'
              iconName={copied ? 'check-square' : 'copy'}
              iconSize={26}
              iconColor='#FFF'
              iconAfterText
              onPress={this.copy}
              text={`seekrlive.com/p/${productId}`}
            />
          </View>
          <ButtonWithTextIcon
            style={{ marginBottom: 20 }}
            iconType='Feather'
            iconName='plus'
            iconSize={24}
            iconColor='#000'
            iconAfterText
            textStyle={{
              ...Typography.text70BL,
              color: '#000'
            }}
            onPress={() => this.setState({ complete: false })}
            text='Add New Product'
          />
        </View>
      )
    }

    if (uploading) {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000'
          }}
        >
          <ActivityIndicator size='large' color='#FFF' />
          <Text style={{ fontWeight: 'bold', marginTop: 15, color: '#FFF' }}>
            Uploading...
          </Text>
        </View>
      )
    } else if (showCamera) {
      return (
        <View
          style={{
            width: '100%',
            backgroundColor: '#000',
            position: 'relative',
            flex: 1
          }}
        >
          <RNCamera
            ref={ref => {
              this.camera = ref
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
              buttonNegative: 'Cancel'
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel'
            }}
          />
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16
            }}
          >
            <ButtonWithIcon
              iconType='FontAwesome'
              iconName='image'
              iconSize={26}
              iconColor='#FFFFFF'
              // iconColor='#ffbe0b'
              onPress={this.handleSelectImage}
              style={{
                ...styles.captureButton,
                backgroundColor: 'transparent'
              }}
            />
            <TouchableOpacity
              onPress={this.takePicture}
              style={styles.captureButton}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  borderWidth: 2,
                  borderColor: '#000000'
                }}
              />
            </TouchableOpacity>
            <ButtonWithIcon
              iconType='Ionicons'
              iconName='camera-reverse'
              iconSize={31}
              iconColor='#FFFFFF'
              onPress={() =>
                this.setState({ isFrontCamera: !this.state.isFrontCamera })}
              style={{
                ...styles.captureButton,
                backgroundColor: 'transparent'
              }}
            />
          </View>
        </View>
      )
    } else {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            style={{ flex: 1, justifyContent: 'space-between', padding: 20 }}
          >
            <Text style={{ ...Typography.text30BL }}>New Product</Text>
            <View
              style={{
                justifyContent: 'space-between'
              }}
            >
              <TextInput
                ref={r => (this.priceInput = r)}
                placeholderTextColor='#888'
                returnKeyType='done'
                selectionColor='rgba(255,255,255,0.7)'
                clearButtonMode='never'
                keyboardAppearance='dark'
                returnKeyLabel='Done'
                multiline
                placeholder='Add a short title or description...'
                onChangeText={this.handleChangeDescription}
                value={description}
                style={Typography.text70}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <TextInput
                    ref={r => (this.priceInput = r)}
                    placeholderTextColor='#888'
                    returnKeyType='done'
                    selectionColor='rgba(255,255,255,0.7)'
                    keyboardType='numeric'
                    clearButtonMode='never'
                    keyboardAppearance='dark'
                    returnKeyLabel='Done'
                    placeholder='00'
                    onChangeText={this.handleChangePrice}
                    value={price}
                    style={{
                      ...Typography.text50,
                      color: price && price.length > 0 ? '#000' : '#888',
                      fontSize: 24
                    }}
                  />

                  <WheelPicker
                    items={currencyList}
                    numberOfVisibleRows={3}
                    style={{ marginLeft: 10 }}
                    onChange={this.handleChangeCurrency}
                    selectedValue={currency}
                    activeTextColor='#000'
                    inactiveTextColor={Colors.grey50}
                    textStyle={{
                      ...Typography.text60,
                      fontSize: 20,
                      marginLeft: 10
                    }}
                    align={WheelPicker.CENTER}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: 10
                  }}
                >
                  <WheelPicker
                    items={[...Array(20).keys()].map(n => {
                      return {
                        value: n + 1,
                        label: n + 1
                      }
                    })}
                    numberOfVisibleRows={3}
                    style={{ marginLeft: 10 }}
                    onChange={this.handleChangeQuantity}
                    selectedValue={quantity}
                    activeTextColor='#000'
                    inactiveTextColor={Colors.grey50}
                    textStyle={Typography.text60}
                    align={WheelPicker.CENTER}
                  />
                  <Text
                    style={{
                      ...Typography.text60,
                      fontSize: 20,
                      marginLeft: 10
                    }}
                  >
                    in stock
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  this.setState({ showCamera: true })
                }}
                style={{ width: '100%', paddingTop: 40 }}
              >
                {productImagePath ? (
                  <FastImage
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 10
                    }}
                    source={{ uri: productImagePath }}
                  />
                ) : (
                  <View
                    style={{
                      width: '100%',
                      height: 200,
                      marginVertical: 10,
                      borderRadius: 10,
                      backgroundColor: Colors.grey40,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#000',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon
                        iconType='Feather'
                        iconName='camera'
                        iconColor='#FFF'
                        iconSize={20}
                      />
                    </View>
                    <Text style={{ ...Typography.text80, marginTop: 5 }}>
                      Upload product picture
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* <View>
              <ButtonWithText
                style={{ ...styles.button, marginBottom: 20 }}
                textStyle={styles.buttonText}
                onPress={this.handleAddItem}
                text='Fixed Price'
              />
              <ButtonWithText
                style={{ ...styles.button, marginBottom: 20 }}
                textStyle={styles.buttonText}
                onPress={this.handleAddItem}
                text='Auction'
              />
            </View> */}
            <ButtonWithText
              style={{ ...styles.button, marginBottom: 20 }}
              textStyle={styles.buttonText}
              onPress={this.handleAddItem}
              text='Add Product'
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      )
    }
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(AddProduct)

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1
  },
  image: {
    width: 80,
    minHeight: 80,
    height: '100%',
    borderRadius: 10
  },
  preview: {
    flex: 1
  },
  button: {
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 20
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
    margin: 20
  },
  buttonText: {
    ...Typography.text50,
    color: '#FFF'
  }
})
