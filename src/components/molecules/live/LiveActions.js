import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {Typography} from 'react-native-ui-lib';
import {ButtonWithTextIcon} from '_atoms';
import {ItemDetailsDialog} from '_molecules';
import {eventsRef} from '../../../config/firebase';
import {Interactions} from '_actions';
const {getProductInfo} = Interactions;
class LiveActionsSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productInfo: null,
      productId: null,
    };
    this.goToNextItem = this.goToNextItem.bind(this);
  }

  componentDidMount() {
    const {eventInfo} = this.props;
    const {productId} = this.state;

    this.productInfoListener = eventsRef
      .child(`${eventInfo.id}/info/currentProductId`)
      .on('value', async snapshot => {
        const productId = snapshot.val();
        // const productInfo = await getProductInfo(eventInfo, productId);

        eventsRef
          .child(`${eventInfo.id}/products/${productId}`)
          .on('value', async snapshot => {
            const productInfo = snapshot.val();

            this.setState({
              productInfo: productInfo,
            });
          });
        // this.setState({
        //   productId: productId,
        // });
      });
  }

  goToNextItem() {
    this.dialog.showDialog();
  }

  render() {
    const {eventInfo} = this.props;
    const {productInfo} = this.state;
    return (
      <View style={styles.container}>
        {productInfo ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Text style={styles.detailsText}>
              {productInfo.currency}
              <Text style={Typography.text50}>{productInfo.price}</Text>
            </Text>
            <Text style={{...styles.detailsText, paddingLeft: 10}}>
              {' items'}
              <Text style={Typography.text50}>{productInfo.currentStock}</Text>
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Text style={styles.detailsText}>
              <Text style={{fontSize: 28, fontWeight: 'bold'}}>waiting...</Text>
            </Text>
          </View>
        )}

        <ButtonWithTextIcon
          style={styles.nextButton}
          textStyle={{
            ...styles.text,
            marginRight: 10,
          }}
          iconType="Feather"
          iconName={'arrow-right'}
          iconSize={24}
          iconColor={'#000'}
          iconAfterText
          onPress={this.goToNextItem}
          text="Next Item"
        />
        <ItemDetailsDialog eventInfo={eventInfo} ref={r => (this.dialog = r)} />
      </View>
    );
  }
}

export default LiveActionsSection;

const styles = StyleSheet.create({
  container: {
    height: '10%',
    backgroundColor: '#282B28',
    width: '100%',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextButton: {
    padding: 15,

    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  detailsText: {
    fontSize: 16,
    paddingLeft: 5,
    color: '#FFF',
  },
});
