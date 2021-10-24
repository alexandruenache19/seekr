import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
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
  Incubator,
  Card
} from 'react-native-ui-lib'
import Toast from 'react-native-toast-message'
import { openSettings } from 'react-native-permissions'
import ImagePicker from 'react-native-image-crop-picker'
import FastImage from 'react-native-fast-image'
import { RNCamera } from 'react-native-camera'

import { ButtonWithText, ButtonWithIcon, Icon, ButtonWithTextIcon } from '_atoms'
import { Interactions } from '_actions'
import database from '@react-native-firebase/database'

const { addItem } = Interactions
const { WheelPicker } = Incubator

const currencyList = [
  { value: 'RON', label: 'RON' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' }
]

class ItemDetailsDialog extends Component {
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
      showItems: true,
      showDialog: false,
      products: []
    }

    this.showDialog = this.showDialog.bind(this)
    this.hideDialog = this.hideDialog.bind(this)
    this.handleAddItem = this.handleAddItem.bind(this)
    this.renderPrice = this.renderPrice.bind(this)
    this.handleChangePrice = this.handleChangePrice.bind(this)
    this.handleChangeQuantity = this.handleChangeQuantity.bind(this)
    this.handleChangeCurrency = this.handleChangeCurrency.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
    this.handleSelectImage = this.handleSelectImage.bind(this)
    this.takePicture = this.takePicture.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    const { eventInfo } = this.props

    try {
      this.productsListener = database()
        .ref(`events/${eventInfo.id}/products`)
        .on('value', async snapshot => {
          if (snapshot.exists()) {
            const productsObj = snapshot.val()
            this.setState({
              products: Object.values(productsObj)
            })
          }
        })
    } catch (e) { }
  }

  componentWillUnmount() {
    const { eventInfo } = this.props
    try {
      database()
        .ref(`events/${eventInfo.id}/products`)
        .off('value', this.productsListener)
    } catch (e) { }
  }

  renderItem({ item }) {
    console.log(item)
    return (
      <Card
        enableShadow={false}
        borderRadius={10}
        backgroundColor={Colors.grey60}
        activeScale={0.96}
        height='auto'
        style={styles.productContainer}
      >
        {item.imageURL && (
          <FastImage style={styles.image} source={{ uri: item.imageURL }} />
        )}

        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flex: 1,
            height: '100%',
            paddingLeft: 10
          }}
        >
          <View>
            {item.description ? (
              <Text
                numberOfLines={3}
                ellipsizeMode='tail'
                style={{ ...Typography.text70BO, lineHeight: 20, marginBottom: 3, color: Colors.black }}
              >
                {item.description}
              </Text>
            ) : null}
            <Text style={{ ...Typography.text70, color: Colors.black }}>
              {item.currentStock} in stock
            </Text>
            <Text style={{ ...Typography.text70, color: Colors.black }}>
              {item.price} {item.currency}
            </Text>
          </View>
          {/*  <ButtonWithTextIcon
              style={{
                padding: 10,
                backgroundColor: '#FFF',
                borderRadius: 10,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              text={check ? 'Packed' : 'Ready to pack'}
              textStyle={{paddingLeft: 10, ...Typography.text70BL}}
              iconType="Feather"
              iconName={check ? 'check-square' : 'square'}
              iconSize={22}
              iconColor={'#000'}
              onPress={this.check}
            /> */}
        </View>
      </Card>
    )
  }

  showDialog() {
    this.setState({ showDialog: true })
  }

  hideDialog() {
    this.setState({
      showDialog: false,
      showItems: true
    })
    // this.props.callback && this.props.callback();
  }

  handleDone() {
    this.hideDialog()
    this.props.callback && this.props.callback()
  }

  async handleAddItem() {
    const { eventInfo } = this.props
    const { price, quantity, currency, productImagePath, description } = this.state

    if (price && price !== 0 && quantity !== 0 && productImagePath !== null) {
      this.setState({ uploading: true })
      await addItem(
        eventInfo,
        price,
        quantity,
        currency,
        description,
        productImagePath,
        productId => {
          this.setState({
            uploading: false,
            price: null,
            quantity: 1,
            currency: 'RON',
            description: '',
            productImagePath: productImagePath,
            showItems: true
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
    this.setState({ currency: item })
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
      showDialog,
      price,
      quantity,
      currency,
      productImagePath,
      uploading,
      showCamera,
      isFrontCamera,
      showItems,
      products,
      description
    } = this.state

    return (
      <Dialog
        useSafeArea
        ignoreBackgroundPress
        key='dialog-key'
        top
        height='90%'
        panDirection={PanningProvider.Directions.TOP}
        containerStyle={styles.container}
        visible={showDialog}
        onDismiss={this.hideDialog}
        renderPannableHeader={() => {
          if (uploading || showCamera) {
            return null
          } else if (showItems) {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginHorizontal: 20,
                  marginTop: 20
                }}
              >
                <ButtonWithIcon
                  iconType='Feather'
                  iconName='chevron-down'
                  iconColor='#000'
                  iconSize={32}
                  style={{ marginRight: 10 }}
                  onPress={this.hideDialog}
                />
                <Text style={Typography.text50}>Products</Text>
              </View>
            )
          } else {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginHorizontal: 20,
                  marginTop: 20
                }}
              >
                <ButtonWithIcon
                  iconType='Feather'
                  iconName='chevron-left'
                  iconColor='#000'
                  iconSize={32}
                  style={{ marginRight: 10, marginLeft: -3 }}
                  onPress={() => this.setState({ showItems: true })}
                />
                <Text style={Typography.text50}>New Product</Text>
              </View>
            )
          }
        }}
      >
        {uploading ? (
          <View
            style={{
              borderRadius: 12,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: 300,
              backgroundColor: '#000'
            }}
          >
            <ActivityIndicator size='large' color='#FFF' />
            <Text style={{ fontWeight: 'bold', marginTop: 15, color: '#FFF' }}>
              Uploading...
            </Text>
          </View>
        ) : showCamera ? (
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
              <Pressable
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
              </Pressable>
              <ButtonWithIcon
                iconType='Ionicons'
                iconName='camera-reverse'
                iconSize={31}
                iconColor='#FFFFFF'
                // iconColor='#ffbe0b'
                onPress={() =>
                  this.setState({ isFrontCamera: !this.state.isFrontCamera })}
                style={{
                  ...styles.captureButton,
                  backgroundColor: 'transparent'
                }}
              />
            </View>
          </View>
        ) : showItems ? (
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1
            }}
          >
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 1,
                width: '100%'
              }}
            >
              <FlatList
                data={products}
                style={{ flex: 1, width: '100%', marginTop: 10 }}
                showsVerticalScrollIndicator={false}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => item.imageURL + index}
              />
              <ButtonWithTextIcon
                style={{ marginTop: 10, padding: 12, borderRadius: 15 }}
                iconType='Feather'
                iconName='plus'
                iconSize={28}
                iconColor='#000'
                iconAfterText
                textStyle={{ ...styles.buttonText, marginRight: 10, color: '#000' }}
                onPress={() => this.setState({ showItems: false })}
                text='Add Product'
              />
            </View>
            <ButtonWithText
              style={{ ...styles.button, width: '100%', marginTop: 10 }}
              textStyle={styles.buttonText}
              onPress={this.handleDone}
              text='Done'
            />
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            style={{ flex: 1 }}
          >
            <View style={{ paddingHorizontal: 20, marginTop: 10, paddingVertical: 10, backgroundColor: '#FFF', zIndex: 5 }}>
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
                style={{
                  ...Typography.text70
                }}
              />
            </View>
            <View
              style={{
                paddingHorizontal: 20,
                paddingBottom: 20,
                marginTop: -20,
                flex: 1,
                justifyContent: 'space-between'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
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
                    {'in stock'}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: -10,
                  flex: 1
                }}
              >
                <Pressable
                  onPress={() => {
                    this.setState({ showCamera: true })
                  }}
                  style={{ width: '100%' }}
                >
                  {productImagePath ? (
                    <FastImage
                      style={{
                        width: '100%',
                        flex: 1,
                        borderRadius: 10,
                        marginTop: 10,
                        marginBottom: 10
                      }}
                      source={{ uri: productImagePath }}
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
                </Pressable>
              </View>

              <ButtonWithText
                style={{ ...styles.button, marginTop: 10 }}
                textStyle={styles.buttonText}
                onPress={this.handleAddItem}
                text='Add'
              />
            </View>
          </KeyboardAvoidingView>
        )}
        <Toast ref={ref => Toast.setRef(ref)} />
      </Dialog>
    )
  }
}

export default ItemDetailsDialog

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
  productContainer: {
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10
  },
  buttonText: {
    ...Typography.text50,
    color: '#FFF'
  },
  cardContainer: {
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  }
})
