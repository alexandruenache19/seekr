import React, { Component } from 'react'
import { View, StyleSheet, Text, Pressable, TouchableOpacity } from 'react-native'

import { Typography } from 'react-native-ui-lib'
import { captureScreen } from 'react-native-view-shot'
import { ButtonWithTextIcon, ButtonWithText } from '_atoms'
import { ProductListDialog, NewProductDialog } from '_molecules'
import { eventsRef } from '../../../config/firebase'
import { Interactions, HelperActions } from '_actions'
const { generateId } = HelperActions
const { uploadImageToS3, getProductInfo } = Interactions

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class LiveActionsSection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      productInfo: null,
      productId: null,
      secondsRemaining: 30
    }
    this.goToNextItem = this.goToNextItem.bind(this)
    this.handleStartAuction = this.handleStartAuction.bind(this)
    this.handleAdd10s = this.handleAdd10s.bind(this)
  }

  componentDidMount () {
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

  goToNextItem () {
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

  handleAdd10s () {
    this.setState({
      secondsRemaining: this.state.secondsRemaining + 10
    }, () => {
      this.handleStartAuction()
    })
  }

  async handleStartAuction () {
    const { eventInfo } = this.props
    const { productInfo } = this.state
    let { secondsRemaining } = this.state

    // function pollFunc(fn, timeout, interval) {
    //   var startTime = (new Date()).getTime()
    //   interval = interval || 1000
    //   let canPoll = true;

    //   (function p() {
    //     canPoll = ((new Date()).getTime() - startTime) <= timeout
    //     if (fn() && canPoll) { // ensures the function exucutes
    //       setTimeout(p, interval)
    //     }
    //   })()
    // }

    // eventsRef
    //   .child(`${eventInfo.id}/products/${productInfo.id}`)
    //   .update({
    //     auctionTimeRemaining: this.state.secondsRemaining,
    //     auctionOngoing: true
    //   })

    clearInterval(this.classInterval)

    this.classInterval = setInterval(() => {
      console.log('this.state.added', this.state.secondsRemaining)
      secondsRemaining -= 1
      eventsRef
        .child(`${eventInfo.id}/products/${productInfo.id}`)
        .update({
          auctionTimeRemaining: secondsRemaining,
          auctionOngoing: secondsRemaining >= 0
        })
      this.setState({
        secondsRemaining: secondsRemaining
      })
      if (secondsRemaining <= 0) {
        clearInterval(this.classInterval)
      }
    }, 1000)

    // pollFunc(async () => {
    //   eventsRef
    //     .child(`${eventInfo.id}/products/${productInfo.id}`)
    //     .update({
    //       auctionTimeRemaining: secondsRemaining
    //     })
    //   secondsRemaining -= 1
    //   this.setState({
    //     secondsRemaining: secondsRemaining,
    //   })
    // }, secondsRemaining * 1000, 1000)

    // await sleep(secondsRemaining * 1000)
  }

  render () {
    const { eventInfo } = this.props
    const { productInfo } = this.state
    return (
      <View style={{ width: '100%', height: '12%', minHeight: 90 }}>
        {productInfo && productInfo.isForAuction ? (
          <View style={{
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4
          }}
          >
            <Text style={Typography.text70}>
              {productInfo.auctionTimeRemaining === 0 ? (
                'Final Price: '
              ) : 'Current Price: '}
              <Text style={{ fontWeight: 'bold' }}>{`${productInfo.auctionPrice}${productInfo.currency}`}</Text>
            </Text>
            <Text style={Typography.text70}>
              {`00:${productInfo.auctionTimeRemaining > 0
                ? productInfo.auctionTimeRemaining
                : '0' + productInfo.auctionTimeRemaining
                }`}
            </Text>
          </View>
        ) : null}
        <View style={{ ...styles.container, flex: 1 }}>
          {productInfo ? (
            productInfo.isForAuction ? (
              productInfo.auctionTimeRemaining === 0 ? (
                <Text style={styles.detailsText}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    Auction has ended
                  </Text>
                </Text>
              ) : (
                productInfo.auctionOngoing ? (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={{
                      ...styles.nextButton,
                      flex: 1
                    }}
                    onPress={this.handleAdd10s}
                  >
                    <Text style={{
                      ...styles.text,
                      textAlign: 'center'
                    }}
                    >
                      {'Add 10s'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={{
                      ...styles.nextButton,
                      flex: 1
                    }}
                    onPress={this.handleStartAuction}
                  >
                    <Text style={{
                      ...styles.text,
                      textAlign: 'center'
                    }}
                    >
                      {'Start auction'}
                    </Text>
                  </TouchableOpacity>
                )
              )
            ) : (
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
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                      Stock is 0
                    </Text>
                  </Text>
                </View>
              )
            )
          ) : (
            null
          )}

          <ButtonWithText
            style={{ ...styles.nextButton, flex: 1, marginLeft: 10 }}
            textStyle={{
              ...styles.text,
              textAlign: 'center'
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
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    height: '100%',
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
