import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {ButtonWithTextIcon} from '_atoms';
import {ItemDetailsDialog} from '_molecules';
import database from '@react-native-firebase/database';

class ActionsSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {productInfo: null};

    this.goToNextItem = this.goToNextItem.bind(this);
  }

  componentDidMount() {
    const {eventItem} = this.props;
    this.productInfoListener = database()
      .ref(`events/${eventItem.id}/products/productId`)
      .on('value', snapshot => {
        this.setState({
          productInfo: snapshot.val(),
        });
      });
  }

  goToNextItem() {
    this.dialog.showDialog();
  }

  render() {
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
              <Text style={{fontSize: 28, fontWeight: 'bold'}}>
                {productInfo.price}
              </Text>
            </Text>
            <Text style={{...styles.detailsText, paddingLeft: 20}}>
              <Text style={{fontSize: 34, fontWeight: 'bold'}}>
                {productInfo.currentStock}
              </Text>
              {' items'}
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
        <ItemDetailsDialog ref={r => (this.dialog = r)} />
      </View>
    );
  }
}

export default ActionsSection;

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
    fontSize: 20,
    paddingLeft: 10,

    color: '#FFF',
  },
});
