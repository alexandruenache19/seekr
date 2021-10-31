import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card, Typography, Colors} from 'react-native-ui-lib';
import FastImage from 'react-native-fast-image';
import {ButtonWithTextIcon} from '_atoms';
import {Interactions} from '_actions';
const {updateOrderProductStatus} = Interactions;
class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: props.product.isPacked,
    };
    this.check = this.check.bind(this);
  }

  check() {
    const {eventId, orderId, product} = this.props;
    const {check} = this.state;
    if (eventId) {
      updateOrderProductStatus(eventId, orderId, product.id, !check);
      this.setState({check: !check});
    }
  }

  render() {
    const {product} = this.props;
    const {check} = this.state;
    return (
      <Card
        enableShadow={false}
        borderRadius={10}
        backgroundColor={Colors.grey60}
        activeScale={0.96}
        height={130}
        style={styles.container}>
        {product.imageURL && (
          <FastImage style={styles.image} source={{uri: product.imageURL}} />
        )}

        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flex: 1,
            height: '100%',
            paddingLeft: 10,
          }}>
          <View>
            <Text style={{...Typography.text50, color: Colors.black}}>
              Quantity: {product.quantity}
            </Text>
            <Text style={{...Typography.text70, color: Colors.black}}>
              Total: {product.priceToPay} {product.currency}
            </Text>
          </View>
          <ButtonWithTextIcon
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
          />
        </View>
      </Card>
    );
  }
}

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: '100%',
    borderRadius: 10,
  },
});
