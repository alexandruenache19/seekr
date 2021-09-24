import React, {PureComponent} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {ButtonWithText} from '_atoms';
import {
  Dialog,
  PanningProvider,
  MaskedInput,
  Typography,
  Colors,
} from 'react-native-ui-lib';

class ItemDetailsDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
    };

    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.addItem = this.addItem.bind(this);
    this.renderPrice = this.renderPrice.bind(this);
    this.renderQuantity = this.renderQuantity.bind(this);
  }

  componentDidMount() {
    // this.priceInput.focus();
  }
  showDialog() {
    this.setState({showDialog: true});
  }

  hideDialog() {
    this.setState({showDialog: false});
  }

  addItem() {
    this.hideDialog();
    this.props.callback && this.props.callback();
  }

  renderPrice(value) {
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
            color: hasValue ? '#000' : '#222',
          }}>
          {hasValue ? value : '00'}
        </Text>
        <Text style={{color: '#000'}}>$</Text>
      </View>
    );
  }

  renderQuantity(value) {
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
            color: hasValue ? '#000' : '#222',
          }}>
          {hasValue ? value : '0'}
        </Text>
      </View>
    );
  }
  render() {
    const {showDialog} = this.state;

    return (
      <Dialog
        migrate
        useSafeArea
        ignoreBackgroundPress
        key={'dialog-key'}
        bottom={true}
        height={400}
        panDirection={PanningProvider.Directions.DOWN}
        containerStyle={styles.container}
        visible={showDialog}
        onDismiss={this.hideDialog}
        renderPannableHeader={() => {
          return (
            <Text style={{margin: 20, ...Typography.text40}}>Item details</Text>
          );
        }}>
        <View style={{margin: 20, justifyContent: 'space-between', flex: 1}}>
          <View>
            <Text style={{...Typography.text40, color: Colors.grey40}}>
              Price
            </Text>
            <MaskedInput
              ref={r => (this.priceInput = r)}
              renderMaskedText={this.renderPrice}
              keyboardType={'numeric'}
            />
          </View>
          <View>
            <Text style={{...Typography.text40, color: Colors.grey40}}>
              Quantity
            </Text>
            <MaskedInput
              ref={r => (this.quantityInput = r)}
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
      </Dialog>
    );
  }
}

export default ItemDetailsDialog;

const styles = StyleSheet.create({
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
