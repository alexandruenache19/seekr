import React, {Component} from 'react';
import {View, Text, SafeAreaView, StyleSheet, FlatList} from 'react-native';
import {Dialog, PanningProvider, Typography, Colors} from 'react-native-ui-lib';

import {ButtonWithText, ButtonWithIcon, ButtonWithTextIcon} from '_atoms';

class OrderItemsDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      products: [],
      orderInfo: {},
    };

    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderOrderInfo = this.renderOrderInfo.bind(this);
  }

  renderOrderInfo() {
    const {orderInfo} = this.state;

    return (
      <View style={{paddingBottom: 30, justifyContent: 'space-between'}}>
        <Text style={{...Typography.text70BL, color: Colors.grey40}}>
          {orderInfo.name}
        </Text>

        <ButtonWithTextIcon
          style={{paddingTop: 15}}
          text={orderInfo.address + ' ' + orderInfo.addressDetails}
          textStyle={{
            ...Typography.text70BL,
            color: Colors.black,
            paddingLeft: 10,
          }}
          iconType={'Feather'}
          iconName={'home'}
          iconColor={'#000'}
          iconSize={22}
          // onPress={this.hideDialog}
        />

        <ButtonWithTextIcon
          style={{paddingTop: 15}}
          text={orderInfo.phoneNumber}
          textStyle={{
            ...Typography.text70BL,
            color: Colors.black,
            paddingLeft: 10,
          }}
          iconType={'Feather'}
          iconName={'phone'}
          iconColor={'#000'}
          iconSize={22}
          // onPress={this.hideDialog}
        />

        <Text style={{...Typography.text60, paddingTop: 10}}>Items</Text>
      </View>
    );
  }

  showDialog(order) {
    if (order.hasOwnProperty('products')) {
      const {products, info} = order;
      const productsArr = Object.values(products);

      this.setState({
        products: productsArr,
        orderInfo: info,
      });
    }
    this.setState({
      showDialog: true,
    });
  }

  hideDialog() {
    this.setState({showDialog: false});
    this.props.callback && this.props.callback();
  }

  renderItem({item}) {
    return (
      <View>
        <Text>{item.priceToPay}</Text>
      </View>
    );
  }

  render() {
    const {showDialog, products, orderInfo} = this.state;

    return (
      <Dialog
        migrate
        useSafeArea
        ignoreBackgroundPress
        key={'dialog-key'}
        bottom={true}
        height={'80%'}
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
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <ButtonWithIcon
                  style={{paddingRight: 10}}
                  iconType={'Feather'}
                  iconName={'chevron-down'}
                  iconColor={'#000'}
                  iconSize={30}
                  onPress={this.hideDialog}
                />
                <Text style={Typography.text40}>Order details</Text>
              </View>
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
          {this.renderOrderInfo()}
          <FlatList
            data={products}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item + index}
          />
          <ButtonWithText
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={this.handleAddItem}
            text="Done"
          />
        </View>
      </Dialog>
    );
  }
}

export default OrderItemsDialog;

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
