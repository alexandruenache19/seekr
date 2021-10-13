import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Linking,
} from 'react-native';
import {Dialog, PanningProvider, Typography, Colors} from 'react-native-ui-lib';

import {ButtonWithText, ButtonWithIcon, ButtonWithTextIcon} from '_atoms';
import {ProductCard} from '_molecules';

import {Interactions} from '_actions';
const {updateOrderStatus} = Interactions;

class OrderItemsDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      products: [],
      orderInfo: {},
      eventId: '',
    };

    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderOrderInfo = this.renderOrderInfo.bind(this);
    this.complete = this.complete.bind(this);
    this.makeCall = this.makeCall.bind(this);
  }

  showDialog(order, eventId) {
    if (order.hasOwnProperty('products')) {
      const {products, info} = order;
      const productsArr = Object.values(products);

      this.setState({
        products: productsArr,
        orderInfo: info,
        eventId: eventId,
      });
    }
    this.setState({
      showDialog: true,
    });
  }

  hideDialog() {
    this.setState({showDialog: false});
  }

  makeCall() {
    const {orderInfo} = this.state;
    Linking.openURL(`tel:${orderInfo.phoneNumber}`);
  }

  complete() {
    const {eventId, orderInfo} = this.state;
    this.hideDialog();
    updateOrderStatus(eventId, orderInfo.id);
  }

  renderOrderInfo() {
    const {orderInfo} = this.state;

    return (
      <View style={{paddingBottom: 10, justifyContent: 'space-between'}}>
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <ButtonWithIcon
            style={{
              padding: 10,
              backgroundColor: Colors.grey60,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            iconType={'Feather'}
            iconName={'phone'}
            iconColor={'#000'}
            iconSize={30}
            onPress={this.makeCall}
          />
          <View style={{paddingLeft: 10}}>
            <Text style={{...Typography.text60}}>{orderInfo.name}</Text>
            <ButtonWithText
              style={{
                paddingTop: 5,
              }}
              text={orderInfo.phoneNumber}
              textStyle={{
                ...Typography.text70,
                color: Colors.black,
                // paddingLeft: 10,
              }}
              iconType={'Feather'}
              iconName={'phone'}
              iconColor={'#000'}
              iconSize={22}
              // onPress={this.hideDialog}
            />
          </View>
        </View>

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

        <Text
          style={{...Typography.text40, color: Colors.grey40, paddingTop: 30}}>
          Items
        </Text>
      </View>
    );
  }

  renderItem({item}) {
    const {orderInfo, eventId} = this.state;
    return (
      <ProductCard eventId={eventId} orderId={orderInfo.id} product={item} />
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
                <Text style={Typography.text70}>Order details</Text>
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
