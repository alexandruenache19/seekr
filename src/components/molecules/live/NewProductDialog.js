import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import {
  Dialog,
  PanningProvider,
  MaskedInput,
  Typography,
  Colors,
  Incubator,
  Switch,
  Card,
  Picker,
} from 'react-native-ui-lib';
import Toast from 'react-native-toast-message';
import {openSettings} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';

import {ButtonWithText, ButtonWithIcon, Icon} from '_atoms';
import {Interactions} from '_actions';
import database from '@react-native-firebase/database';

const {addItem} = Interactions;
const {WheelPicker} = Incubator;

const currencyList = [
  {value: 'RON', label: 'RON'},
  {value: 'USD', label: 'USD'},
  {value: 'EUR', label: 'EUR'},
];

class NewProductDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: null,
      quantity: 1,
      currency: 'RON',
      description: '',
      showDialog: false,
      isForAuction: false,
      products: [],
      currentProductId:
        props.eventInfo &&
        props.eventInfo.info &&
        props.eventInfo.info.currentProductId
          ? props.eventInfo.info.currentProductId
          : null,
    };

    this.hideDialog = this.hideDialog.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.renderPrice = this.renderPrice.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
    this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  showDialog() {
    this.setState({showDialog: true});
  }

  hideDialog() {
    this.setState({
      showDialog: false,
    });
    // this.props.callback && this.props.callback();
  }

  async handleAddItem(isForAuction) {
    const {eventInfo} = this.props;
    const {price, quantity, currency, description} = this.state;

    if (price && price !== 0 && quantity !== 0) {
      this.setState({uploading: true});
      await addItem(
        eventInfo,
        {
          price: parseFloat(price),
          currentStock: parseFloat(quantity),
          currency: currency,
          description: description || null,
          isForAuction: isForAuction,
          auctionTimeRemaining: isForAuction ? 30 : 0,
          auctionPrice: isForAuction ? parseFloat(price) : null,
        },
        productId => {
          console.log('productId', productId);
          this.setState({
            uploading: false,
            price: null,
            quantity: 1,
            currency: 'RON',
            description: '',
          });
          this.hideDialog();
          this.props.callback && this.props.callback();
        },
      );
    } else {
      Toast.show({
        type: 'error',
        text1: 'Add price & quantity',
        text2: 'Price & quantity cannot be 0',
        position: 'bottom',
      });
    }
  }

  handleChangeCurrency(item) {
    this.setState({currency: item});
  }

  renderPrice(value) {
    const {price} = this.state;
    const hasValue = price && price.length > 0;

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
          {hasValue ? price : '00'}
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

  handleChangeDescription(val) {
    this.setState({description: val});
  }

  render() {
    const {showDialog, price, quantity, currency, description, isForAuction} =
      this.state;

    return (
      <Dialog
        useSafeArea
        ignoreBackgroundPress
        key="dialog-key-22"
        center
        height="50%"
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
                justifyContent: 'flex-start',
                marginHorizontal: 20,
                marginTop: 20,
              }}>
              <ButtonWithIcon
                iconType="Feather"
                iconName="chevron-down"
                iconColor="#000"
                iconSize={32}
                style={{marginRight: 10}}
                onPress={this.hideDialog}
              />
              <Text style={Typography.text50}>Sell a new product</Text>
            </View>
          );
        }}>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1,
            padding: 20,
          }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            style={{flex: 1}}>
            <TextInput
              ref={r => (this.priceInput = r)}
              placeholderTextColor="#888"
              returnKeyType="done"
              clearButtonMode="never"
              keyboardAppearance="dark"
              returnKeyLabel="Done"
              //   multiline
              placeholder="(Optional) Add a short description..."
              onChangeText={this.handleChangeDescription}
              value={description}
              style={{
                ...Typography.text70,
                borderBottomColor: 'rgba(0,0,0,0.2)',
                paddingBottom: 10,
                borderBottomWidth: 1,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TextInput
                ref={r => (this.priceInput = r)}
                placeholderTextColor="#888"
                returnKeyType="done"
                selectionColor="rgba(255,255,255,0.7)"
                keyboardType="numeric"
                clearButtonMode="never"
                keyboardAppearance="dark"
                returnKeyLabel="Done"
                placeholder="00"
                onChangeText={this.handleChangePrice}
                value={price}
                style={{
                  ...Typography.text50,
                  color: price && price.length > 0 ? '#000' : '#888',
                  fontSize: 24,
                  textDecorationLine: 'underline',
                }}
              />

              <WheelPicker
                items={currencyList}
                numberOfVisibleRows={3}
                style={{marginLeft: 10}}
                onChange={this.handleChangeCurrency}
                selectedValue={currency}
                activeTextColor="#000"
                inactiveTextColor={Colors.grey50}
                textStyle={{
                  ...Typography.text60,
                  fontSize: 20,
                  marginLeft: 10,
                }}
                align={WheelPicker.CENTER}
              />
            </View>

            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <ButtonWithText
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => this.handleAddItem(true)}
                text="Auction"
              />
              <ButtonWithText
                style={{...styles.button, marginLeft: 10}}
                textStyle={styles.buttonText}
                onPress={() => this.handleAddItem(false)}
                text="Fixed Price"
              />
            </View>
          </KeyboardAvoidingView>
        </View>
        <Toast ref={ref => Toast.setRef(ref)} />
      </Dialog>
    );
  }
}

export default NewProductDialog;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  image: {
    width: 80,
    minHeight: 80,
    height: '100%',
    borderRadius: 10,
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
  productContainer: {
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  buttonText: {
    ...Typography.text60,
    color: '#FFF',
  },
  cardContainer: {
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
