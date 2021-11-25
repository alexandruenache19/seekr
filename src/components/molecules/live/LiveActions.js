import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'

import { Typography } from 'react-native-ui-lib'
import { captureScreen } from 'react-native-view-shot'
import { ButtonWithTextIcon, ButtonWithText } from '_atoms'
import { ProductListDialog, NewProductDialog } from '_molecules'
import { eventsRef } from '../../../config/firebase'
import { Interactions, HelperActions } from '_actions'
const { generateId } = HelperActions
const { uploadImageToS3, getProductInfo } = Interactions

class LiveActionsSection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      productInfo: null,
      productId: null
    }
    this.goToNextItem = this.goToNextItem.bind(this)
  }

  componentDidMount() {
    const { eventInfo } = this.props

    this.productInfoListener = eventsRef
      .child(`${eventInfo.id}/info/currentProductId`)
      .on('value', async snapshot => {
        const productId = snapshot.val()
        // const productInfo = await getProductInfo(eventInfo, productId);

        eventsRef
          .child(`${eventInfo.id}/products/${productId}`)
          .on('value', async snapshot => {
            const productInfo = snapshot.val()

            this.setState({
              productInfo: productInfo
            })
          })
        // this.setState({
        //   productId: productId,
        // });
      })
  }

  goToNextItem() {
    this.dialog.showDialog()
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

  render() {
    const { eventInfo } = this.props
    const { productInfo } = this.state
    return (
      <View style={styles.container}>
        {productInfo ? (
          productInfo.currentStock !== 0 ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-end'
              }}
            >
              <Text style={styles.detailsText}>
                {productInfo.currency}
                <Text style={Typography.text50}>{productInfo.price}</Text>
              </Text>
              {productInfo.isForAuction ? (
                null
              ) : (
                <Text style={{ ...styles.detailsText, paddingLeft: 10 }}>
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
                alignItems: 'flex-end'
              }}
            >
              <Text style={styles.detailsText}>
                <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
                  waiting...
                </Text>
              </Text>
            </View>
          )
        ) : (
          null
        )}

        <ButtonWithText
          style={{ ...styles.nextButton, flex: 1 }}
          textStyle={{
            ...styles.text,
            textAlign: 'center'
            // marginRight: 10
          }}
          iconType='Feather'
          iconName='arrow-right'
          iconSize={24}
          iconColor='#000'
          iconAfterText
          onPress={this.goToNextItem}
          text='Next Product'
        />

        {/* <ProductListDialog eventInfo={eventInfo} ref={r => (this.dialog = r)} /> */}
        <NewProductDialog eventInfo={eventInfo} ref={r => (this.dialog = r)} />
      </View>
    )
  }
}

export default LiveActionsSection

const styles = StyleSheet.create({
  container: {
    height: '10%',
    backgroundColor: '#282B28',
    width: '100%',
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nextButton: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 15
  },
  text: {
    ...Typography.text60
  },
  detailsText: {
    fontSize: 16,
    paddingLeft: 5,
    color: '#FFF'
  }
})
