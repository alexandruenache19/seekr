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
} from 'react-native-ui-lib';
import Toast from 'react-native-toast-message';
import {ButtonWithText, ButtonWithIcon} from '_atoms';
class ItemDetailsDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      priceFocus: false,
      stockFocus: false,
      price: 0,
      quantity: 0,
    };

    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.addItem = this.addItem.bind(this);
    this.renderPrice = this.renderPrice.bind(this);
    this.renderQuantity = this.renderQuantity.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
  }

  componentDidMount() {}

  showDialog() {
    this.setState({showDialog: true});
  }

  hideDialog() {
    this.setState({showDialog: false});
  }

  addItem() {
    const {price, quantity} = this.state;
    if (price !== 0 && quantity !== 0) {
      this.hideDialog();
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

  renderPrice(value) {
    const {priceFocus} = this.state;
    const hasValue = value && value.length > 0;
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
            fontSize: priceFocus ? 26 : 20,
          }}>
          {hasValue ? value : '00'}
        </Text>
        <Text style={{color: '#000'}}>$</Text>
      </View>
    );
  }

  renderQuantity(value) {
    const {stockFocus} = this.state;
    const hasValue = value && value.length > 0;
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
            fontSize: stockFocus ? 26 : 20,
          }}>
          {hasValue ? value : '0'}
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
    const {showDialog} = this.state;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{}}>
        <Dialog
          migrate
          useSafeArea
          ignoreBackgroundPress
          key={'dialog-key'}
          // bottom={true}
          height={400}
          panDirection={PanningProvider.Directions.DOWN}
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
          <View style={{margin: 20, justifyContent: 'space-between', flex: 1}}>
            <View>
              <Text style={{...Typography.text40, color: Colors.grey40}}>
                Price
              </Text>
              <MaskedInput
                ref={r => (this.priceInput = r)}
                onChangeText={this.handleChangePrice}
                onFocus={() => this.setState({priceFocus: true})}
                onBlur={() => this.setState({priceFocus: false})}
                renderMaskedText={this.renderPrice}
                keyboardType={'numeric'}
              />
            </View>
            <View>
              <Text style={{...Typography.text40, color: Colors.grey40}}>
                Stock
              </Text>
              <MaskedInput
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
              onPress={this.addItem}
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
