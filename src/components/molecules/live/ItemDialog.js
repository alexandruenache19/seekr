import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView
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

import { ButtonWithText, ButtonWithIcon, Icon } from '_atoms'
import { Interactions } from '_actions'
import { Transitions } from '_nav'
import FastImage from 'react-native-fast-image'

const { addItem, uploadImageToS3 } = Interactions
const { openModal } = Transitions
const { WheelPicker } = Incubator
const currencyList = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'RON', label: 'RON' }
]

class ItemDetailsDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDialog: false,
      priceFocus: false,
      stockFocus: false,
      price: 0,
      quantity: 1,
      currency: 'USD',
      productImagePath: null
    }

    this.showDialog = this.showDialog.bind(this)
    this.hideDialog = this.hideDialog.bind(this)
    this.handleAddItem = this.handleAddItem.bind(this)
    this.renderPrice = this.renderPrice.bind(this)
    this.renderQuantity = this.renderQuantity.bind(this)
    this.handleChangePrice = this.handleChangePrice.bind(this)
    this.handleChangeQuantity = this.handleChangeQuantity.bind(this)
    this.handleChangeCurrency = this.handleChangeCurrency.bind(this)
  }

  showDialog() {
    this.setState({ showDialog: true })
  }

  hideDialog() {
    this.setState({ showDialog: false })
  }

  async handleAddItem() {
    const { eventInfo } = this.props
    const { price, quantity, currency, productImagePath } = this.state

    if (price !== 0 && quantity !== 0 && productImagePath !== null) {
      this.hideDialog()
      await addItem(eventInfo, price, quantity, currency, productImagePath)
      this.props.callback && this.props.callback()
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
    const { priceFocus, currency } = this.state
    const hasValue = value && value.length > 0

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            ...Typography.text50,
            color: hasValue ? '#000' : '#888',
            fontSize: priceFocus ? 32 : 24,
            lineHeight: 34
          }}
        >
          {hasValue ? value : '00'}
        </Text>
      </View>
    )
  }

  renderQuantity(value) {
    const { stockFocus, quantity } = this.state
    const hasValue = value > 0
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            ...Typography.text50,
            color: hasValue ? '#000' : '#888',
            fontSize: stockFocus ? 32 : 24,
            lineHeight: 34
          }}
        >
          {hasValue ? value : '0'}
        </Text>
        <Text style={{ ...Typography.text60, paddingRight: 5, marginLeft: 10 }}>
          {value > 1 ? 'items' : 'item'}
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

  render() {
    const { showDialog, price, quantity, currency, productImagePath } = this.state

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{}}
      >
        <Dialog
          useSafeArea
          ignoreBackgroundPress
          key='dialog-key'
          top
          height={400}
          panDirection={PanningProvider.Directions.TOP}
          containerStyle={styles.container}
          visible={showDialog}
          onDismiss={this.hideDialog}
          renderPannableHeader={() => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 20,
                  marginTop: 20
                }}
              >
                <ButtonWithIcon
                  style={{ paddingRight: 10 }}
                  iconType='Feather'
                  iconName='chevron-down'
                  iconColor='#000'
                  iconSize={30}
                  onPress={this.hideDialog}
                />
                <Text style={Typography.text40}>Item details</Text>
              </View>
            )
          }}
        >
          <View
            // contentContainerStyle={{
            //   justifyContent: 'space-between',
            //   minHeight: 100
            // }}
            style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
              marginTop: 0,
              flex: 1,
              justifyContent: 'space-between',
              height: 300
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxHeight: 80
              }}
            >
              <Text style={{ ...Typography.text50, color: Colors.grey40 }}>
                Price:
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10
                }}
              >
                <MaskedInput
                  ref={r => (this.priceInput = r)}
                  onChangeText={this.handleChangePrice}
                  onFocus={() => this.setState({ priceFocus: true })}
                  onBlur={() => this.setState({ priceFocus: false })}
                  renderMaskedText={this.renderPrice}
                  keyboardType='numeric'
                />
                <WheelPicker
                  items={currencyList}
                  numberOfVisibleRows={3}
                  style={{ marginLeft: 10 }}
                  onChange={this.handleChangeCurrency}
                  selectedValue={currency}
                  activeTextColor='#000'
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
                backgroundColor: '#FFFFFF',
                paddingTop: 10,
                marginTop: -5
              }}
            >
              <Text style={{ ...Typography.text50, color: Colors.grey40 }}>
                Stock:
              </Text>
              <MaskedInput
                value={'' + quantity}
                ref={r => (this.quantityInput = r)}
                onChangeText={this.handleChangeQuantity}
                onFocus={() => this.setState({ stockFocus: true })}
                onBlur={() => this.setState({ stockFocus: false })}
                renderMaskedText={this.renderQuantity}
                keyboardType='numeric'
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
              }}
            >
              {/* <Text style={{ ...Typography.text50, color: Colors.grey40 }}>
                Product Pic:
              </Text> */}
              <Pressable
                onPress={() => {
                  openModal(
                    'TakePic',
                    'TakePic',
                    {
                      setProductImagePath: async (imgPath) => {
                        this.setState({ productImagePath: imgPath })
                      }
                    },
                    { modalPresentationStyle: 'fullScreen' }
                  )
                }}
                style={{ width: '100%' }}
              >
                {productImagePath ? (
                  <FastImage
                    style={{
                      width: '100%',
                      height: 100,
                      borderRadius: 10
                    }}
                    source={{ uri: productImagePath }}
                  />
                ) : (
                  <View style={{
                    width: '100%',
                    height: 100,
                    borderRadius: 10,
                    backgroundColor: Colors.grey40,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon
                        iconType='Feather'
                        iconName='camera'
                        iconColor='#FFF'
                        iconSize={20}
                      />
                    </View>
                    <Text style={{ ...Typography.text80, marginTop: 5 }}>Upload product picture</Text>
                  </View>
                )}
              </Pressable>
            </View>

            <ButtonWithText
              style={{ ...styles.button, marginTop: 10 }}
              textStyle={styles.buttonText}
              onPress={this.handleAddItem}
              text='Done'
            />
          </View>
          <Toast ref={ref => Toast.setRef(ref)} />
        </Dialog>
      </KeyboardAvoidingView>
    )
  }
}

export default ItemDetailsDialog

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1
  },
  button: {
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 20
  }
})
