import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';

import {Typography} from 'react-native-ui-lib';
import {captureScreen} from 'react-native-view-shot';
import {ButtonWithTextIcon, ButtonWithText} from '_atoms';
import {ProductListDialog, NewProductDialog} from '_molecules';
import {eventsRef} from '../../../config/firebase';
import {Interactions, HelperActions} from '_actions';
const {generateId} = HelperActions;
const {uploadImageToS3, getProductInfo} = Interactions;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class LiveActionsSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productInfo: null,
      productId: null,
      auctionPrice: 0,
    };
    this.goToNextItem = this.goToNextItem.bind(this);
    this.handleStartAuction = this.handleStartAuction.bind(this);
    this.handleAdd10s = this.handleAdd10s.bind(this);
  }

  componentDidMount() {
    const {eventInfo} = this.props;

    this.productInfoListener = eventsRef
      .child(`${eventInfo.id}/info/currentProductId`)
      .on('value', async snapshot => {
        const productId = snapshot.val();
        // const productInfo = await getProductInfo(eventInfo, productId);

        this.currentProductListener = eventsRef
          .child(`${eventInfo.id}/products/${productId}`)
          .on('value', async snapshot => {
            const productInfo = snapshot.val();
            if (snapshot.exists()) {
              if (
                productInfo.auctionPrice &&
                productInfo.auctionPrice > this.state.auctionPrice &&
                productInfo.auctionTimeRemaining <= 10
              ) {
                this.setState({
                  productInfo: productInfo,
                  auctionPrice: productInfo.auctionPrice,
                });
                this.handleAdd10s();
              } else {
                this.setState({
                  productInfo: productInfo,
                  auctionPrice: productInfo.auctionPrice,
                });
              }
            }
          });
      });
  }

  componentWillUnmount() {
    const {eventInfo} = this.props;
    eventsRef
      .child(`${eventInfo.id}/info/currentProductId`)
      .off('value', this.productInfoListener);
  }

  goToNextItem() {
    this.dialog.showDialog();
    // captureScreen({
    //   format: 'jpg',
    //   quality: 0.8,
    // }).then(
    //   async uri => {
    //     const imageURL = await uploadImageToS3(
    //       uri,
    //       'seekr-product-images',
    //       generateId(6),
    //       'profile-images',
    //     );
    //     console.log('imageURL', imageURL);
    //   },
    //   error => console.error('Oops, snapshot failed', error),
    // )
  }

  async handleAdd10s() {
    const {eventInfo} = this.props;
    const {productInfo} = this.state;

    if (productInfo) {
      const timeRemainingSn = await eventsRef
        .child(
          `${eventInfo.id}/products/${productInfo.id}/auctionTimeRemaining`,
        )
        .once('value');
      const auctionTimeRemaining = timeRemainingSn.val();

      eventsRef.child(`${eventInfo.id}/products/${productInfo.id}`).update({
        auctionTimeRemaining: auctionTimeRemaining + 10,
        auctionOngoing: true,
      });

      this.handleStartAuction();
    }
  }

  async handleStartAuction() {
    const {eventInfo} = this.props;
    const {productInfo} = this.state;

    clearInterval(this.classInterval);

    this.classInterval = setInterval(async () => {
      const timeRemainingSn = await eventsRef
        .child(
          `${eventInfo.id}/products/${productInfo.id}/auctionTimeRemaining`,
        )
        .once('value');
      let auctionTimeRemaining = timeRemainingSn.val();
      console.log('auctionTimeRemaining', auctionTimeRemaining);

      auctionTimeRemaining -= 1;
      eventsRef.child(`${eventInfo.id}/products/${productInfo.id}`).update({
        auctionTimeRemaining: auctionTimeRemaining,
        auctionOngoing: auctionTimeRemaining > 0,
      });

      if (auctionTimeRemaining <= 0) {
        clearInterval(this.classInterval);
      }
    }, 1000);
  }

  render() {
    const {eventInfo} = this.props;
    const {productInfo} = this.state;

    if (!productInfo) {
      return (
        <View
          style={{
            width: '100%',
            height: '10%',
            backgroundColor: '#282B28',
            borderRadius: 15,
          }}>
          <ButtonWithText
            style={{
              ...styles.nextButton,
              backgroundColor: '#282B28',
              flex: 1,
            }}
            textStyle={{
              ...styles.text,
              textAlign: 'center',
              color: '#FFF',
            }}
            iconType="Feather"
            iconName="arrow-right"
            iconSize={24}
            iconColor="#000"
            iconAfterText
            onPress={this.goToNextItem}
            text="Add Product"
          />
          <NewProductDialog
            eventInfo={eventInfo}
            ref={r => (this.dialog = r)}
          />
        </View>
      );
    }
    return (
      <View
        style={{
          width: '100%',
          height: '10%',
          backgroundColor: '#282B28',
          borderRadius: 15,
        }}>
        {productInfo && productInfo.isForAuction ? (
          <View style={{...styles.container, flex: 1}}>
            <View
              style={{
                // width: '100%',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '50%',
              }}>
              <Text style={{color: '#FFF', fontSize: 16}}>
                {productInfo.currency}
                <Text style={Typography.text50}>
                  {productInfo.auctionPrice}
                </Text>
              </Text>

              <Text
                style={{
                  ...Typography.text65BL,
                  marginLeft: 10,
                  color:
                    productInfo.auctionTimeRemaining <= 15
                      ? '#FF6666'
                      : '#fff3b0',
                }}>
                {productInfo.auctionTimeRemaining === 0
                  ? 'Finished'
                  : `00:${
                      productInfo.auctionTimeRemaining > 9
                        ? productInfo.auctionTimeRemaining
                        : '0' + productInfo.auctionTimeRemaining
                    }`}
              </Text>
            </View>

            {productInfo.auctionOngoing ? (
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  ...styles.nextButton,
                  flex: 1,
                }}
                onPress={this.handleAdd10s}>
                <Text
                  style={{
                    ...styles.text,
                    textAlign: 'center',
                  }}>
                  {'Add 10s'}
                </Text>
              </TouchableOpacity>
            ) : productInfo.auctionTimeRemaining <= 0 ? (
              <ButtonWithText
                style={{...styles.nextButton, flex: 1, marginLeft: 10}}
                textStyle={{
                  ...styles.text,
                  textAlign: 'center',
                }}
                iconType="Feather"
                iconName="arrow-right"
                iconSize={24}
                iconColor="#000"
                iconAfterText
                onPress={this.goToNextItem}
                text="Next Product"
              />
            ) : (
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  ...styles.nextButton,
                  flex: 1,
                }}
                onPress={this.handleStartAuction}>
                <Text
                  style={{
                    ...styles.text,
                    textAlign: 'center',
                  }}>
                  {'Start auction'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={{...styles.container, flex: 1}}>
            {productInfo.currentStock !== 0 ? (
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
                {productInfo.isForAuction ? null : (
                  <Text style={{...styles.detailsText, paddingLeft: 10}}>
                    {' items'}
                    <Text style={Typography.text50}>
                      {productInfo.currentStock}
                    </Text>
                  </Text>
                )}
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                }}>
                <Text style={styles.detailsText}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    Stock is 0
                  </Text>
                </Text>
              </View>
            )}

            <ButtonWithText
              style={{...styles.nextButton, flex: 1, marginLeft: 10}}
              textStyle={{
                ...styles.text,
                textAlign: 'center',
              }}
              iconType="Feather"
              iconName="arrow-right"
              iconSize={24}
              iconColor="#000"
              iconAfterText
              onPress={this.goToNextItem}
              text="Next Product"
            />

            {/* <ProductListDialog eventInfo={eventInfo} ref={r => (this.dialog = r)} /> */}
          </View>
        )}
        <NewProductDialog eventInfo={eventInfo} ref={r => (this.dialog = r)} />
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
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextButton: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 15,
  },
  text: {
    ...Typography.text60,
  },
  detailsText: {
    fontSize: 16,
    paddingLeft: 5,
    color: '#FFF',
  },
});
