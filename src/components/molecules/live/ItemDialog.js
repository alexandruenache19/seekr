import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
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

import {ButtonWithText, ButtonWithIcon} from '_atoms';
import {Interactions} from '_actions';

const {addItem} = Interactions;
const {WheelPicker} = Incubator;
const currencyList = [
  {value: 'USD', label: 'USD'},
  {value: 'EUR', label: 'EUR'},
  {value: 'RON', label: 'RON'},
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
    };

    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.renderPrice = this.renderPrice.bind(this);
    this.renderQuantity = this.renderQuantity.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
    this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
  }
  showDialog() {
    this.setState({showDialog: true});
  }

  hideDialog() {
    this.setState({showDialog: false});
  }

  async handleAddItem() {
    const {eventInfo} = this.props;
    const {price, quantity, currency} = this.state;

    if (price !== 0 && quantity !== 0) {
      this.hideDialog();
      await addItem(eventInfo, price, quantity, currency);
      this.props.callback && this.props.callback();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Add a price and quantity',
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
    const hasValue = value && value.length > 0;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: '#000',
        }}>
        <Text
          style={{
            ...Typography.text50,
            color: hasValue ? '#000' : '#888',
            fontSize: priceFocus ? 32 : 24,
            lineHeight: 34,
          }}>
          {hasValue ? value : '00'}
        </Text>

        {/*  <Text style={{color: '#000'}}>$</Text>*/}
      </View>
    );
  }

  renderQuantity(value) {
    const {stockFocus, quantity} = this.state;
    const hasValue = value > 0;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            ...Typography.text50,
            color: hasValue ? '#000' : '#888',
            fontSize: stockFocus ? 32 : 24,
            lineHeight: 34,
          }}>
          {hasValue ? value : '0'}
        </Text>
        <Text style={{...Typography.text60, paddingRight: 15, marginLeft: 10}}>
          {value > 1 ? 'items' : 'item'}
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

  render() {
    const {showDialog, price, quantity, currency} = this.state;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{}}>
        <Dialog
          migrate
          useSafeArea
          ignoreBackgroundPress
          key={'dialog-key'}
          top={true}
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
                  margin: 20,
                }}>
                <ButtonWithIcon
                  style={{paddingRight: 10}}
                  iconType={'Feather'}
                  iconName={'chevron-down'}
                  iconColor={'#000'}
                  iconSize={30}
                  onPress={this.hideDialog}
                />
                <Text style={Typography.text40}>Item details</Text>
              </View>
            );
          }}>
          <View
            style={{
              margin: 20,
              justifyContent: 'space-between',
              flex: 1,
              minHeight: 100,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{...Typography.text40, color: Colors.grey40}}>
                Price:
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MaskedInput
                  ref={r => (this.priceInput = r)}
                  onChangeText={this.handleChangePrice}
                  onFocus={() => this.setState({priceFocus: true})}
                  onBlur={() => this.setState({priceFocus: false})}
                  renderMaskedText={this.renderPrice}
                  keyboardType={'numeric'}
                />
                <WheelPicker
                  items={currencyList}
                  numberOfVisibleRows={3}
                  style={{marginLeft: 10}}
                  onChange={this.handleChangeCurrency}
                  selectedValue={currency}
                  activeTextColor={'#000'}
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
              }}>
              <Text style={{...Typography.text40, color: Colors.grey40}}>
                Stock:
              </Text>
              <MaskedInput
                value={'' + quantity}
                ref={r => (this.quantityInput = r)}
                onChangeText={this.handleChangeQuantity}
                onFocus={() => this.setState({stockFocus: true})}
                onBlur={() => this.setState({stockFocus: false})}
                renderMaskedText={this.renderQuantity}
                keyboardType={'numeric'}
              />
            </View>

            <ButtonWithText
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={this.handleAddItem}
              text="Done"
            />
          </View>
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
    marginBottom: 20,
  },
});
